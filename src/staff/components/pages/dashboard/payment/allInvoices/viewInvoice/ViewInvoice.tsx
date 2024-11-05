// import { useNavigate, useLocation } from "react-router-dom";
// import { button } from "../../../../../../../shared/buttons/Button";
// import invoiceImage from "../../../../../../../assets/png/invoice.png";

// const ViewInvoice = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const invoiceData = state?.invoiceData;
  
//   const handleBackClick = () => {
//     navigate(-1);
//   };

  // const totalAmount = invoiceData?.item?.reduce((sum:any, item:any) => sum + item.amount, 0) || 0;

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
//                   View Invoice
//                 </span>
//               </h1>
//             </div>
//             <button.PrimaryButton onClick={handleBackClick} className="btn-2">
//               Back
//             </button.PrimaryButton>
//           </div>
//         </header>

//         <h1 className="font-semibold text-2xl">View Invoice</h1>

//         <section>
//           <div className="flex justify-between mt-[1.5em]">
//             <div className="flex flex-col gap-[1.3em] w-full mr-8">
//               {/* Invoice Header Information */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="issuedDate" className="flex-start flex font-medium">
//                     Issued Date
//                   </label>
//                   <input
//                     id="issuedDate"
//                     value={new Date(invoiceData?.invoiceDate).toLocaleDateString()}
//                     readOnly
//                     className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="dueDate" className="flex-start flex font-medium">
//                     Due Date
//                   </label>
//                   <input
//                     id="dueDate"
                    // value={new Date(invoiceData?.dueDate).toLocaleDateString()}
//                     readOnly
//                     className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="invoiceNumber" className="flex-start flex font-medium">
//                   Invoice No
//                 </label>
//                 <input
//                   id="invoiceNumber"
//                   value={invoiceData?.invoiceNumber}
//                   readOnly
//                   className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                 />
//               </div>

//               {/* Items List */}
//               <div className="mt-6">
//                 <h2 className="font-semibold text-lg mb-4">Invoice Items</h2>
//                 {invoiceData?.item?.map((item:any, index:number) => (
//                   <div key={item.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="font-medium">Item {index + 1}</h3>
//                     </div>
                    
//                     <div className="grid grid-cols-1 gap-4">
//                       <div>
//                         <label className="flex-start flex font-medium mb-2">
//                           Product Name
//                         </label>
//                         <input
//                           value={item.name}
//                           readOnly
//                           className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="flex-start flex font-medium mb-2">
//                             Quantity
//                           </label>
//                           <input
//                             value={item.quantity}
//                             readOnly
//                             type="number"
//                             className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                           />
//                         </div>
//                         <div>
//                           <label className="flex-start flex font-medium mb-2">
//                             Rate
//                           </label>
//                           <input
//                             value={item.rate}
//                             readOnly
//                             type="number"
//                             className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="flex-start flex font-medium mb-2">
//                             Amount
//                           </label>
//                           <input
//                             value={item.amount}
//                             readOnly
//                             type="number"
//                             className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                           />
//                         </div>
//                         <div>
//                           <label className="flex-start flex font-medium mb-2">
//                             Discount (%)
//                           </label>
//                           <input
//                             value={item.discount}
//                             readOnly
//                             type="number"
//                             className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Total Amount */}
                // <div className="mt-6 flex justify-end">
                //   <div className="w-[200px]">
                //     <label className="flex-start flex font-medium mb-2">
                //       Total Amount
                //     </label>
                //     <input
                //       value={totalAmount}
                //       readOnly
                //       type="number"
                //       className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none font-semibold"
                //     />
                //   </div>
                // </div>
//               </div>
//             </div>
            
//             <div>
//               <img src={invoiceImage} alt="" />
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default ViewInvoice;

import { useNavigate, useLocation } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import invoiceImage from "../../../../../../../assets/png/invoice.png";

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const invoiceData = state?.invoiceData;

  const handleBackClick = () => {
    navigate(-1);
  };

  const totalAmount = invoiceData?.item?.reduce((sum:any, item:any) => sum + item.amount, 0) || 0;

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
                  View Invoice
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <h1 className="font-semibold text-2xl">View Invoice</h1>

        <section>
          <div className="flex justify-between mt-[1.5em]">
            <div className="flex flex-col gap-[1.3em]">
            <div className="flex gap-[1em]">
                <div className="flex-1">
                  <label htmlFor="status" className="flex-start flex font-medium mb-2">
                    Status
                  </label>
                  <input
                    id="status"
                    value={invoiceData?.status}
                    readOnly
                    className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="invoiceNumber" className="flex-start flex font-medium mb-2">
                    Invoice Date
                  </label>
                  <input
                    id="issuedDate"
                    value={new Date(invoiceData?.invoiceDate).toLocaleDateString()}
                    readOnly
                    className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-[1em]">
                <div className="flex-1">
                  <label htmlFor="dueDate" className="flex-start flex font-medium mb-2">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    value={new Date(invoiceData?.dueDate).toLocaleDateString()}
                    readOnly
                    className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="invoiceNumber" className="flex-start flex font-medium mb-2">
                    Invoice No
                  </label>
                  <input
                    id="invoiceNumber"
                    value={invoiceData?.invoiceNumber}
                    readOnly
                    className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>

              {invoiceData?.item?.map((item:any, index:number) => (
                <div key={item.id}>
                  <div className="flex relative items-center">
                    <input
                      value={item.name}
                      readOnly
                      placeholder="product name"
                      className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none pr-10"
                    />
                  </div>

                  <div className="flex mt-[1em] gap-[1em]">
                    <div className="flex-1">
                      <label className="flex-start flex font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        value={item.quantity}
                        readOnly
                        type="number"
                        className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex-start flex font-medium mb-2">
                        Rate
                      </label>
                      <input
                        value={item.rate}
                        readOnly
                        type="number"
                        className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex mt-[1em] gap-[1em]">
                    <div className="flex-1">
                      <label className="flex-start flex font-medium mb-2">
                        Amount
                      </label>
                      <input
                        value={item.amount}
                        readOnly
                        type="number"
                        className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex-start flex font-medium mb-2">
                        Discount (%)
                      </label>
                      <input
                        value={item.discount}
                        readOnly
                        type="number"
                        className="border-border w-[200px] focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                      />
                    </div>
                  </div>
                  {index !== invoiceData.item.length - 1 && <hr className="my-4" />}
                </div>
              ))}
                 <div className="mt-6 flex justify-end">
                  <div className="w-[200px]">
                    <label className="flex-start flex font-medium mb-2">
                      Total Amount
                    </label>
                    <input
                      value={totalAmount}
                      readOnly
                      type="number"
                      className="border-border w-full focus:border-border mt-1 rounded-lg border-[2px] bg-inherit p-3 focus:outline-none font-semibold"
                    />
                  </div>
                </div>
            </div>
          
            <div>
              <img src={invoiceImage} alt="" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ViewInvoice;