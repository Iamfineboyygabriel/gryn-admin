// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router";
// import { AppDispatch } from "../../../../../../../shared/redux/store";
// import {
//   createDraft,
//   createInvoice,
// } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
// import { useAllDraftItems } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
// import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
// import CustomDatePicker from "../../../../../../../shared/utils/CustomeDatePicker";
// import { button } from "../../../../../../../shared/buttons/Button";
// import {
//   Dropdown,
//   DropdownItem,
// } from "../../../../../../../shared/dropDown/DropDown";
// import Modal from "../../../../../../../shared/modal/Modal";
// import InvoiceSent from "../../../../../../../shared/modal/InvoiceSent";
// import invoiceImage from "../../../../../../../assets/png/invoice.png";
// import addItem from "../../../../../../../assets/svg/addItem.svg";
// import { toast } from "react-toastify";
// import ReactLoading from "react-loading";
// import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
// import { getDraftItemById } from "../../../../../../../shared/redux/shared/services/shareApplication.services";

// interface InvoiceItem {
//   productName: string;
//   quantity: number;
//   rate: number;
//   amount: number;
//   discount: number;
// }

// interface DraftData {
//   status: string;
//   invoiceNumber: string;
//   invoiceDate: Date | null;
//   dueDate: Date | null;
//   items: InvoiceItem[];
// }

// const UseDraftInformation: React.FC = () => {
//   const { draftId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch: AppDispatch = useAppDispatch();

//   const [status, setStatus] = useState<DropdownItem | null>(null);
//   const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
//   const [dueDate, setDueDate] = useState<Date | null>(null);
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [items, setItems] = useState<InvoiceItem[]>([]);
//   const [visibleItems, setVisibleItems] = useState<number[]>([]);

//   const [invoiceLoading, setInvoiceLoading] = useState(false);
//   const [draftLoading, setDraftLoading] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const initializeFromDraft = async () => {
//       const draftData = location.state?.draftData as DraftData;
      
//       if (draftData) {
//         setStatus({ name: draftData.status });
//         setInvoiceDate(draftData.invoiceDate);
//         setDueDate(draftData.dueDate);
//         setInvoiceNumber(draftData.invoiceNumber);
//         setItems(draftData.items);
//         setVisibleItems(draftData.items.map((_, index) => index));
//       }
//       else if (draftId) {
//         try {
//           const response = await getDraftItemById(`/invoice/item/${draftId}`);
//           const fetchedDraft = response.data;
          
//           if (fetchedDraft) {
//             setStatus({ name: fetchedDraft.status });
//             setInvoiceDate(new Date(fetchedDraft.invoiceDate));
//             setDueDate(new Date(fetchedDraft.dueDate));
//             setInvoiceNumber(fetchedDraft.invoiceNumber);
//             setItems(fetchedDraft.items.map((item: any) => ({
//               productName: item.name || "",
//               quantity: item.quantity || 0,
//               rate: item.rate || 0,
//               amount: item.amount || 0,
//               discount: item.discount || 0
//             })));
//             setVisibleItems(fetchedDraft.items.map((_: any, index: number) => index));
//           }
//         } catch (error: any) {
//           toast.error(error.message || "Error fetching draft");
//         }
//       }
//     };

//     initializeFromDraft();
//   }, [draftId, location.state]);

//   const calculateAmount = (quantity: number, rate: number, discount: number) => {
//     const subtotal = quantity * rate;
//     const discountAmount = (subtotal * discount) / 100;
//     return subtotal - discountAmount;
//   };

//   const handleItemChange = (
//     index: number,
//     field: keyof InvoiceItem,
//     value: string
//   ) => {
//     const newItems = [...items];
//     if (field === "productName") {
//       newItems[index][field] = value;
//     } else {
//       newItems[index][field] = parseFloat(value) || 0;
//     }

//     if (field === "quantity" || field === "rate" || field === "discount") {
//       const { quantity, rate, discount } = newItems[index];
//       newItems[index].amount = calculateAmount(quantity, rate, discount);
//     }

//     setItems(newItems);
//   };

//   const toggleItemVisibility = (index: number) => {
//     setVisibleItems(prev => 
//       prev.includes(index) 
//         ? prev.filter(i => i !== index)
//         : [...prev, index]
//     );
//   };

//   const addNewItem = () => {
//     setItems(prev => [
//       ...prev,
//       { productName: "", quantity: 0, rate: 0, amount: 0, discount: 0 }
//     ]);
//     setVisibleItems(prev => [...prev, items.length]);
//   };

//   const formatDate = (date: Date | null) => {
//     if (!date) return "";
//     return date.toISOString().split('T')[0] + 'T00:00:00Z';
//   };

//   const handleSubmit = async (isDraft: boolean) => {
//     const loadingState = isDraft ? setDraftLoading : setInvoiceLoading;
//     loadingState(true);

//     try {
//       const payload = {
//         status: status?.name || "SUBMITTED",
//         invoiceDate: formatDate(invoiceDate),
//         dueDate: formatDate(dueDate),
//         invoiceNumber,
//         items: items.map(item => ({
//           ...item,
//           amount: calculateAmount(item.quantity, item.rate, item.discount)
//         }))
//       };

//       if (isDraft) {
//         await dispatch(createDraft(payload)).unwrap();
//         toast.success(draftId ? "Draft updated successfully" : "Draft saved successfully");
//         navigate("/staff/dashboard/payments/drafts");
//       } else {
//         await dispatch(createInvoice(payload)).unwrap();
//         setModalOpen(true);
//       }
//     } catch (error: any) {
//       toast.error(error.message || `Failed to ${isDraft ? 'save draft' : 'send invoice'}`);
//     } finally {
//       loadingState(false);
//     }
//   };

//   return (
//     <main className="font-outfit">
//       <h1 className="text-2xl font-bold dark:text-white">Payments</h1>
//       <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
//         <header>
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="font-medium dark:text-gray-700">
//                 Payment /
//                 <span className="ml-1 font-medium text-primary-700 dark:text-white">
//                 Draft Information
//                 </span>
//               </h1>
//             </div>
//             <button.PrimaryButton 
//               onClick={() => navigate(-1)} 
//               className="btn-2"
//             >
//               Back
//             </button.PrimaryButton>
//           </div>
//         </header>

//         <section>
//           <div className="flex justify-between mt-[1.5em]">
//             <div className="flex flex-col gap-[1.3em]">
//             <div className="flex gap-[1em]">
//               <div className="flex-1">
//                 <Dropdown
//                   label="Invoice Status"
//                   items={[{ name: "SUBMITTED" }]}
//                   selectedItem={status}
//                   onSelectItem={setStatus}
//                   placeholder="Status"
//                   labelClassName="text-grey-primary w-[12em]"
//                   className="w-full"
//                 />
//               </div>

//               <div className="flex-1">
//                 <label className="block font-medium mb-2">Issued Date</label>
//                 <CustomDatePicker
//                   selected={invoiceDate}
//                   onChange={(date: Date) => setInvoiceDate(date)}
//                   className="w-full"
//                 />
//               </div>
//             </div>


//               <div className="flex gap-[1em]">
//                 <div>
//                   <label className="block font-medium mb-2">Due Date</label>
//                   <CustomDatePicker
//                     selected={dueDate}
//                     onChange={(date: Date) => setDueDate(date)}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-medium mb-2">Invoice No</label>
//                   <input
//                     value={invoiceNumber}
//                     onChange={(e) => setInvoiceNumber(e.target.value)}
//                     className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               {items.map((item, index) => (
//                 <div key={index} className="p-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <input
//                       value={item.productName}
//                       onChange={(e) => handleItemChange(index, "productName", e.target.value)}
//                       placeholder="Product name"
//                       className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none pr-10"
//                     />
//                     <button
//                       className="absolute right-3"
//                       onClick={() => toggleItemVisibility(index)}
//                     >
//                       {visibleItems.includes(index) ? (
//                         <MdOutlineVisibilityOff />
//                       ) : (
//                         <MdOutlineVisibility />
//                       )}
//                     </button>
//                   </div>

//                   {visibleItems.includes(index) && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block font-medium mb-2">Quantity</label>
//                         <input
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                           className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-medium mb-2">Rate</label>
//                         <input
//                           type="number"
//                           value={item.rate}
//                           onChange={(e) => handleItemChange(index, "rate", e.target.value)}
//                           className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-medium mb-2">Amount</label>
//                         <input
//                           type="number"
//                           value={item.amount.toFixed(2)}
//                           readOnly
//                           className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none bg-gray-100"
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-medium mb-2">Discount (%)</label>
//                         <input
//                           type="number"
//                           value={item.discount}
//                           onChange={(e) => handleItemChange(index, "discount", e.target.value)}
//                           className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               <button 
//                 onClick={addNewItem}
//                 className="flex items-center gap-2 text-primary-700 font-medium"
//               >
//                 <img src={addItem} alt="" />
//                 Add New Item
//               </button>

//               <div className="flex justify-between mt-8">
//                 <button.PrimaryButton
//                   onClick={() => handleSubmit(true)}
//                   className="w-[45%] rounded-full bg-purple-pink py-3 text-primary-700 font-semibold"
//                   disabled={draftLoading || invoiceLoading}
//                 >
//                   {draftLoading ? (
//                     <ReactLoading type="spin" color="#FFFFFF" height={24} width={24} />
//                   ) : (
//                     draftId ? "Update Draft" : "Save as Draft"
//                   )}
//                 </button.PrimaryButton>

//                 <button.PrimaryButton
//                   onClick={() => handleSubmit(false)}
//                   className="w-[45%] rounded-full bg-linear-gradient py-3 text-white font-semibold"
//                   disabled={draftLoading || invoiceLoading}
//                 >
//                   {invoiceLoading ? (
//                     <ReactLoading type="spin" color="#FFFFFF" height={24} width={24} />
//                   ) : (
//                     "Send Invoice"
//                   )}
//                 </button.PrimaryButton>
//               </div>
//             </div>

//             <div className="w-1/2 flex justify-center">
//               <img src={invoiceImage} alt="Invoice illustration" className="max-w-md" />
//             </div>
//           </div>
//         </section>
//       </div>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         data-aos="zoom-in"
//       >
//         <InvoiceSent 
//           to="/staff/dashboard/payments" 
//           onClose={() => setModalOpen(false)} 
//         />
//       </Modal>
//     </main>
//   );
// };

// export default UseDraftInformation;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import {
  createDraft,
  createInvoice,
} from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
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
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
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
  invoiceNumber: string;
  invoiceDate: Date | null;
  dueDate: Date | null;
  items: InvoiceItem[];
}

const UseDraftInformation: React.FC = () => {
  const { draftId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const [status, setStatus] = useState<DropdownItem | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initializeFromDraft = async () => {
      const draftData = location.state?.draftData as DraftData;
      
      if (draftData) {
        setStatus({ name: draftData.status });
        setInvoiceDate(draftData.invoiceDate);
        setDueDate(draftData.dueDate);
        setInvoiceNumber(draftData.invoiceNumber);
        setItems(draftData.items);
        setVisibleItems(draftData.items.map((_, index) => index));
      }
      else if (draftId) {
        try {
          const response = await getDraftItemById(`/invoice/item/${draftId}`);
          const fetchedDraft = response.data;
          
          if (fetchedDraft) {
            setStatus({ name: fetchedDraft.status });
            setInvoiceDate(new Date(fetchedDraft.invoiceDate));
            setDueDate(new Date(fetchedDraft.dueDate));
            setInvoiceNumber(fetchedDraft.invoiceNumber);
            setItems(fetchedDraft.items.map((item: any) => ({
              productName: item.name || "",
              quantity: item.quantity || 0,
              rate: item.rate || 0,
              amount: item.amount || 0,
              discount: item.discount || 0
            })));
            setVisibleItems(fetchedDraft.items.map((_: any, index: number) => index));
          }
        } catch (error: any) {
          toast.error(error.message || "Error fetching draft");
        }
      }
    };

    initializeFromDraft();
  }, [draftId, location.state]);

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

  const toggleItemVisibility = (index: number) => {
    setVisibleItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split('T')[0] + 'T00:00:00Z';
  };

  const handleSubmit = async (isDraft: boolean) => {
    const loadingState = isDraft ? setDraftLoading : setInvoiceLoading;
    loadingState(true);

    try {
      const payload = {
        status: status?.name || "SUBMITTED",
        invoiceDate: formatDate(invoiceDate),
        dueDate: formatDate(dueDate),
        invoiceNumber,
        items: items.map(item => ({
          ...item,
          amount: calculateAmount(item.quantity, item.rate, item.discount)
        }))
      };

      if (isDraft) {
        await dispatch(createDraft(payload)).unwrap();
        toast.success(draftId ? "Draft updated successfully" : "Draft saved successfully");
        navigate("/staff/dashboard/payments/drafts");
      } else {
        await dispatch(createInvoice(payload)).unwrap();
        setModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isDraft ? 'save draft' : 'send invoice'}`);
    } finally {
      loadingState(false);
    }
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
                Draft Information
                </span>
              </h1>
            </div>
            <button.PrimaryButton 
              onClick={() => navigate(-1)} 
              className="btn-2"
            >
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <section>
          <div className="flex justify-between mt-[1.5em]">
            <div className="flex flex-col gap-[1.3em]">
            <div className="flex gap-[1em]">
              <div className="flex-1">
                <Dropdown
                  label="Invoice Status"
                  items={[{ name: "SUBMITTED" }]}
                  selectedItem={status}
                  onSelectItem={setStatus}
                  placeholder="Status"
                  labelClassName="text-grey-primary w-[12em]"
                  className="w-full"
                />
              </div>

              <div className="flex-1">
                <label className="block font-medium mb-2">Issued Date</label>
                <CustomDatePicker
                  selected={invoiceDate}
                  onChange={(date: Date) => setInvoiceDate(date)}
                  className="w-full"
                />
              </div>
            </div>


              <div className="flex gap-[1em]">
                <div>
                  <label className="block font-medium mb">Due Date</label>
                  <CustomDatePicker
                    selected={dueDate}
                    onChange={(date: Date) => setDueDate(date)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Invoice No</label>
                  <input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>

              {items?.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                      placeholder="Product name"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Rate</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Amount</label>
                        <input
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Discount (%)</label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                          className="border-border w-full focus:border-border rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <button.PrimaryButton
                  onClick={() => handleSubmit(true)}
                  className="w-[42%] rounded-full bg-purple-pink py-3 text-primary-700 font-semibold"
                  disabled={draftLoading || invoiceLoading}
                >
                  {draftLoading ? (
                    <ReactLoading type="spin" color="#FFFFFF" height={24} width={24} />
                  ) : (
                    draftId ? "Update Draft" : "Save as Draft"
                  )}
                </button.PrimaryButton>

                <button.PrimaryButton
                  onClick={() => handleSubmit(false)}
                  className="w-[42%] rounded-full bg-linear-gradient py-3 text-white font-semibold"
                  disabled={draftLoading || invoiceLoading}
                >
                  {invoiceLoading ? (
                    <ReactLoading type="spin" color="#FFFFFF" height={24} width={24} />
                  ) : (
                    "Send Invoice"
                  )}
                </button.PrimaryButton>
              </div>
            </div>

            <div className=" flex justify-center">
              <img src={invoiceImage} alt="Invoice illustration"/>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        data-aos="zoom-in"
      >
        <InvoiceSent 
          to="/staff/dashboard/payments" 
          onClose={() => setModalOpen(false)} 
        />
      </Modal>
    </main>
  );
};

export default UseDraftInformation;