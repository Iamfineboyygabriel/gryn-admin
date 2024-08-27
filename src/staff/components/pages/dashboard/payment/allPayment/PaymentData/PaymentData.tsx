// import { usePagination } from "../../../../../../../shared/utils/paginationUtils";
// import CustomPagination from "../../../../../../../shared/utils/customPagination";
// import transaction from "../../../../../../../assets/svg/Transaction.svg";
// import { FiSearch } from "react-icons/fi";

// const Data = [
//   {
//     sn: "1",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "2",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "3",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "4",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "5",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "6",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "7",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "8",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "9",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
//   {
//     sn: "10",
//     fullName: "Deji Otunba",
//     phoneNumber: "+2349012345556",
//     email: "dejiotunba@gmail.com",
//     action: "view details",
//   },
// ];
// const PaymentData = () => {
//   const itemsPerPage = 9;
//   const { currentPage, totalPages, visibleData, handlePageChange } =
//     usePagination(Data, itemsPerPage);

//   return (
//     <main className="font-outfit">
//       <div className="flex items-center gap-[1em]">
//         <div className="relative">
//           <input
//             type="text"
//             className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
//             placeholder="search"
//           />
//           <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
//         </div>
//       </div>
//       <div className="mt-[1.5em] overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead className="text-gray-500">
//             <tr>
//               <div className="flex gap-[10px]">
//                 <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
//                 <th className="px-6 py-3 text-left text-sm font-normal">
//                   Full Name
//                 </th>
//               </div>
//               <th className="px-6 py-3 text-left text-sm font-normal">
//                 Phone Number
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-normal">
//                 Email Address
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-normal">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {visibleData.map((item, index) => (
//               <tr key={index} className="text-sm text-gray-700">
//                 <div className="flex gap-[10px]">
//                   <td className="whitespace-nowrap px-6 py-4">{item.sn}</td>
//                   <td className="whitespace-nowrap px-6 py-4">
//                     {item.fullName}
//                   </td>
//                 </div>
//                 <td className="whitespace-nowrap px-6 py-4">
//                   {item.phoneNumber}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
//                 <td className="whitespace-nowrap px-6 py-4 font-medium text-primary-700">
//                   {item.action}
//                 </td>
//               </tr>
//             ))}
//             {visibleData.length === 0 && (
//               <tr>
//                 <div className="mt-8 flex flex-col items-center justify-center">
//                   <img src={transaction} alt="No applications" />
//                   <p className="mt-2 font-medium">No applications</p>
//                 </div>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {totalPages > 1 && (
//         <div className="mt-4 flex w-[60%] items-center justify-between">
//           <small>
//             Showing {visibleData.length} of {Data.length} results
//           </small>
//           <CustomPagination
//             totalPages={totalPages}
//             currentPage={currentPage}
//             handlePageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </main>
//   );
// };

// export default PaymentData;

import React from 'react'

const PaymentData = () => {
  return (
    <div>PaymentData</div>
  )
}

export default PaymentData
