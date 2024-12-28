import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceImage from "../../../../../../assets/png/invoice.png";
import addItem from "../../../../../../assets/svg/addItem.svg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useAppDispatch } from "../../../../../../shared/redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../../../../../../shared/redux/store";
import { Dropdown, DropdownItem } from "../../../../../../shared/dropDown/DropDown";
import { createInvoicePaymentForStaff } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { button } from "../../../../../../shared/buttons/Button";
import Modal from "../../../../../../shared/modal/Modal";
import InvoiceSent from "../../../../../../shared/modal/InvoiceSent";
import { useStaffEmails } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import PaymentReceiptResponse from "../../../../../../shared/modal/PaymentReceiptResponse";

interface Item {
  name: string;
}

interface InvoiceItem {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
}

const NewPayment = () => {
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [choiceItem, setChoiceItem] = useState<Item | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const dispatch: AppDispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(staffEmail)) {
      return staffEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [staffEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem) => {
    setEmail(item?.name || null);
    setError(null);
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const choice: Item[] = [
    { name: "Add New Item" },
  ];

  const handleChoiceItem = (item: DropdownItem) => {
    const selectedItem = item as Item;
    if (selectedItem && selectedItem.name === "Add New Item") {
      setItems([
        ...items,
        { productName: "", quantity: 0, rate: 0, amount: 0, discount: 0 },
      ]);
      setVisibleItems([...visibleItems, items.length]);
    }
  };

  const toggleItemVisibility = (index: number) => {
    setVisibleItems(visibleItems.includes(index)
      ? visibleItems.filter((i) => i !== index)
      : [...visibleItems, index]
    );
  };

  const calculateAmount = (quantity: number, rate: number, discount: number) => {
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
      newItems[index][field] = parseFloat(value) || 0;
    }

    if (field === "quantity" || field === "rate" || field === "discount") {
      const { quantity, rate, discount } = newItems[index];
      newItems[index].amount = calculateAmount(quantity, rate, discount);
    }

    setItems(newItems);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}T00:00:00Z`;
  };

  const submitInvoice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInvoiceLoading(true);

    if (!email) {
      setError("Please select a staff email");
      setInvoiceLoading(false);
      return;
    }

    try {
      const body = {
        invoiceDate: formatDate(invoiceDate),
        dueDate: formatDate(dueDate),
        invoiceNumber,
        items,
        email,
      };

      const response = await dispatch(createInvoicePaymentForStaff(body)).unwrap();
      if (response && response.id) {
        setInvoiceId(response.id);
        resetForm();
        setReceiptModalOpen(true);
      } else {
        toast.error("Failed to create invoice. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the invoice");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const resetForm = () => {
    setInvoiceDate("");
    setDueDate("");
    setInvoiceNumber("");
    setItems([]);
    setVisibleItems([]);
    setChoiceItem(null);
    setEmail(null);
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

  const handleCloseReceiptModal = () => {
    setReceiptModalOpen(false);
    setInvoiceId(null);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Payments /
                <span className="ml-1 font-medium text-primary-700">
                  New Payment
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <h1 className="font-semibold text-2xl mt-4">Generate Invoice</h1>

        <section className="flex justify-between mt-[1.5em]">
          <div className="flex flex-col gap-[1.3em] w-[50%]">
            <div className="flex flex-col gap-[1em]">
              <div className="flex-1">
                <label htmlFor="issuedDate" className="flex-start flex font-medium mb-2">
                  Issued Date
                </label>
                <input
                  type="date"
                  id="date"
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                  className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
                />
              </div>
              <Dropdown
                label="Staff Email"
                items={emailItems}
                selectedItem={email ? { name: email } : null}
                onSelectItem={handleSelectEmail}
                asterisk
                searchVisible
                loading={emailLoading}
                placeholder="Select Staff Email"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
                  
            <div className="flex gap-[1em]">
              <div className="flex-1">
                <label htmlFor="dueDate" className="flex-start flex font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="date"
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="invoiceNumber" className="flex-start flex font-medium mb-2">
                  Invoice No
                </label>
                <input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  required
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
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
                placeholder="Select Item"
              />
            </div>

            {items.map((item, index) => (
              <div key={index}>
                <div className="flex relative items-center">
                  <input
                    id={`productName-${index}`}
                    name={`productName-${index}`}
                    required
                    value={item.productName}
                    onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                    placeholder="product name"
                    className="border-border w-full focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none pr-10"
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
                        <label htmlFor={`quantity-${index}`} className="flex-start flex font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          id={`quantity-${index}`}
                          name={`quantity-${index}`}
                          required
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor={`rate-${index}`} className="flex-start flex font-medium mb-2">
                          Rate
                        </label>
                        <input
                          id={`rate-${index}`}
                          name={`rate-${index}`}
                          required
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex mt-[1em] gap-[1em]">
                      <div className="flex-1">
                        <label htmlFor={`amount-${index}`} className="flex-start flex font-medium mb-2">
                          Amount
                        </label>
                        <input
                          id={`amount-${index}`}
                          name={`amount-${index}`}
                          required
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="border-border w-full focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor={`discount-${index}`} className="flex-start flex font-medium mb-2">
                          Tax/Discount (%)
                        </label>
                        <input
                          id={`discount-${index}`}
                          name={`discount-${index}`}
                          required
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
                className="bg-linear-gradient rounded-full w-[45%] py-[12px] text-center text-lg font-semibold text-white"
                onClick={submitInvoice}
              >
                {invoiceLoading ? (
                  <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
                ) : (
                  "Send Invoice"
                )}
              </button.PrimaryButton>
            </div>
          </div>
          <div className=" pl-8">
            <img src={invoiceImage} alt="" className="max-w-full" />
          </div>
        </section>
      </div>
      {isReceiptModalOpen && invoiceId && (
        <Modal isOpen={isReceiptModalOpen} onClose={handleCloseReceiptModal} data-aos="zoom-in">
          <PaymentReceiptResponse
            invoiceId={invoiceId}
          />
        </Modal>
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} data-aos="zoom-in">
          <InvoiceSent to="/admin/dashboard/all_staffs" onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default NewPayment;