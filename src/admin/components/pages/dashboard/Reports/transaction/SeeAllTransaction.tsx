import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllSalary } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { button } from "../../../../../../shared/buttons/Button";
import AllStaffPaymentModal from "../../../../../../shared/modal/AllStaffPaymentModal";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 7 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface SalaryItem {
  id: number;
  receiptNo: string;
  senderName: string;
  status: string;
  invoiceId: number | null;
  salaryId: number | null;
  createdAt: string;
  updatedAt: string;
  salary?: {
    id: number;
    paymentNo: string;
    description: string;
    amount: number;
    status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      designation?: string;
      profile?: {
        firstName?: string;
        lastName?: string;
      };
    };
  };
  invoice?: {
    id: number;
    status: string;
    invoiceDate: string;
    createdAt: string;
    user?: {
      designation?: string;
      profile?: {
        firstName?: string;
        lastName?: string;
      };
    };
    item?: {
      id: number;
      name: string;
      amount: number;
      createdAt: string;
    }[];
    document?: {
      id: number;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number | null;
      remark: string;
    }[];
  };
}

const SeeAllTransaction: React.FC = () => {
  const {
    salaries,
    currentPage,
    loading,
    fetchSalaries,
    searchTerm,
    updateSearchTerm,
  } = useAllSalary();

  const [selectedPayment, setSelectedPayment] = useState<SalaryItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const itemsPerPage = 10;
  const STATUS_COMPLETED = "COMPLETED";

  const navigate = useNavigate();
  const contentRef = useRef(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatAmount = (amount: number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleViewDetails = (payment: SalaryItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSalaries(currentPage, itemsPerPage, STATUS_COMPLETED);
  }, [fetchSalaries, currentPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchSalaries(page, itemsPerPage, STATUS_COMPLETED);
    },
    [fetchSalaries],
  );

  const filteredAndSortedSalaries = useMemo(() => {
    if (!salaries || !Array.isArray(salaries)) {
      return [];
    }

    return salaries.filter((item: SalaryItem) => {
      // Check both salary and invoice for user data
      const salaryUser = item.salary?.user?.profile;
      const invoiceUser = item.invoice?.user?.profile;

      const fullName = salaryUser
        ? `${salaryUser.lastName || ""} ${salaryUser.firstName || ""}`.toLowerCase()
        : invoiceUser
          ? `${invoiceUser.lastName || ""} ${invoiceUser.firstName || ""}`.toLowerCase()
          : "";

      const matchesSearch =
        fullName.includes((searchTerm || "").toLowerCase()) ||
        item.receiptNo
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase()) ||
        item.senderName
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase());

      return matchesSearch;
    });
  }, [salaries, searchTerm]);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .replace(",", "")
      .toLowerCase();
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      // Use all current data (you might want to fetch all data here with limit: 9999)
      const dataToExport = filteredAndSortedSalaries;

      if (dataToExport.length === 0) {
        alert("No data available to download");
        return;
      }

      // Format data for Excel
      const excelData = dataToExport.map((item: SalaryItem, index: number) => {
        const salaryUser = item.salary?.user;
        const invoiceUser = item.invoice?.user;
        const amount =
          item.salary?.amount || item.invoice?.item?.[0]?.amount || 0;
        const designation =
          salaryUser?.designation || invoiceUser?.designation || "-";
        const fullName = salaryUser?.profile
          ? `${salaryUser.profile.firstName} ${salaryUser.profile.lastName}`
          : invoiceUser?.profile
            ? `${invoiceUser.profile.firstName} ${invoiceUser.profile.lastName}`
            : "-";

        return {
          "S/N": index + 1,
          "Receipt No.": item.receiptNo,
          "Sender's Name": item.senderName || "-",
          "Staff Name": fullName,
          Amount: amount > 0 ? `NGN ${formatAmount(amount)}` : "-",
          Designation: designation,
          "Date & Time": formatDateTime(item.createdAt),
          Status: item.status,
          Description: item.salary?.description || "-",
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 }, // S/N
        { wch: 15 }, // Receipt No.
        { wch: 20 }, // Sender's Name
        { wch: 20 }, // Staff Name
        { wch: 20 }, // Amount
        { wch: 25 }, // Designation
        { wch: 25 }, // Date & Time
        { wch: 15 }, // Status
        { wch: 30 }, // Description
      ];
      worksheet["!cols"] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions Report");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Transactions_Report_${currentDate}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAndSortedSalaries.length > 0) {
      return filteredAndSortedSalaries.map(
        (item: SalaryItem, index: number) => {
          // Get data from either salary or invoice
          const salaryUser = item.salary?.user;
          const invoiceUser = item.invoice?.user;
          const amount = item.salary?.amount || item.invoice?.item?.[0]?.amount;
          const designation =
            salaryUser?.designation || invoiceUser?.designation;

          return (
            <tr
              key={item.id}
              className="text-sm text-grey-primary font-medium border-b border-gray-200"
            >
              <td className="whitespace-nowrap px-6 py-4">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{item.receiptNo}</td>
              <td className="whitespace-nowrap px-6 py-4">
                {formatData(item.senderName)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {amount ? `NGN ${formatAmount(amount)}` : "-"}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {formatData(designation)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  className={`mr-2 rounded-full px-3 py-2 text-white ${
                    item?.status === "MONEY_OUT"
                      ? "bg-red-500"
                      : item?.status === "MONEY_IN"
                        ? "bg-green-500"
                        : "bg-red-500"
                  }`}
                >
                  {item?.status}
                </button>
              </td>
              <td className="flex items-center whitespace-nowrap px-6 py-4">
                <p
                  onClick={() => handleViewDetails(item)}
                  className="cursor-pointer font-semibold text-primary-700"
                >
                  View details
                </p>
              </td>
            </tr>
          );
        },
      );
    }

    return (
      <tr>
        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No applications" />
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              No recent payments.
            </p>
          </div>
        </td>
      </tr>
    );
  }, [
    filteredAndSortedSalaries,
    currentPage,
    itemsPerPage,
    formatData,
    loading,
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
      <div className="mt-[1.3em] font-outfit h-auto w-full bg-white px-[1em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Reports /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  All Transaction
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div className="relative mt-[1.5em]">
          <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search"
              value={searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            <FiSearch className="mr-3 text-lg text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto mt-[1em]">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white">
              <tr className="text-gray-700 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Receipt No.
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Sender's Name
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Designation
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Date & Time
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  status
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">{renderTableBody()}</tbody>
          </table>
        </div>
        {!loading && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={salaries?.length === itemsPerPage}
            />
          </div>
        )}
      </div>
      {isModalOpen && selectedPayment && (
        <AllStaffPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
        />
      )}
    </main>
  );
};

export default SeeAllTransaction;
