import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DOMPurify from "dompurify";
import { useAllAgent } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useNavigate } from "react-router";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../shared/buttons/Button"

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const SeeAllAgents = () => {
  const { 
    agents, 
    totalPages, 
    currentPage, 
    loading, 
    fetchAgents, 
    searchTerm, 
    updateSearchTerm 
  } = useAllAgent();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const itemsPerPage = 10;

  const navigate = useNavigate()
  const handleBackClick = () => navigate(-1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateSearchTerm(localSearchTerm);
        fetchAgents(1, itemsPerPage);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchTerm, updateSearchTerm, fetchAgents, itemsPerPage, searchTerm]);

  const handleViewDetails = useCallback(
    (studentId: string, firstName: string, lastName: string) => {
      navigate(
        `/admin/dashboard/all_users/agent_details/${studentId}`,
        {
          state: { firstName, lastName },
        }
      );
    },
    [navigate]
  );
  
  useEffect(() => {
    fetchAgents(currentPage, itemsPerPage);
  }, [fetchAgents, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    fetchAgents(value, itemsPerPage);
  }, [fetchAgents, itemsPerPage]);

  const escapeRegExp = useCallback((string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }, []);

  const highlightText = useCallback((text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.replace(
      regex,
      (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
    );
  }, [escapeRegExp]);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredAgents = useMemo(() => {
    return (agents || []).filter((agent: any) => {
      const fullName = `${agent.profile.firstName} ${agent.profile.lastName}`.toLowerCase();
      return (
        fullName.includes(localSearchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    });
  }, [agents, localSearchTerm]);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAgents.length > 0) {
      return filteredAgents.map((agent: any, index: number) => (
        <tr
          key={agent.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td 
            className="py-[16px] gap-1 px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${agent.profile.firstName} ${agent.profile.lastName}`,
                localSearchTerm
              )
            )}
          />
          <td 
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                formatData(agent.email),
                localSearchTerm
              )
            )}
          />
          <td className="py-[16px] px-[24px]">
            <p
               onClick={() =>
                handleViewDetails(
                  agent?.id,
                  agent?.profile.firstName,
                  agent?.profile.lastName
                )
              }
              className="text-primary-700 cursor-pointer font-[600] flex items-center gap-[8px]"
            >
              View Application
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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
  }, [loading, filteredAgents, currentPage, itemsPerPage, sanitizeHTML, highlightText, localSearchTerm, formatData]);

  return (
    <main className="font-outfit">
      <h1 className="font-bold text-2xl">Reports</h1>
    <div className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
    <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Reports /
                <span className="ml-1 font-medium text-primary-700">
                  All Agents
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
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

        <table className="w-full mt-4  border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email Address</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>

      {!loading && agents?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={agents.length === itemsPerPage}
          />
        </div>
      )}
      </div>
    </main>
  );
};

export default SeeAllAgents;