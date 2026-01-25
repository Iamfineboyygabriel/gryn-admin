import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useAllAgent } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import Modal from "../../../../../../../shared/modal/Modal";
import FindAgentByEmail from "../../../../../../../shared/modal/FindAgentByEmail";
import { PrivateElement } from "../../../../../../../shared/redux/hooks/admin/PrivateElement";
import { deleteUser } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import DeleteAgentModal from "../modal/DeleteAgentModal";
import SuccessModal from "../modal/SuccessModal";
import { AppDispatch } from "../../../../../../../shared/redux/store";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const ManageAgents = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const {
    agents,
    currentPage,
    loading,
    fetchAgents,
    searchTerm,
    updateSearchTerm,
  } = useAllAgent();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const handleAssignModal = () => setIsAssignModalOpen(true);
  const handleAssignModalClose = () => setIsAssignModalOpen(false);

  const handleCheckboxChange = (agentId: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromises = selectedAgents.map((agentId) =>
        dispatch(deleteUser(agentId) as any).unwrap()
      );

      await Promise.all(deletePromises);
      setShowDeleteModal(false);
      setSelectedAgents([]);
      setShowSuccessModal(true);
      fetchAgents(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error deleting agents:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchAgents(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    localSearchTerm,
    updateSearchTerm,
    fetchAgents,
    itemsPerPage,
    searchTerm,
  ]);

  const handleViewDetails = useCallback(
    (agentId: string, firstName: string, lastName: string, email: string) => {
      navigate(`/admin/dashboard/all_users/agent_details`, {
        state: { firstName, lastName, agentId, email },
      });
    },
    [navigate]
  );

  useEffect(() => {
    fetchAgents(currentPage, itemsPerPage);
  }, [fetchAgents, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchAgents(value, itemsPerPage);
    },
    [fetchAgents, itemsPerPage]
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

  const filteredAgents = useMemo(() => {
    return (agents || [])?.filter((agent: any) => {
      const fullName =
        `${agent?.profile?.firstName} ${agent?.profile?.lastName}`.toLowerCase();
      return (
        fullName.includes(localSearchTerm.toLowerCase()) ||
        agent?.email?.toLowerCase()?.includes(localSearchTerm?.toLowerCase())
      );
    });
  }, [agents, localSearchTerm]);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAgents?.length > 0) {
      return filteredAgents?.map((agent: any, index: number) => (
        <tr
          key={agent?.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <PrivateElement feature="ALL_USERS" page="delete user">
            <td className="py-[16px] px-[24px]">
              <input
                type="checkbox"
                checked={selectedAgents.includes(agent?.id)}
                onChange={() => handleCheckboxChange(agent?.id)}
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
                `${agent?.profile?.lastName} ${agent?.profile?.firstName}`,
                localSearchTerm
              )
            )}
          />
          <td
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(formatData(agent.email), localSearchTerm)
            )}
          />
          <td className="py-[16px] px-[24px]">
            <p
              onClick={() =>
                handleViewDetails(
                  agent?.id,
                  agent?.profile?.firstName,
                  agent?.profile?.lastName,
                  agent?.profile?.email
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
                No Agents.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    loading,
    filteredAgents,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
    selectedAgents,
    handleCheckboxChange,
    handleViewDetails
  ]);

  return (
    <main>
      <div className="relative">
        <header className="flex items-center flex-col lg:flex-row justify-between">
          <h1 className="font-medium text-xl">All Agents</h1>
          <div className="flex gap-2">
            <PrivateElement feature="ALL_USERS" page="delete user">
              {selectedAgents?.length > 0 && (
                <button.PrimaryButton
                  onClick={handleDeleteSelected}
                  className="mt-[1em] flex gap-2 rounded-full bg-red-500 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
                >
                  Delete Selected ({selectedAgents.length})
                </button.PrimaryButton>
              )}
            </PrivateElement>

            <PrivateElement feature="ALL_USERS" page="Assign Agents">
              <button.PrimaryButton
                onClick={handleAssignModal}
                className="mt-[1em] flex gap-2 rounded-full bg-[#9747FF] px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
              >
                <img src={plus} alt="plus" />
                Assign Agent
              </button.PrimaryButton>
            </PrivateElement>

            <PrivateElement feature="ALL_USERS" page="Update Agents">
              <button.PrimaryButton
                onClick={handleOpenModal}
                className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
              >
                <img src={plus} alt="plus" />
                Update Agent
              </button.PrimaryButton>
            </PrivateElement>

            <PrivateElement feature="ALL_USERS" page="New Agents">
              <Link to="/admin/dashboard/all_users/create_agent">
                <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                  <img src={plus} alt="plus" />
                  New Agent
                </button.PrimaryButton>
              </Link>
            </PrivateElement>
          </div>
        </header>

        <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100">
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
          <table className="w-full mt-4  border-collapse">
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
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={agents.length === itemsPerPage}
          />
        </div>
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <FindAgentByEmail onClose={handleCloseModal} />
        </Modal>
      )}
      {isAssignModalOpen && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={handleAssignModalClose}
          data-aos="zoom-in"
        >
          <FindAgentByEmail
            redirect="/admin/dashboard/all_users/assign_agent"
            onClose={handleAssignModalClose}
          />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteAgentModal
            selectedCount={selectedAgents.length}
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
            message={`Successfully deleted ${selectedAgents.length} agent ${
              selectedAgents.length === 1 ? "member" : "members"
            }.`}
            onClose={() => setShowSuccessModal(false)}
          />
        </Modal>
      )}
    </main>
  );
};

export default ManageAgents;
