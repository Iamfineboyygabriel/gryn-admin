import React, { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useAllPendingAgents } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const PendingAgents = () => {
  const { useAllPending, loading,  fetchAgents } = useAllPendingAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAgents(page, itemsPerPage);
  }, [fetchAgents, page, itemsPerPage]);

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part: string, index: number) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {DOMPurify.sanitize(part)}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredAgents = useMemo(() => {
    return (useAllPending || []).filter((agent: any) => {
      const fullName =
        `${agent.profile.firstName} ${agent.profile.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [useAllPending, searchQuery]);

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const isCurrentPageEmpty = page > totalPages;

  const visibleData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, page, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const formatData = (data: any) => (data ? data : "-");

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <main>
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-xl">Pending Agents</h1>
          <div className="flex gap-2">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              Update Agent
            </button.PrimaryButton>
            <Link to="/admin/dashboard/application/manage_application/new_application">
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
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
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : visibleData.length > 0 ? (
              visibleData.map((agent: any, index: number) => (
                <tr
                  key={agent.id}
                  className="text-[14px] leading-[20px] text-grey-primary font-medium"
                >
                  <td className="py-[16px] px-[24px]">
                    {(page - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-[16px] gap-1 px-[24px]">
                    {highlightText(
                      `${agent.profile.firstName} ${agent.profile.lastName}`,
                      searchQuery
                    )}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {formatData(agent.phoneNumber)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {formatData(agent.email)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    <Link
                      to={`/agent/${agent.id}`}
                      className="text-primary-700 font-[600] flex items-center gap-[8px]"
                    >
                      View Application
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
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
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredAgents.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            page={page}
            onChange={handlePageChange}
            isCurrentPageEmpty={isCurrentPageEmpty}
          />
        </div>
      )}
    </main>
  );
};

export default PendingAgents;