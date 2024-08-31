import React, { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useAllAgent } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllAgents = () => {
  const { useAgents, fetchAgents, loading } = useAllAgent();
  const agentData = useMemo(() => useAgents.data || [], [useAgents.data]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAgents(page, itemsPerPage);
  }, [fetchAgents, page, itemsPerPage]);

  useEffect(() => {}, [agentData]);

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

  const filteredAgents = useMemo(
    () =>
      agentData.filter((agent: any) => {
        const firstNameMatches = agent.profile.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const lastNameMatches = agent.profile.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return firstNameMatches || lastNameMatches;
      }),
    [agentData, searchQuery]
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const isCurrentPageEmpty = page > totalPages;

  const visibleData = filteredAgents;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const formatData = (data: any) => (data ? data : "-");

  return (
    <main>
      <div className="relative">
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
                    {highlightText(agent?.profile?.lastName, searchQuery)}
                    {highlightText(agent?.profile?.firstName, searchQuery)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {formatData(agent?.phoneNumber)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {formatData(agent?.email)}
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

export default AllAgents;
