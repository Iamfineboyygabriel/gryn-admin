import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch, FiLogOut } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllStaffForSuperAdmin } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import Modal from "../../../../../../shared/modal/Modal";
import UpdateStaff from "./UpdateStaff";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../shared/redux/store";
import { deleteUser } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import DeleteStaffModal from "../modal/DeleteStaffModal";
import SuccessModal from "../modal/SuccessModal";
import { logoutAdminUserBySuperAdmin } from "../../../../../../shared/redux/shared/slices/shareLanding.slices";
import { toast } from "react-toastify";

interface AdminUser {
  id: string | number;
  email: string;
  role: string;
  designation: string;
  profile?: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    designation: string;
  };
}

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 7 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllStaff = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const {
    admins,
    currentPage,
    loading,
    searchTerm,
    fetchAdmins,
    updateSearchTerm,
  } = useAllStaffForSuperAdmin();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLogoutUser, setSelectedLogoutUser] = useState<{
    email: string;
  } | null>(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleLogoutClick = (email: string) => {
    setSelectedLogoutUser({ email });
  };

  const handleConfirmLogout = async () => {
    if (!selectedLogoutUser) return;

    try {
      await dispatch(
        logoutAdminUserBySuperAdmin(selectedLogoutUser.email)
      ).unwrap();
      toast.success(`Successfully logged out ${selectedLogoutUser.email}`);
      fetchAdmins(currentPage, itemsPerPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to logout staff user");
    } finally {
      setSelectedLogoutUser(null);
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromises = selectedUsers.map((userId) =>
        dispatch(deleteUser(userId)).unwrap()
      );
      await Promise.all(deletePromises);
      setShowDeleteModal(false);
      setSelectedUsers([]);
      setShowSuccessModal(true);
      fetchAdmins(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleCheckboxChange = (userId: string | number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
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
    searchTerm,
    updateSearchTerm,
    fetchAdmins,
    itemsPerPage,
  ]);

  useEffect(() => {
    fetchAdmins(currentPage, itemsPerPage);
  }, [fetchAdmins, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: any, value: any) => {
      fetchAdmins(value, itemsPerPage);
    },
    [fetchAdmins, itemsPerPage]
  );

  const escapeRegExp = useCallback((string: any) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, []);

  const highlightText = useCallback(
    (text: any, query: any) => {
      if (!query) return text;
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      return text.replace(
        regex,
        (match: any) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [escapeRegExp]
  );

  const sanitizeHTML = useCallback((html: any) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const handleViewDetails = useCallback(
    (staffEmail: any) => {
      navigate("/admin/dashboard/all_staffs/view_profile", {
        state: { staffEmail },
      });
    },
    [navigate]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (!admins?.data?.length) {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No admins" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No Staff found.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return admins.data.map((admin: AdminUser, index: number) => (
      <tr
        key={admin?.id}
        className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
      >
        <PrivateElement feature="ALL_STAFFS" page="delete user">
          <td className="py-[16px] px-[24px]">
            <input
              type="checkbox"
              checked={selectedUsers.includes(admin?.id)}
              onChange={() => handleCheckboxChange(admin?.id)}
              className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
            />
          </td>
        </PrivateElement>
        <td className="py-[16px] px-[24px]">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td
          className="py-[16px] whitespace-nowrap gap-1 px-[24px]"
          dangerouslySetInnerHTML={sanitizeHTML(
            highlightText(
              `${admin?.profile?.lastName} ${admin?.profile?.firstName}`,
              localSearchTerm
            )
          )}
        />
        <td className="py-[16px] px-[24px]">
          {formatData(admin?.designation)}
        </td>
        <td
          className="py-[16px] px-[24px]"
          dangerouslySetInnerHTML={sanitizeHTML(
            highlightText(formatData(admin?.email), localSearchTerm)
          )}
        />
        <PrivateElement feature="ALL_STAFFS" page="View Details">
          <td className="py-[16px] px-[24px] flex gap-4">
            <span
              onClick={() => handleViewDetails(admin?.profile?.email)}
              className="text-primary-700 font-medium cursor-pointer"
            >
              View details
            </span>
            <PrivateElement feature="ALL_STAFFS" page="logout user">
              <button
                onClick={() => handleLogoutClick(admin?.email)}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </PrivateElement>
          </td>
        </PrivateElement>
      </tr>
    ));
  }, [
    loading,
    admins?.data,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
    selectedUsers,
    handleCheckboxChange,
    handleViewDetails,
  ]);

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div className="relative">
          <header className="flex items-center justify-between">
            <h1 className="font-medium text-xl">All Staff</h1>

            <div className="flex items-center gap-2">
              <PrivateElement feature="ALL_STAFFS" page="delete user">
                {selectedUsers?.length > 0 && (
                  <div>
                    <button.PrimaryButton
                      onClick={handleDeleteSelected}
                      className="mt-[1em] flex gap-2 rounded-full bg-red-500 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
                    >
                      Delete Selected ({selectedUsers.length})
                    </button.PrimaryButton>
                  </div>
                )}
              </PrivateElement>

              <PrivateElement feature="ALL_STAFFS" page="Update Staff">
                <button.PrimaryButton
                  onClick={handleOpenModal}
                  className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
                >
                  <img src={plus} alt="plus" />
                  Update Staff
                </button.PrimaryButton>
              </PrivateElement>

              <PrivateElement feature="ALL_STAFFS" page="New Staff">
                <Link to="/admin/dashboard/all_staffs/create_staff">
                  <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                    <img src={plus} alt="plus" />
                    New Staff
                  </button.PrimaryButton>
                </Link>
              </PrivateElement>
            </div>
          </header>

          <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
            <input
              type="text"
              className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
              placeholder="Search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <FiSearch className="mr-3 text-lg text-gray-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse">
              <thead className="text-gray-500 border-b border-gray-200">
                <tr>
                  <PrivateElement feature="ALL_STAFFS" page="delete user">
                    <th className="px-6 py-3 text-left text-sm font-normal">
                      Select
                    </th>
                  </PrivateElement>
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    Email Address
                  </th>
                  <PrivateElement feature="ALL_STAFFS" page="View Details">
                    <th className="px-6 py-3 text-left text-sm font-normal">
                      Actions
                    </th>
                  </PrivateElement>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        </div>

        {!loading && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={admins?.data?.length === itemsPerPage}
            />
          </div>
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            data-aos="zoom-in"
          >
            <UpdateStaff onClose={handleCloseModal} />
          </Modal>
        )}
      </div>

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteStaffModal
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
            message={`Successfully deleted ${selectedUsers.length} staff ${
              selectedUsers.length === 1 ? "member" : "members"
            }.`}
            onClose={() => setShowSuccessModal(false)}
          />
        </Modal>
      )}

      {selectedLogoutUser && (
        <Modal
          isOpen={!!selectedLogoutUser}
          onClose={() => setSelectedLogoutUser(null)}
        >
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">
              Are you sure you want to log out {selectedLogoutUser.email}?
            </p>
            <div className="flex justify-end gap-4">
              <button.PrimaryButton
                onClick={() => setSelectedLogoutUser(null)}
                className="px-4 text-green-500 py-2"
              >
                Cancel
              </button.PrimaryButton>
              <button.PrimaryButton
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-500 rounded-lg text-white"
              >
                Logout User
              </button.PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AllStaff;
