import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import {
  createDraft,
  createInvoice,
} from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useAllDraftItems } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import CustomDatePicker from "../../../../../../../shared/utils/CustomeDatePicker";
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

type Status = DropdownItem;

interface Item {
  name: string;
}

interface ProductsItems {
  id: number;
  productName: string;
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
  const draftItemsData = draftItems?.data || [];
  const [status, setStatus] = useState<Status | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const state: Status[] = [{ name: "OPEN" }, { name: "CLOSE" }];

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
        productName: item.productName,
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

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const newItems = [...items];
    if (field === "productName") {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = parseFloat(value) || 0;
    }

    setItems(newItems);
  };

  const dispatch: AppDispatch = useAppDispatch();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00Z`;
  };

  const submitInvoice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInvoiceLoading(true);

    try {
      const body = {
        status: status?.name,
        invoiceDate: formatDate(invoiceDate),
        dueDate: formatDate(dueDate),
        invoiceNumber,
        items,
      };

      await dispatch(createInvoice(body)).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const submitDraft = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDraftLoading(true);

    try {
      const body = {
        status: status?.name,
        invoiceDate: formatDate(invoiceDate),
        dueDate: formatDate(dueDate),
        invoiceNumber,
        items,
      };

      await dispatch(createDraft(body)).unwrap();
      toast.success("drafts saved successfully");
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
      <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Payment /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Generate Invoice
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <h1 className="font-semibold text-2xl">Generate Invoice</h1>

        <section>
          <div className="flex justify-between mt-[1.5em]">
            <div className="flex flex-col gap-[1.3em]">
              <div className="flex gap-[1em]">
                <div>
                  <Dropdown
                    label="Invoice Status"
                    labelClassName="text-grey-primary w-[12em]"
                    items={state}
                    selectedItem={status}
                    onSelectItem={handleSelectStatus}
                    className="w-[12em]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="issuedDate"
                    className="flex-start flex font-medium"
                  >
                    Issued Date
                  </label>
                  <CustomDatePicker
                    selected={invoiceDate}
                    onChange={(date: Date) => setInvoiceDate(date)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-[1em]">
                <div className="flex-1">
                  <label
                    htmlFor="dueDate"
                    className="flex-start flex font-medium mb-2"
                  >
                    Due Date
                  </label>
                  <CustomDatePicker
                    selected={dueDate}
                    onChange={(date: Date) => setDueDate(date)}
                    className="w-full"
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
                    className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
                />
              </div>

              {showExistingItemDropdown && (
                <Dropdown
                  label="Select"
                  labelClassName="text-grey-primary"
                  items={draftItemsData.map((item: ProductsItems) => ({
                    name: item.productName,
                  }))}
                  selectedItem={selectedExistingItem}
                  onSelectItem={(item) =>
                    handleExistingItemSelect(
                      draftItemsData.find(
                        (i: ProductsItems) => i.productName === item.name
                      )!
                    )
                  }
                />
              )}

              {draftItems &&
                Array.isArray(draftItems) &&
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
                            value={item.quantity}
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
                            value={item.rate}
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
                            value={item.amount}
                            readOnly
                            className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`discount-${index}`}
                            className="flex-start flex font-medium mb-2"
                          >
                            Discount
                          </label>
                          <input
                            id={`discount-${index}`}
                            name={`discount-${index}`}
                            required
                            type="number"
                            value={item.discount}
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
                  ) : (
                    "Save as Draft"
                  )}
                </button.PrimaryButton>

                <button.PrimaryButton
                  className=" bg-linear-gradient rounded-full w-[45%]  py-[12px] text-center text-lg font-semibold text-white"
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
            <div>
              <img src={invoiceImage} alt="" />
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
          <InvoiceSent onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default GenerateInvoice;
