import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import { useAllAgents } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import DOMPurify from "dompurify";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { usePagination } from "../../../../../../../shared/utils/paginationUtils";

const AllAgents = () => {
  const { useAllAgent } = useAllAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const agentData = useAllAgent?.data || [];

  const escapeRegExp = (string: any) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: any, query: any) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part: any, index: any) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {DOMPurify.sanitize(part)}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredAgents = agentData.filter((agent: any) =>
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
  const { currentPage, totalPages, visibleData, handlePageChange } =
    usePagination(filteredAgents, itemsPerPage);

  const formatData = (data: any) => (data ? data : "-");

  return (
    <main>
      <div className="relative mt-[2em]">
        <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-6 border-collapse">
          <thead className="text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Phone Number
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
            {visibleData.map((agent: any, index: number) => (
              <tr key={agent.id} className="text-sm text-gray-700">
                <td className="whitespace-nowrap px-6 py-4">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="py-[16px] gap-1 px-[24px]">
                  {formatData(agent?.lastName)} {formatData(agent?.firstName)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(agent?.phoneNumber)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {highlightText(agent.email, searchQuery)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link to={`${agent.id}`} className="text-primary-700">
                    View Application
                  </Link>
                </td>
              </tr>
            ))}
            {filteredAgents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  <div className="mt-[2em] flex flex-col items-center justify-center">
                    <img src={transaction} alt="No applications" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-white">
                      No recent applications.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex w-[60%] items-center justify-between">
          <small>
            Showing {visibleData.length} of {filteredAgents.length} results
          </small>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
};

export default AllAgents;
