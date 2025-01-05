import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import {
  createDraft,
  createInvoice,
} from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useAllDraftItems } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { button } from "../../../../../../../shared/buttons/Button";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../../shared/dropDown/DropDown";
import Modal from "../../../../../../../shared/modal/Modal";
import InvoiceSent from "../../../../../../../shared/modal/InvoiceSent";
import invoiceImage from "../../../../../../../assets/png/invoice.png";
import addItem from "../../../../../../../assets/svg/addItem.svg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { getDraftItemById } from "../../../../../../../shared/redux/shared/services/shareApplication.services";

type Status = DropdownItem;

interface Item {
  name: string;
}

interface ProductsItems {
  id: number;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
  invoiceId: number | null;
  isDraft: boolean;
  createdAt: string;
}

interface InvoiceItem {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
}

const GenerateInvoice = () => {
  const { draftItems } = useAllDraftItems();
  const { draftId } = useParams();
  const draftItemsData = draftItems || [];
  const [status, setStatus] = useState<Status | null>(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [choiceItem, setChoiceItem] = useState<Item | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showExistingItemDropdown, setShowExistingItemDropdown] =
    useState(false);
  const [selectedExistingItem, setSelectedExistingItem] =
    useState<ProductsItems | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const dispatch: AppDispatch = useAppDispatch();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchDraftItem = async () => {
      if (draftId) {
        try {
          const response = await getDraftItemById(`/invoice/item/${draftId}`);
          const draftData = response.data;
          if (draftData) {
            setStatus({ name: draftData?.status });
            setInvoiceDate(draftData?.invoiceDate || "");
            setDueDate(draftData?.dueDate || "");
            setInvoiceNumber(draftData?.invoiceNumber);
            setItems(draftData?.items);
            setVisibleItems(
              draftData?.items?.map((_: any, index: any) => index)
            );
          }
        } catch (error: any) {
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("Error fetching draft item");
          }
          console.error("Error fetching draft item:", error);
        }
      }
    };

    fetchDraftItem();
  }, [draftId]);

  const state: Status[] = [{ name: "SUBMITTED" }];

  const choice: Item[] = [
    { name: "Add New Item" },
    { name: "Add Existing Item" },
  ];

  const handleSelectStatus = (item: Status) => {
    if (item) {
      setStatus(item);
    }
  };

  const handleChoiceItem = (item: DropdownItem) => {
    const selectedItem = item as Item;
    if (selectedItem) {
      setChoiceItem(selectedItem);
      if (selectedItem.name === "Add New Item") {
        setShowExistingItemDropdown(false);
        setItems([
          ...items,
          { productName: "", quantity: 0, rate: 0, amount: 0, discount: 0 },
        ]);
        setVisibleItems([...visibleItems, items.length]);
      } else if (selectedItem.name === "Add Existing Item") {
        setShowExistingItemDropdown(true);
      }
    }
  };

  const handleExistingItemSelect = (item: ProductsItems) => {
    setSelectedExistingItem(item);
    setItems([
      ...items,
      {
        productName: item.name,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        discount: item.discount,
      },
    ]);
    setShowExistingItemDropdown(false);
    setChoiceItem(null);
  };

  const toggleItemVisibility = (index: number) => {
    if (visibleItems.includes(index)) {
      setVisibleItems(visibleItems.filter((i) => i !== index));
    } else {
      setVisibleItems([...visibleItems, index]);
    }
  };

  const calculateAmount = (
    quantity: number,
    rate: number,
    discount: number
  ) => {
    const subtotal = quantity * rate;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const newItems = [...items];
    if (field === "productName") {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = value === "" ? 0 : parseFloat(value);
    }

    if (field === "quantity" || field === "rate" || field === "discount") {
      const { quantity, rate, discount } = newItems[index];
      newItems[index].amount = calculateAmount(quantity, rate, discount);
    }

    setItems(newItems);
  };

  const submitInvoice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInvoiceLoading(true);

    try {
      const body = {
        status: status?.name,
        invoiceDate: invoiceDate ? `${invoiceDate}T00:00:00Z` : "",
        dueDate: dueDate ? `${dueDate}T00:00:00Z` : "",
        invoiceNumber,
        items,
      };

      await dispatch(createInvoice(body)).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(error);
    } finally {
      setInvoiceLoading(false);
    }
  };
  const resetForm = () => {
    setStatus(null);
    setInvoiceDate("");
    setDueDate("");
    setInvoiceNumber("");
    setItems([]);
    setVisibleItems([]);
    setChoiceItem(null);
    setSelectedExistingItem(null);
    setShowExistingItemDropdown(false);
  };

  const submitDraft = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDraftLoading(true);

    try {
      const body = {
        status: status?.name,
        invoiceDate: invoiceDate ? `${invoiceDate}T00:00:00Z` : "",
        dueDate: dueDate ? `${dueDate}T00:00:00Z` : "",
        invoiceNumber,
        items,
      };

      await dispatch(createDraft(body)).unwrap();
      toast.success("drafts saved successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDraftLoading(false);
    }
  };

  const addNewItem = () => {
    const newItemIndex = items.length;
    setItems([
      ...items,
      { productName: "", quantity: 0, rate: 0, amount: 0, discount: 0 },
    ]);
    setVisibleItems([...visibleItems, newItemIndex]);
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Payment /
                <span className="ml-1 font-medium text-primary-700">
                  {draftId ? "Edit Draft" : "Generate Invoice"}
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <h1 className="font-semibold text-2xl">
          {draftId ? "Edit Draft" : "Generate Invoice"}
        </h1>

        <section>
          <div className="flex justify-between mt-[1.5em]">
            <div className="flex flex-col gap-[1.3em]">
              <div className="flex w-full lg:flex-row flex-col gap-[1em]">
                <div>
                  <Dropdown
                    label="Invoice Status"
                    labelClassName="text-grey-primary w-[12em]"
                    items={state}
                    selectedItem={status}
                    onSelectItem={handleSelectStatus}
                    className="lg:w-[12em] w-full"
                    placeholder="Status"
                  />
                </div>
                <div>
                  <label
                    htmlFor="issuedDate"
                    className="flex-start flex font-medium"
                  >
                    Issued Date
                  </label>
                  <input
                    type="date"
                    name="issedDate"
                    id="issuedDate"
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="border-border w-full lg:w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex lg:flex-row flex-col gap-[1em]">
                <div className="flex-1">
                  <label
                    htmlFor="dueDate"
                    className="flex-start flex font-medium mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border-border w-full lg:w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="invoiceNumber"
                    className="flex-start flex font-medium mb-2"
                  >
                    Invoice No
                  </label>
                  <input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    required
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="border-border w-full lg:w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Dropdown
                  label="Select Item"
                  labelClassName="text-grey-primary"
                  items={choice}
                  selectedItem={choiceItem}
                  onSelectItem={handleChoiceItem}
                  placeholder="Item"
                />
              </div>

              {showExistingItemDropdown && (
                <Dropdown
                  label="Select"
                  labelClassName="text-grey-primary"
                  items={draftItemsData.map((item: ProductsItems) => ({
                    name: item.name,
                  }))}
                  selectedItem={selectedExistingItem}
                  onSelectItem={(item) =>
                    handleExistingItemSelect(
                      draftItemsData.find(
                        (i: ProductsItems) => i.name === item.name
                      )!
                    )
                  }
                  placeholder="Products"
                />
              )}

              {draftItems &&
                Array?.isArray(draftItems) &&
                draftItems.length === 0 && <div>No existing items found</div>}

              {items.map((item, index) => (
                <div key={index}>
                  <div className="flex relative items-center">
                    <input
                      id={`productName-${index}`}
                      name={`productName-${index}`}
                      required
                      value={item.productName}
                      onChange={(e) =>
                        handleItemChange(index, "productName", e.target.value)
                      }
                      placeholder="product name"
                      className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none pr-10"
                    />
                    <button
                      className="absolute right-3"
                      onClick={() => toggleItemVisibility(index)}
                    >
                      {visibleItems.includes(index) ? (
                        <MdOutlineVisibilityOff />
                      ) : (
                        <MdOutlineVisibility />
                      )}
                    </button>
                  </div>

                  {visibleItems.includes(index) && (
                    <>
                      <div className="flex mt-[1em] gap-[1em]">
                        <div className="flex-1">
                          <label
                            htmlFor={`quantity-${index}`}
                            className="flex-start flex font-medium mb-2"
                          >
                            Quantity
                          </label>
                          <input
                            id={`quantity-${index}`}
                            name={`quantity-${index}`}
                            required
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`rate-${index}`}
                            className="flex-start flex font-medium mb-2"
                          >
                            Rate
                          </label>
                          <input
                            id={`rate-${index}`}
                            name={`rate-${index}`}
                            required
                            type="number"
                            value={item.rate || ""}
                            onChange={(e) =>
                              handleItemChange(index, "rate", e.target.value)
                            }
                            className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex mt-[1em] gap-[1em]">
                        <div className="flex-1">
                          <label
                            htmlFor={`amount-${index}`}
                            className="flex-start flex font-medium mb-2"
                          >
                            Amount
                          </label>
                          <input
                            id={`amount-${index}`}
                            name={`amount-${index}`}
                            required
                            type="number"
                            value={item.amount.toFixed(2)}
                            readOnly
                            className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`discount-${index}`}
                            className="flex-start flex font-medium mb-2"
                          >
                            Tax/Discount (%)
                          </label>
                          <input
                            id={`discount-${index}`}
                            name={`discount-${index}`}
                            required
                            type="number"
                            value={item.discount || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "discount",
                                e.target.value
                              )
                            }
                            className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <button onClick={addNewItem} className="flex gap-2 items-center">
                <img src={addItem} alt="" />
                <span className="font-medium text-primary-700">
                  Add New Item
                </span>
              </button>
              <div className="flex mt-[1em] justify-between items-center">
                <button.PrimaryButton
                  className="rounded-full w-[45%] bg-purple-pink py-[12px] text-center text-lg font-semibold text-primary-700"
                  onClick={submitDraft}
                >
                  {draftLoading ? (
                    <ReactLoading
                      color="#FFFFFF"
                      width={25}
                      height={25}
                      type="spin"
                    />
                  ) : draftId ? (
                    "Update Draft"
                  ) : (
                    "Save as Draft"
                  )}
                </button.PrimaryButton>

                <button.PrimaryButton
                  className="bg-linear-gradient rounded-full w-[45%] py-[12px] text-center text-lg font-semibold text-white"
                  onClick={submitInvoice}
                >
                  {invoiceLoading ? (
                    <ReactLoading
                      color="#FFFFFF"
                      width={25}
                      height={25}
                      type="spin"
                    />
                  ) : (
                    "Send Invoice"
                  )}
                </button.PrimaryButton>
              </div>
            </div>

            <div className="lg:flex hidden relative h-fit">
              <img
                src={invoiceImage}
                alt="mginvoiceI"
                className="sticky top-0"
              />
            </div>
          </div>
        </section>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <InvoiceSent
            to="/staff/dashboard/payments"
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
};

export default GenerateInvoice;
