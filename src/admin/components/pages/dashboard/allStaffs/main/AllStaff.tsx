import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
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

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllStaff = () => {
  const {
    admins,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchAdmins,
    updateSearchTerm,
  } = useAllStaffForSuperAdmin();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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
      const fullName =
        `${admin?.profile?.firstName} ${admin?.profile?.lastName}`?.toLowerCase();
      return (
        fullName?.includes(localSearchTerm?.toLowerCase()) ||
        admin?.email.toLowerCase()?.includes(localSearchTerm?.toLowerCase()) ||
        admin?.role?.toLowerCase()?.includes(localSearchTerm?.toLowerCase())
      );
    });
  }, [admins, localSearchTerm]);

  const handleViewDetails = useCallback(
    (staffEmail: string) => {
      navigate("/admin/dashboard/all_staffs/view_profile", {
        state: { staffEmail: staffEmail },
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

    if (filteredAdmins?.length > 0) {
      return filteredAdmins?.map((admin: any, index: number) => (
        <tr
          key={admin?.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="py-[16px] whitespace-nowrap gap-1 px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${admin?.profile?.firstName} ${admin?.profile?.lastName}`,
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
          <PrivateElement feature="ALL_STAFFS" page="View Details">
            <td
              onClick={() => handleViewDetails(admin?.profile?.email)}
              className="py-[16px] text-primary-700 font-medium cursor-pointer px-[24px]"
            >
              View details
            </td>
          </PrivateElement>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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
  }, [
    loading,
    filteredAdmins,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
  ]);

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div className="relative">
          <header className="flex items-center justify-between">
            <h1 className="font-medium text-xl">All Staff</h1>

            <div className="flex gap-2">
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
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    Action
                  </th>
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
    </main>
  );
};

export default AllStaff;
