import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import {
  createDraft,
  createInvoice,
} from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import InvoiceSent from "../../../../../../../shared/modal/InvoiceSent";
import invoiceImage from "../../../../../../../assets/png/invoice.png";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { getDraftItemById } from "../../../../../../../shared/redux/shared/services/shareApplication.services";

interface InvoiceItem {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
}

interface DraftData {
  status: string;
  invoiceDate: string;
  dueDate: string;
  invoiceNumber: string;
  items: InvoiceItem[];
}


const EditDraftInvoice: React.FC = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch<AppDispatch>();

  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [status, setStatus] = useState<string>('SUBMITTED');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [name,setName]= useState<string>('');
  const [quantity,setQuantity] = useState<string>('');
  const [rate,setRate] = useState<string>('');
  const [amount,setAmount] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [item, setItem] = useState<InvoiceItem>({
    productName: '',
    quantity: 0,
    rate: 0,
    amount: 0,
    discount: 0,
  });

  const [isDraftLoading, setIsDraftLoading] = useState<boolean>(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchDraftItem = async () => {
      if (draftId) {
        try {
          const response = await getDraftItemById(`/invoice/item/${draftId}`);
          const fetchedDraftData = response.data;
          setDraftData(fetchedDraftData);
          
          if (fetchedDraftData) {
            setStatus(fetchedDraftData.status || 'SUBMITTED');
            setInvoiceDate((fetchedDraftData.invoiceDate));
            setDueDate((fetchedDraftData.dueDate));
            setInvoiceNumber(fetchedDraftData.invoiceNumber);
            setName(fetchedDraftData.name);
            setQuantity(fetchedDraftData.quantity);
            setRate(fetchedDraftData.rate);
            setAmount(fetchedDraftData.amount);
            setDiscount(fetchedDraftData.discount)
          }
        } catch (error: any) {
          toast.error(error.message || 'Error fetching draft item');
        }
      }
    };

    fetchDraftItem();
  }, [draftId]);


  const formatDateForSubmission = (dateString: string): string => {
    if (!dateString) return '';
    return `${dateString}T00:00:00Z`;
  };

  const calculateAmount = (quantity: number, rate: number, discount: number): number => {
    const subtotal = quantity * rate;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prevItem => {
      const updatedItem = { ...prevItem, [name]: parseFloat(value) || value };
      if (['quantity', 'rate', 'discount'].includes(name)) {
        updatedItem.amount = calculateAmount(
          name === 'quantity' ? parseFloat(value) : prevItem.quantity,
          name === 'rate' ? parseFloat(value) : prevItem.rate,
          name === 'discount' ? parseFloat(value) : prevItem.discount
        );
      }
      return updatedItem;
    });
  };

  const handleSaveDraft = async () => {
    setIsDraftLoading(true);
    try {
      const body = {
        status,
        invoiceDate: formatDateForSubmission(invoiceDate),
        dueDate: formatDateForSubmission(dueDate),
        invoiceNumber,
        items: [item],
      };

      await dispatch(createDraft(body)).unwrap();
      toast.success('Draft saved successfully');
      navigate('/staff/dashboard/payments');
    } catch (error: any) {
      toast.error(error|| 'Error saving draft');
    } finally {
      setIsDraftLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    setIsInvoiceLoading(true);
    try {
      const body = {
        status,
        invoiceDate: formatDateForSubmission(invoiceDate),
        dueDate: formatDateForSubmission(dueDate),
        invoiceNumber,
        items: [item],
      };

      await dispatch(createInvoice(body)).unwrap();
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Error creating invoice');
    } finally {
      setIsInvoiceLoading(false);
    }
  };
  

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
      <div className="mt-4 bg-white p-8 rounded-lg dark:bg-gray-800">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {draftId ? 'Edit Draft' : 'Generate Invoice'}
          </h2>
          <button.PrimaryButton onClick={handleBackClick} className="btn-2">
            Back
          </button.PrimaryButton>
        </header>

        <div className="flex justify-between">
          <div className="w-1/2 space-y-6">
        

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="dueDate" className="block mb-2">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
              <label htmlFor="invoiceNumber" className="block mb-2">Invoice No</label>
              <input
                type="text"
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            </div>
            <div>
              <label htmlFor="productName" className="block mb-2">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="rate" className="block mb-2">Rate</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={rate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="amount" className="block mb-2">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="discount" className="block mb-2">Tax/Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button.PrimaryButton
                className="rounded-full w-[45%] bg-purple-pink py-[12px] text-center text-lg font-semibold text-primary-700"
                onClick={handleSaveDraft}
                disabled={isDraftLoading}
              >
                {isDraftLoading ? (
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
                className="bg-linear-gradient rounded-full w-[45%] py-[12px] text-center text-lg font-semibold text-white"
                onClick={handleCreateInvoice}
                disabled={isInvoiceLoading}
              >
                {isInvoiceLoading ? (
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                ) : (
                  "Create Invoice"
                )}
              </button.PrimaryButton>
            </div>
          </div>

          <div className="w-1/2 flex justify-center items-start">
            <img src={invoiceImage} alt="Invoice" className="max-w-full h-auto" />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InvoiceSent to="/staff/dashboard/payments" onClose={() => setIsModalOpen(false)} />
      </Modal>
    </main>
  );
};

export default EditDraftInvoice;