// import React, { useMemo, useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router";
// import DOMPurify from "dompurify";
// import { useAllApplication } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
// import CustomPagination from "../../../../../../../shared/utils/customPagination";
// import { FiSearch } from "react-icons/fi";
// import transaction from "../../../../../../../assets/svg/Transaction.svg";

// const SkeletonRow: React.FC = () => (
//   <tr className="animate-pulse border-b border-gray-200">
//     {Array.from({ length: 9 }).map((_, index) => (
//       <td key={index} className="px-6 py-4">
//         <div className="h-4 bg-gray-200 rounded"></div>
//       </td>
//     ))}
//   </tr>
// );

// const AllApplication: React.FC = () => {
//   const { 
//     applications, 
//     totalPages, 
//     currentPage, 
//     loading, 
//     fetchApplications, 
//     searchTerm, 
//     updateSearchTerm 
//   } = useAllApplication();
  
//   const [sortField, setSortField] = useState<"lastName" | "status">("lastName");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   const itemsPerPage = 10;
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchApplications(1, itemsPerPage);
//   }, []); 

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchApplications(1, itemsPerPage);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
//     fetchApplications(newPage, itemsPerPage);
//   }, [fetchApplications, itemsPerPage]);

//   const handleViewDetails = useCallback((applicationId: string) => {
//     navigate(`/admin/dashboard/application/all_application/view_application/${applicationId}`);
//   }, [navigate]);

//   const formatData = useCallback((data: any) => (data ? data : "-"), []);

//   const sanitizeHTML = useCallback((html: string) => {
//     return { __html: DOMPurify.sanitize(html) };
//   }, []);

//   const highlightText = useCallback((text: string) => {
//     if (!searchTerm?.trim()) return text;
//     const regex = new RegExp(`(${searchTerm})`, "gi");
//     return text?.replace(
//       regex,
//       (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
//     );
//   }, [searchTerm]);

//   const sortedApplications = useMemo(() => {
//     if (!applications?.length) return [];

//     return [...applications]?.sort((a, b) => {
//       let aValue = '', bValue = '';
      
//       if (sortField === 'lastName') {
//         aValue = `${a?.lastName || ''} ${a?.firstName || ''} ${a?.middleName || ''}`.toLowerCase();
//         bValue = `${b?.lastName || ''} ${b?.firstName || ''} ${b?.middleName || ''}`.toLowerCase();
//       } else {
//         aValue = (a[sortField] || '')?.toLowerCase();
//         bValue = (b[sortField] || '')?.toLowerCase();
//       }

//       return sortOrder === 'asc' 
//         ? aValue?.localeCompare(bValue)
//         : bValue?.localeCompare(aValue);
//     });
//   }, [applications, sortField, sortOrder]);

//   const handleSort = useCallback((field: "lastName" | "status") => {
//     setSortField(field);
//     setSortOrder(current => current === "asc" ? "desc" : "asc");
//   }, []);

//   const renderTableBody = useCallback(() => {
//     if (loading) {
//       return Array?.from({ length: itemsPerPage })?.map((_, index) => (
//         <SkeletonRow key={`skeleton-${index}`} />
//       ));
//     }

//     if (!sortedApplications?.length) {
//       return (
//         <tr>
//           <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
//             <div className="mt-[2em] flex flex-col items-center justify-center">
//               <img src={transaction} alt="No applications" />
//               <p className="mt-2 text-sm text-gray-500 dark:text-white">
//                 No applications found.
//               </p>
//             </div>
//           </td>
//         </tr>
//       );
//     }

//     return sortedApplications?.map((item, index) => (
//       <tr key={item?.id} className="text-sm text-grey-primary font-medium border-b border-gray-200">
//         <td className="whitespace-nowrap px-6 py-4">
//           {((currentPage - 1) * itemsPerPage) + index + 1}
//         </td>
//         <td
//           className="whitespace-nowrap px-6 py-4"
//           dangerouslySetInnerHTML={sanitizeHTML(
//             highlightText(
//               `${formatData(item?.lastName)} ${formatData(item?.middleName)} ${formatData(item?.firstName)}`
//             )
//           )}
//         />
//         <td className="whitespace-nowrap px-6 py-4">
//           {formatData(item?.phoneNumber)}
//         </td>
//         <td className="whitespace-nowrap px-6 py-4">
//           {formatData(item?.email)}
//         </td>
//         <td className="whitespace-nowrap px-6 py-4">
//           {formatData(item?.degree?.degreeType)}
//         </td>
//         <td className="whitespace-nowrap px-6 py-4">
//           {formatData(item?.degree?.course)}
//         </td>
//         <td className="whitespace-nowrap px-6 py-4">
//           {formatData(item?.documents?.length)}
//         </td>
//         <td className="whitespace-nowrap px-6 py-4">-</td>
//         <td className="flex items-center whitespace-nowrap px-6 py-4">
//           <button
//             className={`mr-2 rounded-full px-3 py-2 text-white ${
//               item?.status === "SUBMITTED" ? "bg-yellow-500" : "bg-green-500"
//             }`}
//           >
//             {item?.status === "SUBMITTED" ? "In Progress" : "Completed"}
//           </button>
//           <button
//             onClick={() => handleViewDetails(item?.id)}
//             className="cursor-pointer font-semibold text-primary-700"
//           >
//             View details
//           </button>
//         </td>
//       </tr>
//     ));
//   }, [
//     loading,
//     sortedApplications,
//     currentPage,
//     itemsPerPage,
//     sanitizeHTML,
//     highlightText,
//     formatData,
//     handleViewDetails
//   ]);

//   return (
//     <main className="mt-[1.3em] font-outfit h-auto w-full bg-white px-[1em] py-3 pb-[10em]">
//       <div className="flex">
//         <div className="flex items-center gap-[1em]">
//           <div className="relative w-full">
//             <input
//               type="text"
//               className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
//               placeholder="Search by name"
//               value={searchTerm || ""}
//               onChange={(e) => updateSearchTerm(e.target.value)}
//             />
//             <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
//           </div>
//           <button
//             className="flex cursor-pointer items-center bg-gray-100 px-3 py-2 rounded"
//             onClick={() => handleSort("lastName")}
//           >
//             <span className="whitespace-nowrap text-sm">
//               Sort by Name
//               {sortField === "lastName" && (sortOrder === "asc" ? " ▲" : " ▼")}
//             </span>
//           </button>
//           <button
//             className="flex cursor-pointer items-center bg-gray-100 px-3 py-2 rounded"
//             onClick={() => handleSort("status")}
//           >
//             <span className="whitespace-nowrap text-sm">
//               Sort by Status
//               {sortField === "status" && (sortOrder === "asc" ? " ▲" : " ▼")}
//             </span>
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto mt-[1em]">
//         <table className="w-full table-auto">
//           <thead className="sticky top-0 bg-white">
//             <tr className="text-gray-700 border-b border-gray-200">
//               <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
//               <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
//                 Full Name
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-normal">Phone</th>
//               <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
//               <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
//                 Degree Type
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
//               <th className="px-6 py-3 text-left text-sm font-normal">
//                 Documents
//               </th>
//               <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
//                 Assigned Agent
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
//             </tr>
//           </thead>
//           <tbody>{renderTableBody()}</tbody>
//         </table>
//       </div>

//       {!loading && applications?.length > 0 && (
//         <div className="mt-6 flex justify-center">
//           <CustomPagination
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//             hasMore={applications?.length === itemsPerPage}
//           />
//         </div>
//       )}
//     </main>
//   );
// };

// export default AllApplication;


import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { useAllApplication } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllApplication: React.FC = () => {
  const { 
    applications, 
    totalPages, 
    currentPage, 
    loading, 
    fetchApplications, 
    searchTerm, 
    updateSearchTerm 
  } = useAllApplication();
  
  const [sortField, setSortField] = useState<"lastName" | "status">("lastName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications(1, itemsPerPage);
  }, []); 

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(1, itemsPerPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    fetchApplications(newPage, itemsPerPage);
  }, [fetchApplications, itemsPerPage]);

  const handleViewDetails = useCallback((applicationId: string) => {
    navigate(`/admin/dashboard/application/all_application/view_application/${applicationId}`);
  }, [navigate]);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback((text: string) => {
    if (!searchTerm?.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text?.replace(
      regex,
      (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
    );
  }, [searchTerm]);

  const sortedApplications = useMemo(() => {
    if (!applications?.length) return [];

    return [...applications]?.sort((a, b) => {
      let aValue = '', bValue = '';
      
      if (sortField === 'lastName') {
        aValue = `${a?.lastName || ''} ${a?.firstName || ''} ${a?.middleName || ''}`.toLowerCase();
        bValue = `${b?.lastName || ''} ${b?.firstName || ''} ${b?.middleName || ''}`.toLowerCase();
      } else {
        aValue = (a[sortField] || '')?.toLowerCase();
        bValue = (b[sortField] || '')?.toLowerCase();
      }

      return sortOrder === 'asc' 
        ? aValue?.localeCompare(bValue)
        : bValue?.localeCompare(aValue);
    });
  }, [applications, sortField, sortOrder]);

  const handleSort = useCallback((field: "lastName" | "status") => {
    setSortField(field);
    setSortOrder(current => current === "asc" ? "desc" : "asc");
  }, []);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array?.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={`skeleton-${index}`} />
      ));
    }

    if (!sortedApplications?.length) {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No applications found.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return sortedApplications?.map((item, index) => (
      <tr key={item?.id} className="text-sm text-grey-primary font-medium border-b border-gray-200">
        <td className="whitespace-nowrap px-6 py-4">
          {((currentPage - 1) * itemsPerPage) + index + 1}
        </td>
        <td
          className="whitespace-nowrap px-6 py-4"
          dangerouslySetInnerHTML={sanitizeHTML(
            highlightText(
              `${formatData(item?.lastName)} ${formatData(item?.middleName)} ${formatData(item?.firstName)}`
            )
          )}
        />
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.phoneNumber)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.email)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.degreeType)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.course)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.documents?.length)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">-</td>
        <td className="flex items-center whitespace-nowrap px-6 py-4">
          <button
            className={`mr-2 rounded-full px-3 py-2 text-white ${
              item?.status === "SUBMITTED" ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            {item?.status === "SUBMITTED" ? "In Progress" : "Completed"}
          </button>
          <button
            onClick={() => handleViewDetails(item?.id)}
            className="cursor-pointer font-semibold text-primary-700"
          >
            View details
          </button>
        </td>
      </tr>
    ));
  }, [
    loading,
    sortedApplications,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails
  ]);

  return (
    <main className="mt-[1.3em] font-outfit">
      <div className="flex">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search by name"
              value={searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
          <button
            className="flex cursor-pointer items-center bg-gray-100 px-3 py-2 rounded"
            onClick={() => handleSort("lastName")}
          >
            <span className="whitespace-nowrap text-sm">
              Sort by Name
              {sortField === "lastName" && (sortOrder === "asc" ? " ▲" : " ▼")}
            </span>
          </button>
          <button
            className="flex cursor-pointer items-center bg-gray-100 px-3 py-2 rounded"
            onClick={() => handleSort("status")}
          >
            <span className="whitespace-nowrap text-sm">
              Sort by Status
              {sortField === "status" && (sortOrder === "asc" ? " ▲" : " ▼")}
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-[1em]">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr className="text-gray-700 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                Degree Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Documents
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
                Assigned Agent
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {!loading && applications?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={applications?.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default AllApplication;