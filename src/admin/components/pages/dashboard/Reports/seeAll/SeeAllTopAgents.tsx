import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useTopAgentCommisson } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../shared/buttons/Button";
import { DownLoadButton } from "../../../../../../shared/downLoad/DownLoadButton";

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
  const { useTopCommission, loading, fetchCommissions, currentPage } =
    useTopAgentCommisson();

  const [sortField, setSortField] = useState<"lastName" | "commission">(
    "lastName",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const contentRef = useRef(null);

  useEffect(() => {
    fetchCommissions(currentPage, itemsPerPage);
  }, [fetchCommissions, currentPage, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    fetchCommissions(value, itemsPerPage);
  };

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sortedTopAgents = useMemo(() => {
    if (!useTopCommission || !Array.isArray(useTopCommission)) return [];

    const sorted = [...useTopCommission];
    return sorted.sort((a: any, b: any) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortField === "lastName") {
        aValue = `${a.lastName || ""} ${a.firstName || ""}`.toLowerCase();
        bValue = `${b.lastName || ""} ${b.firstName || ""}`.toLowerCase();
      } else if (sortField === "commission") {
        aValue = a.commission || 0;
        bValue = b.commission || 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [useTopCommission, sortField, sortOrder]);

  const renderTableBody = useCallback(() => {
    if (loading)
      return Array.from({ length: 10 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));

    if (sortedTopAgents.length > 0) {
      return sortedTopAgents.map((item: any, index: number) => (
        <tr
          key={item.id}
          className="text-sm font-medium text-grey-primary border-b border-gray-200"
        >
          <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
          <td className="whitespace-nowrap px-6 py-4">{`${formatData(item.lastName)} ${formatData(item.firstName)}`}</td>
          <td className="whitespace-nowrap px-6 py-4">
            NGN {formatData(item.commission || 0)}
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
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
  }, [sortedTopAgents, loading, formatData]);

  const handleBackClick = () => navigate(-1);

  const handleSortClick = (field: "lastName" | "commission") => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <main ref={contentRef} className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Report</h1>
          <DownLoadButton applicationRef={contentRef} />
        </div>
      </header>

      <div className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
        <header className="flex items-center justify-between">
          <h1 className="font-medium">
            Reports /
            <span className="ml-1 font-medium text-primary-700 dark:text-white">
              All Top Agents
            </span>
          </h1>
          <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
            Back
          </button.PrimaryButton>
        </header>

        <div className="overflow-x-auto mt-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-gray-700 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>

                <th
                  className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal cursor-pointer"
                  onClick={() => handleSortClick("lastName")}
                >
                  Full Name{" "}
                  {sortField === "lastName"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>

                <th
                  className="px-6 py-3 text-left text-sm font-normal cursor-pointer"
                  onClick={() => handleSortClick("commission")}
                >
                  Commission{" "}
                  {sortField === "commission"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
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
