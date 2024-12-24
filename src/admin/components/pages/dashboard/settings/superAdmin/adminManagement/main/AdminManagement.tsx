import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { button } from "../../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../../assets/svg/plus.svg";
import CustomPagination from "../../../../../../../../shared/utils/customPagination";
import { useAllAdminForSuperAdmin } from "../../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import Modal from "../../../../../../../../shared/modal/Modal";
import DeleteAdminModal from "../modal/DeleteAdminModal";
import SuccessModal from "../modal/SuccessModal";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AdminManagement = () => {
  const {
    admins = { data: [] },
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchAdmins,
    updateSearchTerm,
  } = useAllAdminForSuperAdmin();
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const itemsPerPage = 10;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromises = selectedUsers.map((userId) =>
        dispatch(deleteUser(userId) as any).unwrap()
      );

      await Promise.all(deletePromises);
      setShowSuccessModal(true);
      setShowDeleteModal(false);
      setSelectedUsers([]);
      fetchAdmins(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error deleting admins:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchAdmins(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    localSearchTerm,
    updateSearchTerm,
    fetchAdmins,
    itemsPerPage,
    searchTerm,
  ]);

  useEffect(() => {
    fetchAdmins(currentPage, itemsPerPage);
  }, [fetchAdmins, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchAdmins(value, itemsPerPage);
    },
    [fetchAdmins, itemsPerPage]
  );

  const escapeRegExp = useCallback((string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, []);

  const highlightText = useCallback(
    (text: string, query: string) => {
      if (!query) return text;
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [escapeRegExp]
  );

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredAdmins = useMemo(() => {
    if (!admins?.data) return [];

    return admins.data.filter((admin: any) => {
      if (!localSearchTerm) return true;

      const fullName = `${admin?.profile?.firstName || ""} ${
        admin?.profile?.lastName || ""
      }`.toLowerCase();
      const searchLower = localSearchTerm.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        admin?.email?.toLowerCase()?.includes(searchLower) ||
        admin?.role?.toLowerCase()?.includes(searchLower)
      );
    });
  }, [admins?.data, localSearchTerm]);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAdmins?.length > 0) {
      return filteredAdmins?.map((admin: any, index: number) => (
        <tr
          key={admin?.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            <input
              type="checkbox"
              checked={selectedUsers.includes(admin?.id)}
              onChange={() => handleCheckboxChange(admin?.id)}
              className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
            />
          </td>
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${admin?.profile?.firstName || ""} ${
                  admin?.profile?.lastName || ""
                }`,
                localSearchTerm
              )
            )}
          />
          <td className="py-[16px] px-[24px]">{formatData(admin?.role)}</td>
          <td
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(formatData(admin?.email), localSearchTerm)
            )}
          />
          <td className="py-[16px] px-[24px]">View Details</td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No admins" />
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              No Admins found.
            </p>
          </div>
        </td>
      </tr>
    );
  }, [
    loading,
    filteredAdmins,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
    selectedUsers,
    handleCheckboxChange,
  ]);

  return (
    <main className="font-outfit px-[1em]">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-xl">Admin Management</h1>
          <div className="flex items-center gap-2">
            {selectedUsers?.length > 0 && (
              <button.PrimaryButton
                onClick={handleDeleteSelected}
                className="mt-[1em] flex gap-2 rounded-full bg-red-500 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
              >
                Delete Selected ({selectedUsers?.length})
              </button.PrimaryButton>
            )}
            <Link to="/admin/dashboard/settings/admin_management/new_admin">
              <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                <img src={plus} alt="plus" />
                New Admin
              </button.PrimaryButton>
            </Link>
          </div>
        </header>

        <div className="flex px-[1em] items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Select
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Role</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {!loading && filteredAdmins?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={filteredAdmins?.length === itemsPerPage}
          />
        </div>
      )}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteAdminModal
            selectedCount={selectedUsers.length}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        </Modal>
      )}

      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <SuccessModal
            message={`Successfully deleted ${selectedUsers.length} admin ${
              selectedUsers.length === 1 ? "member" : "members"
            }.`}
            onClose={() => setShowSuccessModal(false)}
          />
        </Modal>
      )}
    </main>
  );
};

export default AdminManagement;
