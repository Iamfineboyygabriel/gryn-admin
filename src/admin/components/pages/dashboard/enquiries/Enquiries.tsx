import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../shared/redux/store";
import PieChartEnquires from "../Reports/pieChart/PieChartEnquires";
import CustomPagination from "../../../../../shared/utils/customPagination";
import { FiSearch } from "react-icons/fi";
import { useAllEnquiryData } from "../../../../../shared/redux/hooks/admin/getAdminProfile";
import DOMPurify from "dompurify";
import { button } from "../../../../../shared/buttons/Button";
import noData from "../../../../../assets/svg/Transaction.svg";
import EnquiryDetailModal from "../../../../../shared/modal/EnquiriesDetailModal";
import EnquiryForm from "../../../../../shared/modal/EnquiryForm";
import Modal from "../../../../../shared/modal/Modal";
import DeleteEnquiryModal from "./modal/DeleteEnquiryModal";
import SuccessModal from "./modal/SuccessModal";
import { deleteEnquiry } from "../../../../../shared/redux/shared/slices/shareApplication.slices";
import { FaRegFileAlt } from "react-icons/fa";

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
  const dispatch: AppDispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [isDeletingEnquiries, setIsDeletingEnquiries] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedEnquiries, setSelectedEnquiries] =
    useState<EnquiryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const handleViewDetails = (details: EnquiryItem) => {
    setSelectedEnquiries(details);
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedUsers?.length === 0) return;
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (isDeletingEnquiries) return;

    setIsDeletingEnquiries(true);
    setDeleteError(null);

    try {
      const deletePromises = selectedUsers?.map((enquiryId) =>
        dispatch(deleteEnquiry(enquiryId))?.unwrap()
      );

      const results = await Promise?.allSettled(deletePromises);
      const failures = results?.filter(
        (result): result is PromiseRejectedResult =>
          result?.status === "rejected"
      );

      if (failures?.length > 0) {
        const errorMessages = failures
          .map((failure) => failure?.reason?.message || "Unknown error")
          .join(", ");
        setDeleteError(
          `Failed to delete ${failures.length} enquiries. Error: ${errorMessages}`
        );
        return;
      }

      setShowDeleteModal(false);
      setSelectedUsers([]);
      setShowSuccessModal(true);
      fetchEnq(currentPage, itemsPerPage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setDeleteError(`Error deleting enquiries: ${errorMessage}`);
    } finally {
      setIsDeletingEnquiries(false);
    }
  };
  const handleFormModal = () => {
    setIsLinkModalOpen(true);
  };

  const handleCheckboxChange = (enqId: any) => {
    setSelectedUsers((prev) => {
      if (prev.includes(enqId)) {
        return prev.filter((id) => id !== enqId);
      } else {
        return [...prev, enqId];
      }
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchEnq(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchTerm, searchTerm, fetchEnq, itemsPerPage]);

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
          <input
            type="checkbox"
            checked={selectedUsers.includes(item?.id)}
            onChange={() => handleCheckboxChange(item.id)}
            className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
          />
        </td>
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
        <td
          className="whitespace-nowrap text-primary-700 font-semibold cursor-pointer px-6 py-4"
          onClick={() => handleViewDetails(item)}
        >
          View Details
        </td>
      </tr>
    ));
  }, [
    filteredEnq,
    currentPage,
    itemsPerPage,
    formatData,
    loading,
    selectedUsers,
  ]);

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
        <PieChartEnquires />
        <div className="flex mt-[2em] justify-between items-center">
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
            {selectedUsers?.length > 0 && (
              <button.PrimaryButton
                onClick={handleDeleteSelected}
                className="mt-[1em] flex gap-2 rounded-full bg-red-500 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
              >
                Delete Selected ({selectedUsers?.length})
              </button.PrimaryButton>
            )}
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
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Select
                </th>
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

      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <SuccessModal
            message={`Successfully deleted ${selectedUsers.length} ${
              selectedUsers.length === 1 ? "enquiry" : "enquiries"
            }.`}
            onClose={() => setShowSuccessModal(false)}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteEnquiryModal
            selectedCount={selectedUsers.length}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            isDeleting={isDeletingEnquiries}
            error={deleteError}
          />
        </Modal>
      )}

      {isModalOpen && selectedEnquiries && (
        <EnquiryDetailModal
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
