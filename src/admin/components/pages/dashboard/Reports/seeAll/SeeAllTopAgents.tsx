import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useTopAgentCommisson } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../shared/buttons/Button";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [originalPage, setOriginalPage] = useState(1);
  const [originalItemsPerPage, setOriginalItemsPerPage] = useState(10);

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

  const formatAmount = useCallback((amount: number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

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

  const performDownload = useCallback(() => {
    try {
      if (!useTopCommission || useTopCommission.length === 0) {
        alert("No data available to download");
        setShouldDownload(false);
        setIsDownloading(false);
        return;
      }

      const excelData = useTopCommission.map((item: any, index: number) => {
        return {
          "S/N": index + 1,
          "Full Name": `${formatData(item?.lastName)} ${formatData(item?.firstName)}`,
          Commission: `NGN ${formatAmount(item?.commission ?? 0)}`,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 }, // S/N
        { wch: 30 }, // Full Name
        { wch: 20 }, // Commission
      ];
      worksheet["!cols"] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Top Agents Report");

      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Top_Agents_Report_${currentDate}.xlsx`;

      XLSX.writeFile(workbook, filename);

      fetchCommissions(originalPage, originalItemsPerPage);

      setShouldDownload(false);
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download report. Please try again.");

      fetchCommissions(originalPage, originalItemsPerPage);
      setShouldDownload(false);
      setIsDownloading(false);
    }
  }, [
    useTopCommission,
    formatData,
    formatAmount,
    fetchCommissions,
    originalPage,
    originalItemsPerPage,
  ]);

  useEffect(() => {
    if (
      shouldDownload &&
      !loading &&
      useTopCommission &&
      useTopCommission.length > 0
    ) {
      performDownload();
    }
  }, [shouldDownload, loading, useTopCommission, performDownload]);

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      setOriginalPage(currentPage);
      setOriginalItemsPerPage(itemsPerPage);

      setShouldDownload(true);

      await fetchCommissions(1, 9999);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download report. Please try again.");
      setShouldDownload(false);
      setIsDownloading(false);
    }
  };

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
            NGN {formatAmount(item?.commission ?? 0)}
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
  }, [sortedTopAgents, loading, formatData, formatAmount]);

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
          <button
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Download Report
              </>
            )}
          </button>
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
