import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import DOMPurify from "dompurify";
import Modal from "../../../../../../../shared/modal/Modal";
import FindStudentByEmail from "../../../../../../../shared/modal/FindStudentByEmail";
import { useAllStudents } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { PrivateElement } from "../../../../../../../shared/redux/hooks/admin/PrivateElement";
import { deleteUser } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import DeleteStudentModal from "../modal/DeleteStudentModal";
import SuccessModal from "../modal/SuccessModal";
import { AppDispatch } from "../../../../../../../shared/redux/store";

interface Student {
  profile: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  id: string;
  email: string;
  phoneNumber: string;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllStudents: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const {
    useAllStudent,
    currentPage,
    loading,
    fetchApplications,
    searchTerm,
    updateSearchTerm,
  } = useAllStudents();
  const [isModalOpen, setModalOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromises = selectedStudents.map((studentId) =>
        dispatch(deleteUser(studentId) as any).unwrap()
      );

      await Promise.all(deletePromises);
      setShowDeleteModal(false);
      setSelectedStudents([]);
      setShowSuccessModal(true);
      fetchApplications(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error deleting students:", error);
    }
  };

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  const studentsData = useMemo(() => {
    const data = useAllStudent || [];
    return Array?.isArray(data) ? data : [];
  }, [useAllStudent]);

  const filteredStudents = useMemo(() => {
    return studentsData?.filter((student: Student) =>
      `${student?.profile?.firstName} ${student?.profile?.lastName} ${student?.email}`
        .toLowerCase()
        .includes(localSearchTerm.toLowerCase())
    );
  }, [studentsData, localSearchTerm]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchApplications(page, itemsPerPage);
    },
    [fetchApplications, itemsPerPage]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
    updateSearchTerm(e.target.value);
  };

  const formatData = useCallback(
    (data: string | undefined): string => (data ? data : "-"),
    []
  );

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!localSearchTerm.trim()) return text;
      const regex = new RegExp(`(${localSearchTerm})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [localSearchTerm]
  );

  const handleViewDetails = useCallback(
    (studentId: string, firstName: string, lastName: string) => {
      navigate(`/admin/dashboard/all_users/student_applications`, {
        state: { firstName, lastName, studentId },
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

    if (filteredStudents.length > 0) {
      return filteredStudents.map((student: Student, index: number) => (
        <tr
          key={student.id}
          className="text-[14px] leading-[20px] text-grey-primary font-medium"
        >
          <PrivateElement feature="ALL_USERS" page="delete user">
            <td className="py-[16px] px-[24px]">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleCheckboxChange(student.id)}
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
                `${formatData(student?.profile?.lastName)}  ${formatData(
                  student?.profile?.firstName
                )}`
              )
            )}
          />
          <td
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(student?.email)
            )}
          />
          <td className="py-[16px] px-[24px]">
            <p
              onClick={() =>
                handleViewDetails(
                  student?.id,
                  student?.profile?.firstName,
                  student?.profile?.lastName
                )
              }
              className="text-primary-700 whitespace-nowrap cursor-pointer font-[600] flex items-center gap-[8px]"
            >
              View Application
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No student available.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    loading,
    filteredStudents,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails,
    selectedStudents,
    handleCheckboxChange,
  ]);

  return (
    <main>
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-xl">All Students</h1>

          <div className="flex gap-2">
            <PrivateElement feature="ALL_USERS" page="delete user">
              {selectedStudents?.length > 0 && (
                <button.PrimaryButton
                  onClick={handleDeleteSelected}
                  className="mt-[1em] flex gap-2 rounded-full bg-red-500 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
                >
                  Delete Selected ({selectedStudents.length})
                </button.PrimaryButton>
              )}
            </PrivateElement>

            <PrivateElement feature="ALL_USERS" page="Update Student">
              <button.PrimaryButton
                onClick={handleOpenModal}
                className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
              >
                <img src={plus} alt="plus" />
                Update Student
              </button.PrimaryButton>
            </PrivateElement>

            <PrivateElement feature="ALL_USERS" page="New Student">
              <Link to="/admin/dashboard/all_users/create_student">
                <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                  <img src={plus} alt="plus" />
                  New Student
                </button.PrimaryButton>
              </Link>
            </PrivateElement>
          </div>
        </header>

        <div className="flex items-center w-64 mt-[1em] rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            value={localSearchTerm}
            onChange={handleSearchChange}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mt-6 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <PrivateElement feature="ALL_USERS" page="delete user">
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    Select
                  </th>
                </PrivateElement>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={studentsData.length === itemsPerPage}
          />
        </div>
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <FindStudentByEmail onClose={handleCloseModal} />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteStudentModal
            selectedCount={selectedStudents.length}
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
            message={`Successfully deleted ${selectedStudents.length} staff ${
              selectedStudents.length === 1 ? "member" : "members"
            }.`}
            onClose={() => setShowSuccessModal(false)}
          />
        </Modal>
      )}
    </main>
  );
};

export default AllStudents;
