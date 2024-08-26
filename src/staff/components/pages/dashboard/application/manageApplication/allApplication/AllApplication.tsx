import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { useAllApplication } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { usePagination } from "../../../../../../../shared/utils/paginationUtils";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router";

const AllApplication = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");

  const { applications: applicationsData } = useAllApplication();
  const navigate = useNavigate();

  const handleViewDetails = useCallback(
    (applicationId: string) => {
      navigate(
        `/staff/dashboard/application/all_application/view_application/${applicationId}`
      );
    },
    [navigate]
  );

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!searchTerm.trim()) return text;
      const regex = new RegExp(`(${searchTerm})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [searchTerm]
  );

  const filteredAndSortedApplications = useMemo(() => {
    const applications = applicationsData?.applications || [];

    const filtered = applications.filter((item: any) =>
      `${item?.lastName} ${item?.firstName} ${item?.middleName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const sorted = filtered.sort((a: any, b: any) => {
      const aValue = a[sortField]?.toLowerCase() || "";
      const bValue = b[sortField]?.toLowerCase() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [applicationsData, searchTerm, sortField, sortOrder]);

  const handleSort = useCallback((field: string) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  }, []);

  const itemsPerPage = 5;
  const { currentPage, totalPages, visibleData, handlePageChange } =
    usePagination(filteredAndSortedApplications, itemsPerPage);

  const renderTableBody = useCallback(() => {
    if (visibleData.length > 0) {
      return visibleData.map((item: any, index: number) => (
        <tr key={index} className="text-sm text-gray-700 dark:text-white">
          <td className="whitespace-nowrap px-6 py-4">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="whitespace-nowrap px-6 py-4"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${formatData(item?.lastName)} ${formatData(
                  item?.middleName
                )} ${formatData(item?.firstName)}`
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
            {formatData(item?.documents.length)}
          </td>
          <td className="whitespace-nowrap px-6 py-4">-</td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            {item?.status === "SUBMITTED" ? (
              <button className="mr-2 rounded-full bg-yellow-500 px-3 py-2 text-white">
                In Progress
              </button>
            ) : (
              <button className="mr-2 rounded-full bg-green-500 px-3 py-2 text-white">
                Completed
              </button>
            )}
            <p
              onClick={() => handleViewDetails(item?.id)}
              className="cursor-pointer font-semibold text-primary-700"
            >
              View details
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No Student.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    visibleData,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails,
  ]);

  return (
    <main className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em]">
      <div className="flex">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
          <div
            className="flex cursor-pointer items-center rounded-lg bg-gray-100 px-3 py-2"
            onClick={() => handleSort("lastName")}
          >
            <p className="whitespace-nowrap text-sm">
              Sort by Name
              {sortField === "lastName"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </p>
          </div>
          <div
            className="flex cursor-pointer items-center rounded-lg bg-gray-100 px-3 py-2"
            onClick={() => handleSort("status")}
          >
            <p className="whitespace-nowrap text-sm">
              Sort by Status
              {sortField === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </p>
          </div>
        </div>
      </div>
      <table className="w-full mt-[2em] border-collapse">
        <thead className="text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Full Name
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Phone Number
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Email Address
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Degree</th>
            <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
            <th className="px-6 py-3 text-left text-sm font-normal">
              Uploaded Documents
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Assigned to
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4 flex w-[60%] items-center justify-between">
          <small>
            Showing {visibleData.length} of
            {filteredAndSortedApplications.length} results
          </small>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
};

export default AllApplication;
