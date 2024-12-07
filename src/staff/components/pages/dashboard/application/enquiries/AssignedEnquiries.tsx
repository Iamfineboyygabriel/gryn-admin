import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllEnquiryData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 8 })?.map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AssignedEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const {
    enquiries,
    currentPage,
    search,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    loading,
  } = useAllEnquiryData(1, 10, "");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!search?.trim()) return text;
      const regex = new RegExp(`(${search})`, "gi");
      return text?.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [search]
  );

  const handleViewDetails = (item: any) => {
    navigate("/staff/dashboard/application/enquiries/view_details", {
      state: {
        fullName: item?.fullName || "",
        email: item?.email || "",
        currentLocation: item?.currentLocation || "",
        phoneNumber: item?.phoneNumber || "",
        sponsor: item?.sponsor || "",
        university: item?.university || "",
        desiredLocation: item?.desiredLocation,
        degree: item?.degree || "",
        degreeType: item?.highestEducation || "",
        course: item?.desiredCourse || "",
        hearFromUs: item.hearAboutUs || "",
        id: item?.id || "",
      },
    });
  };

  const renderTableBody = useMemo(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (!enquiries?.length) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500">No enquiries found.</p>
            </div>
          </td>
        </tr>
      );
    }

    return enquiries?.map((item: any, index: number) => (
      <tr
        key={item?.id}
        className="text-sm text-grey-primary font-medium border-b border-gray-200"
      >
        <td className="whitespace-nowrap px-6 py-4">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td
          className="whitespace-nowrap px-6 py-4"
          dangerouslySetInnerHTML={sanitizeHTML(
            highlightText(`${formatData(item?.fullName)}`)
          )}
        />
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.staff?.email)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.phoneNumber)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.email)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.highestEducation)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.desiredCourse)}
        </td>
        <td
          className="whitespace-nowrap text-primary-700 font-semibold cursor-pointer px-6 py-4"
          onClick={() => handleViewDetails(item)}
        >
          <p>View Details</p>
        </td>
      </tr>
    ));
  }, [
    enquiries,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    loading,
  ]);

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    handleLimitChange(newLimit);
  };

  return (
    <main className="font-outfit">
      <div className="h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
        <div className="flex mt-[2em] justify-between items-center">
          <div className="flex items-center gap-[1em]">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                placeholder="Search by name"
                value={search || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
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

        <div className="overflow-x-auto mt-[1em]">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white">
              <tr className="text-gray-700 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Assigned Staff
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody}</tbody>
          </table>
        </div>

        {enquiries?.length && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={enquiries?.length >= itemsPerPage}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default AssignedEnquiries;
