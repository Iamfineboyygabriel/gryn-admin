import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import noData from "../../../../../../../assets/svg/Transaction.svg";
import Error from "../../../../../../../shared/error/Error";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { useSingleStudentApplication } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  email: string;
  degree: {
    degreeType: string;
    course: string;
  };
  documents: unknown[];
  status: string;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 8 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllStudentApplications: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [status, setStatus] = useState("");

  const { applicationDetails, loading, error } = useSingleStudentApplication(
    studentId ?? "",
    {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      sort: sortOrder,
      status: status
    }
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, sortOrder, status, itemsPerPage]);

  const highlightText = useCallback((text: string, query: string): React.ReactNode => {
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
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (newOrder: "asc" | "desc") => {
    setSortOrder(newOrder);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (applicationId: number) => {
    navigate(`/admin/dashboard/all_users/view_Application/${applicationId}`);
  };

  if (error) return <Error error={error} />;

  const { firstName, lastName } =
    (location.state as { firstName?: string; lastName?: string }) || {};

  const renderTableBody = () => {
    if (loading) {
      return Array?.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={`skeleton-${index}`} />
      ));
    }

    if (!applicationDetails?.length) {
      return (
        <tr>
          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
            <div className="flex flex-col items-center justify-center mt-8">
              <img src={noData} alt="No applications" className="mb-4" />
              <p>No applications found</p>
            </div>
          </td>
        </tr>
      );
    }

    return applicationDetails?.map((app: Application, index: number) => (
      <tr
        key={app?.id}
        onClick={() => handleViewDetails(app?.id)}
        className="text-sm text-grey-primary font-medium hover:bg-gray-50 cursor-pointer"
      >
        <td className="whitespace-nowrap px-6 py-4">
          {((currentPage - 1) * itemsPerPage) + index + 1}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(`${app?.lastName} ${app?.middleName} ${app?.firstName}`, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.phoneNumber, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.email, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.degree?.degreeType, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {highlightText(app?.degree?.course, searchTerm)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">{app?.documents?.length}</td>
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
            type="button"
            className="text-primary-700 font-medium hover:underline"
          >
            View Details
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Manage Students /
            <span className="ml-1 font-medium text-primary-700">
              Application Details
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>

        <div className="mt-[1em]">
          <h2 className="text-xl font-semibold text-black">
            {lastName || "-"} {firstName || "-"}
          </h2>
          <p className="mt-[1em] font-medium">All Applications</p>
        </div>

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
                  onChange={(e) => handleSortChange(e.target.value as "asc" | "desc")}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                <select
                  className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
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
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Phone Number
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        {!loading && applicationDetails?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={applicationDetails?.length === itemsPerPage}
            />
          </div>
        )}
      </header>
    </main>
  );
};

export default AllStudentApplications;