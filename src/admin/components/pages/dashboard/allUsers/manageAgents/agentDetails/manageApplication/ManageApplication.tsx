import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import noData from "../../../../../../../../assets/svg/Transaction.svg";
import Error from "../../../../../../../../shared/error/Error";
import CustomPagination from "../../../../../../../../shared/utils/customPagination";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  degree: {
    degreeType: string | null;
    course: string | null;
  } | null;
  documents: unknown[] | null;
  status: string;
}

interface ManageApplicationProps {
  applicationDetails: {
    application: Application[];
  };
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortOrder: "asc" | "desc";
  status: string;
  itemsPerPage: number;
  currentPage: number;
  onSearchChange: (search: string) => void;
  onSortChange: (order: "asc" | "desc") => void;
  onStatusChange: (status: string) => void;
  onItemsPerPageChange: (items: number) => void;
  onPageChange: (page: number) => void;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 8 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

const ManageApplication: React.FC<ManageApplicationProps> = ({
  applicationDetails,
  loading,
  error,
  searchTerm,
  sortOrder,
  status,
  itemsPerPage,
  currentPage,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onItemsPerPageChange,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = useCallback(
    (applicationId: number) => {
      navigate("/admin/dashboard/all_users/view_Application", {
        state: { applicationId: applicationId }
      });
    },
    [navigate]
  );


  const highlightText = useCallback(
    (text: string, query: string): React.ReactNode => {
      if (!query.trim()) return text;
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-300">
            {part}
          </span>
        ) : (
          part
        )
      );
    },
    []
  );

  if (error) return <Error error={error} />;


  if (!applicationDetails?.application || applicationDetails?.application?.length === 0) {
    return (
      <div className="flex justify-center">
      <tr>
        <td colSpan={8} className="px- py-4 flex justify-center text-center text-gray-500">
          <div className="flex flex-col items-center justify-center mt-8">
            <img src={noData} alt="No applications" className="mb-4" />
            <p>No applications found</p>
          </div>
        </td>
      </tr>
      </div>
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={`skeleton-${index}`} />
      ));
    }

  
    return applicationDetails?.application?.map((app, index) => (
      <tr
        key={app?.id}
        onClick={() => handleViewDetails(app?.id)}
        className="text-sm text-grey-primary font-medium hover:bg-gray-50 cursor-pointer"
      >
        <td className="whitespace-nowrap px-6 py-4">
          {((currentPage - 1) * itemsPerPage) + index + 1}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(`${app?.lastName ?? "-"} ${app?.firstName ?? "-"}`, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app.phoneNumber ?? "-", searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.email ?? "-", searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.degree?.degreeType ?? "-", searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.degree?.course ?? "-", searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">{app?.documents?.length ?? 0}</td>
        <td className="whitespace-nowrap px-6 py-4">
          <button
            className={`mr-2 rounded-full px-3 py-2 text-white ${
              app.status === "SUBMITTED" ? "bg-yellow-500" : 
              app.status === "COMPLETED" ? "bg-green-500" :
              "bg-red-500"
            }`}
          >
            {app.status === "SUBMITTED" ? "In Progress" : 
             app.status === "COMPLETED" ? "Completed" :
             "Declined"}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(app?.id);
            }}
            type="button" 
            className="text-primary-700 hover:underline"
          >
            View Details
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <main className="font-outfit">
      <section className="mt-[1em]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[1em]">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
            <div className="flex gap-2">
              <select
                className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
                value={sortOrder}
                onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <select
                className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="SUBMITTED">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Items per page:</span>
            <select
              className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Phone Number</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email Address</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Degree</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Documents</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {!loading && applicationDetails?.application?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={applicationDetails.application.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default ManageApplication;