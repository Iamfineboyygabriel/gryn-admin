import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useTopAgentCommisson } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../shared/buttons/Button"

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 3 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const SeeAllTopAgents: React.FC = () => {
const { useTopCommission, loading, error: commissionError, fetchCommissions, currentPage, } = useTopAgentCommisson();
  const [sortField, setSortField] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommissions(currentPage, itemsPerPage);
  }, [fetchCommissions, currentPage, itemsPerPage]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    fetchCommissions(value, itemsPerPage);
  };

  const filteredAndSortedApplications = useMemo(() => {
    if (!useTopCommission || !Array.isArray(useTopCommission)) {
      return [];
    }

    const filtered = useTopCommission.filter((item: any) =>
        `${item?.lastName || ""} ${item?.firstName || ""} ${item?.middleName || ""}`
          .toLowerCase()
      );

    return filtered.sort((a: any, b: any) => {
      const aValue = (a[sortField as keyof typeof a] || "").toLowerCase();
      const bValue = (b[sortField as keyof typeof b] || "").toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [useTopCommission, sortField, sortOrder]);
  
  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      );
    }

    if (filteredAndSortedApplications.length > 0) {
      return filteredAndSortedApplications.map((item: any, index: number) => (
        <tr
          key={item.id}
          className="text-sm font-medium text-grey-primary border-b border-gray-200"
        >
          {/* <td className="whitespace-nowrap px-6 py-4">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td> */}
           <td className="whitespace-nowrap px-6 py-4">
            { index + 1}
          </td>
           <td className="whitespace-nowrap px-6 py-4">
            {`${`${formatData(item.lastName)} ${formatData(item?.firstName)}`}`}
          </td>
          <td className="whitespace-nowrap px-6 py-4">
            NGN{""}{formatData(item?.commission)}
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No recent commission.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    filteredAndSortedApplications,
    itemsPerPage,
    sanitizeHTML,
    formatData,
    loading,
  ]);

  const handleBackClick = () => navigate(-1);
 
  return (
    <main className="font-outfit">
    <header>
    <div className="flex items-center justify-between">
     <h1 className="text-2xl font-bold">Application</h1>
      </div>
     </header>
        <div className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
     <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Reports /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  All Top Agents
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
      <div className="flex  mt-[1.2em]">
      </div>
      <div className="overflow-x-auto">
      <table className="mt-4 w-full table-auto">
        <thead>
          <tr className="text-gray-700 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Full Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Commission</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
      </div>
      {!loading && useTopCommission?.length > 0 && (
           <div className="mt-6 flex justify-center">
            <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={useTopCommission?.length === itemsPerPage}
          />
        </div>
      )} 
    </div>
    </main>

  );
};

export default SeeAllTopAgents;