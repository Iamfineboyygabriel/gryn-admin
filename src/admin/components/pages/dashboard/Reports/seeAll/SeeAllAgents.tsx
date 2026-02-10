import React, {
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from "react";
import { FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DOMPurify from "dompurify";
import { useAllAgent } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useNavigate } from "react-router";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { button } from "../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";

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
    currentPage,
    loading,
    fetchAgents,
    searchTerm,
    updateSearchTerm,
  } = useAllAgent();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [originalPage, setOriginalPage] = useState(1);
  const [originalItemsPerPage, setOriginalItemsPerPage] = useState(10);
  const itemsPerPage = 10;
  const contentRef = useRef(null);

  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);

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
    [navigate],
  );

  useEffect(() => {
    fetchAgents(currentPage, itemsPerPage);
  }, [fetchAgents, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchAgents(value, itemsPerPage);
    },
    [fetchAgents, itemsPerPage],
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
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`,
      );
    },
    [escapeRegExp],
  );

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredAgents = useMemo(() => {
    return (agents || []).filter((agent: any) => {
      const fullName =
        `${agent.profile.firstName} ${agent.profile.lastName}`.toLowerCase();
      return (
        fullName.includes(localSearchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    });
  }, [agents, localSearchTerm]);

  const performDownload = useCallback(() => {
    try {
      if (!agents || agents.length === 0) {
        toast.error("No data available to download");
        setShouldDownload(false);
        setIsDownloading(false);
        return;
      }

      // Format data for Excel
      const excelData = agents.map((agent: any, index: number) => {
        return {
          "S/N": index + 1,
          "Full Name": `${formatData(agent?.profile?.lastName)} ${formatData(agent?.profile?.firstName)}`,
          "Email Address": formatData(agent?.email),
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 }, // S/N
        { wch: 30 }, // Full Name
        { wch: 35 }, // Email Address
      ];
      worksheet["!cols"] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Agents Report");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Agents_Report_${currentDate}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      toast.success("Report downloaded successfully");

      // Restore original pagination
      fetchAgents(originalPage, originalItemsPerPage);

      // Reset download state
      setShouldDownload(false);
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download report. Please try again.");

      // Restore original pagination on error
      fetchAgents(originalPage, originalItemsPerPage);
      setShouldDownload(false);
      setIsDownloading(false);
    }
  }, [agents, formatData, fetchAgents, originalPage, originalItemsPerPage]);

  // Effect to trigger download when data is ready
  useEffect(() => {
    if (shouldDownload && !loading && agents && agents.length > 0) {
      performDownload();
    }
  }, [shouldDownload, loading, agents, performDownload]);

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      // Store current pagination
      setOriginalPage(currentPage);
      setOriginalItemsPerPage(itemsPerPage);

      // Set flag to trigger download after data loads
      setShouldDownload(true);

      // Fetch ALL agents
      await fetchAgents(1, 9999);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download report. Please try again.");
      setShouldDownload(false);
      setIsDownloading(false);
    }
  };

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
          className="text-[14px] overflow-x-auto border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="py-[16px] whitespace-nowrap gap-1 px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${agent?.profile?.lastName}  ${agent?.profile?.firstName}`,
                localSearchTerm,
              ),
            )}
          />
          <td
            className="py-[16px] whitespace-nowrap px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(formatData(agent.email), localSearchTerm),
            )}
          />
          <td className="py-[16px] px-[24px]">
            <p
              onClick={() =>
                handleViewDetails(
                  agent?.id,
                  agent?.profile?.firstName,
                  agent?.profile?.lastName,
                  agent?.profile?.email,
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
  }, [
    loading,
    filteredAgents,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    localSearchTerm,
    formatData,
    handleViewDetails,
  ]);

  return (
    <main ref={contentRef} className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
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

        {!loading && (
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
