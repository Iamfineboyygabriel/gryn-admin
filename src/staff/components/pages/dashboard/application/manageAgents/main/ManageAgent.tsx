import React, { useCallback, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import { useStaffAssignedAgents, useStaffDetails } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import useUserProfile from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);


interface AgentData {
  id: string;
  email: string;
  role: string;
//   phoneNumber?: string;
  firstName:string;
  lastName:string;
  profile:{
    firstName: string;
    lastName: string;
    userId: string;
  }
}

const ManageAgents = () => {
  const { userProfile } = useUserProfile();
  const staffId:any = userProfile?.userId;
  const { agentDetail, loading: agentsLoading } = useStaffAssignedAgents(staffId);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const navigate = useNavigate()
  const filteredAgents = useMemo(() => {
    if (!agentDetail || !Array.isArray(agentDetail.data)) return [];
    return agentDetail.data.filter((agent: AgentData) =>
      agent.email.toLowerCase().includes(localSearchTerm.toLowerCase())
    );
  }, [agentDetail, localSearchTerm]);

  const handleViewDetails = useCallback(
    (userId: string, firstName: string, lastName: string) => {
      navigate(
        `/staff/dashboard/application/manage_agent/agent_details/${userId}`,
        {
          state: { firstName, lastName },
        }
      );
    },
    [navigate]
  );

  const renderTableBody = useCallback(() => {
    if (agentsLoading || agentsLoading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAgents.length > 0) {
      return filteredAgents.map((agent: AgentData, index: number) => (
        <tr
          key={agent.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td className="py-[16px] flex gap-2 px-[24px]">
          {` ${formatData(agent.profile.lastName)} ${formatData(agent.profile.firstName)}`}
          </td>
          {/* <td className="py-[16px] px-[24px]">
            {formatData(agent.phoneNumber)}
          </td> */}
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
                  agent.profile.userId,  
                  agent.profile.firstName,
                  agent.profile.lastName
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
  }, [agentsLoading, agentsLoading, filteredAgents, currentPage, itemsPerPage, sanitizeHTML, highlightText, localSearchTerm, formatData]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Assigned Agents</h1>
          <div className="flex gap-2">
            <Link to="/staff/dashboard/application/create_agent">
              <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                <img src={plus} alt="plus" />
                New Agent
              </button.PrimaryButton>
            </Link>
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

        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Full Name</th>
              {/* <th className="px-6 py-3 text-left text-sm font-normal">Phone Number</th> */}
              <th className="px-6 py-3 text-left text-sm font-normal">Email Address</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ManageAgents;