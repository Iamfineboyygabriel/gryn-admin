import React, { useCallback, useEffect, useMemo, useState } from "react";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { FiSearch } from "react-icons/fi";
import { useAllEnquiryData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { button } from "../../../../../../shared/buttons/Button";
import noData from "../../../../../../assets/svg/Transaction.svg";
import EnquiryForm from "../../../../../../shared/modal/EnquiryForm";
import { FaRegFileAlt } from "react-icons/fa";
import EnquiryDetailModalStaff from "../../../../../../shared/modal/EnquiriesDetailModalStaff";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 7 })?.map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface EnquiryItem {
  id: any;
  fullName: string;
  email: string;
  status: EnquiryStatus;
  currentLocation: string;
  phoneNumber: string;
  sponsor: string;
  university: string;
  desiredLocation: string;
  degree: string;
  highestEducation: string;
  desiredCourse: string;
  hearAboutUs: string;
  staff?: {
    email: string;
  };
}

enum EnquiryStatus {
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  DECLINED = "DECLINED",
}

const Enquiries = () => {
  const {
    allEnquiries,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchEnq,
    updateSearchTerm,
  } = useAllEnquiryData();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedEnquiries, setSelectedEnquiries] =
    useState<EnquiryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const handleViewDetails = (details: EnquiryItem) => {
    setSelectedEnquiries(details);
    setIsModalOpen(true);
  };

  const handleFormModal = () => {
    setIsLinkModalOpen(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchEnq(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchTerm, searchTerm, fetchEnq, itemsPerPage, updateSearchTerm]);

  const getStatusLabel = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.SUBMITTED:
        return "Submitted";
      case EnquiryStatus.COMPLETED:
        return "Completed";
      case EnquiryStatus.DECLINED:
        return "Declined";
      default:
        return status || "Submitted";
    }
  };

  useEffect(() => {
    fetchEnq(currentPage, itemsPerPage);
  }, [fetchEnq, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchEnq(value, itemsPerPage);
    },
    [fetchEnq, itemsPerPage]
  );

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredEnq = useMemo(() => {
    if (!allEnquiries?.enq?.data) return [];

    return allEnquiries.enq.data.filter((enqData: any) => {
      if (!localSearchTerm) return true;

      const fullName = `${enqData?.fullName || ""}`.toLowerCase();
      const searchLower = localSearchTerm.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        enqData?.email?.toLowerCase()?.includes(searchLower) ||
        enqData?.role?.toLowerCase()?.includes(searchLower)
      );
    });
  }, [allEnquiries?.enq?.data, localSearchTerm]);

  const hasMore = useMemo(() => {
    return filteredEnq.length === itemsPerPage;
  }, [filteredEnq.length, itemsPerPage]);

  const renderTableBody = useMemo(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (!filteredEnq?.length) {
      return (
        <tr>
          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={noData} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500">No enquiries found.</p>
            </div>
          </td>
        </tr>
      );
    }

    return filteredEnq?.map((item: EnquiryItem, index: number) => (
      <tr
        key={item?.id}
        className="text-sm text-grey-primary font-medium border-b border-gray-200"
      >
        <td className="whitespace-nowrap px-6 py-4">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {`${item?.fullName || ""}`}
        </td>
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
          {formatData(item?.hearAboutUs)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              item?.status === EnquiryStatus.SUBMITTED
                ? "bg-blue-100 text-blue-600"
                : item?.status === EnquiryStatus.COMPLETED
                ? "bg-green-100 text-green-600"
                : item?.status === EnquiryStatus.DECLINED
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {getStatusLabel(formatData(item?.status))}
          </span>
        </td>

        <td
          className="whitespace-nowrap text-primary-700 font-semibold cursor-pointer px-6 py-4"
          onClick={() => handleViewDetails(item)}
        >
          View Details
        </td>
      </tr>
    ));
  }, [filteredEnq, currentPage, itemsPerPage, formatData, loading]);

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    fetchEnq(1, newLimit);
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error loading enquiries: {error}
      </div>
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">Enquiries</h1>
      <div className="mt-[1em] h-auto bg-white flex flex-col gap-[1em] w-full overflow-auto rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[1em]">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                placeholder="Search by name"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-[1.5em]">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Items per page:</span>
              <select
                className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button.PrimaryButton
              onClick={handleFormModal}
              className="m-auto px-[2em] items-center flex justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="submit"
            >
              <FaRegFileAlt />
              Enquiry Form
            </button.PrimaryButton>
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
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Assigned Staff
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Social Media
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody}</tbody>
          </table>
        </div>
        {!loading && allEnquiries?.enq && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={hasMore}
            />
          </div>
        )}
      </div>

      {isModalOpen && selectedEnquiries && (
        <EnquiryDetailModalStaff
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          enquiry={selectedEnquiries}
        />
      )}

      {isLinkModalOpen && (
        <EnquiryForm
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
        />
      )}
    </main>
  );
};

export default Enquiries;
