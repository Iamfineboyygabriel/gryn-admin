import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate} from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllSalary } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { button } from "../../../../../../shared/buttons/Button";
import AllStaffPaymentModal from "../../../../../../shared/modal/AllStaffPaymentModal";
import { DownLoadButton } from "../../../../../../shared/downLoad/DownLoadButton";

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
  createdAt: string;
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
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    [fetchSalaries]
  );

  const filteredAndSortedSalaries = useMemo(() => {
    if (!salaries || !Array.isArray(salaries)) {
      return [];
    }

    return salaries.filter((item: SalaryItem) => {
      const fullName = `${item.invoice?.user?.profile?.lastName || ""} ${
        item.invoice?.user?.profile?.firstName || ""
      }`.toLowerCase();

      const matchesSearch = fullName.includes((searchTerm || "").toLowerCase());
      const isCompleted = item.invoice?.status === STATUS_COMPLETED;

      return matchesSearch && isCompleted;
    });
  }, [salaries, searchTerm]);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAndSortedSalaries.length > 0) {
      return filteredAndSortedSalaries.map(
        (item: SalaryItem, index: number) => (
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
              {formatData(
                item.invoice?.item?.[0]?.amount
                  ? formatAmount(item.invoice?.item?.[0]?.amount)
                  : "-"
              )}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              {formatData(item.invoice?.user?.designation)}
            </td>
            <td className="whitespace-nowrap px-6 py-4">{item.createdAt}</td>
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
        )
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
          <DownLoadButton applicationRef={contentRef} />
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
        {!loading && salaries?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={salaries?.length === itemsPerPage}
            />
          </div>
        )}
        {isModalOpen && selectedPayment && (
          <AllStaffPaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            payment={selectedPayment}
          />
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
