import { Link } from "react-router-dom";
import { useBudgetFetch } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useAllSalary } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { MdKeyboardArrowRight } from "react-icons/md";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useCallback, useEffect, useMemo } from "react";

interface SalaryItem {
  id: number;
  receiptNo: string;
  status: string;
  invoice?: {
    id: number;
    status: string;
    invoiceDate: string;
    invoiceNumber: string;
    userId: string;
    createdAt: string;
    item?: {
      id: number;
      amount: number;
    }[];
  };
}

interface Budget {
  id: number;
  location: string;
  status: string;
  BudgetItem?: {
    amount: number;
  }[];
}

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 4 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
      <div className="mt-[2em] flex flex-col items-center justify-center">
        <img src={transaction} alt="No Data Available" />
        <p className="mt-2 text-sm text-gray-500 dark:text-white">
          No recent payments.
        </p>
      </div>
    </td>
  </tr>
);

const Transaction = () => {
  const { budgets } = useBudgetFetch();
  const { salaries, currentPage, fetchSalaries, loading } = useAllSalary();
  const itemsPerPage = 10;
  const STATUS_COMPLETED = "COMPLETED";

  const calculateTotalAmount = (budgetItems: any[]) => {
    return (
      budgetItems?.reduce(
        (sum: number, item: any) => sum + (item?.amount || 0),
        0
      ) || 0
    );
  };

  const formatAmount = (amount: number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fetchSalaries(currentPage, itemsPerPage, STATUS_COMPLETED);
  }, [fetchSalaries, currentPage]);

  const filteredAndSortedSalaries = useMemo(() => {
    if (!salaries || !Array?.isArray(salaries)) return [];
    return salaries?.filter(
      (item: SalaryItem) => item.invoice?.status === STATUS_COMPLETED
    );
  }, [salaries]);

  const formatData = useCallback((data: any) => data || "-", []);

  const getStatusColor = (status: string): string => {
    const statusColors = {
      PAID: "bg-green-500",
      PENDING: "bg-yellow-500",
      APPROVED: "bg-pink-500 text-white",
      MONEY_OUT: "bg-red-500",
      MONEY_IN: "bg-green-500",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  const renderTransactionTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (!filteredAndSortedSalaries.length) {
      return <EmptyState />;
    }

    return filteredAndSortedSalaries.map((item: SalaryItem, index: number) => (
      <tr
        key={item.id}
        className="text-sm text-grey-primary font-medium border-b border-gray-200"
      >
        <td className="whitespace-nowrap px-3 py-2">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="whitespace-nowrap px-3 py-2">{item?.receiptNo}</td>
        <td className="whitespace-nowrap px-3 py-2">
          {formatData(
            item?.invoice?.item?.[0]?.amount
              ? formatAmount(item?.invoice.item[0].amount)
              : "-"
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2">
          <button
            className={`mr-2 rounded-full px-3 text-sm py-1 text-white ${getStatusColor(
              item?.status
            )}`}
          >
            {item?.status}
          </button>
        </td>
      </tr>
    ));
  }, [
    filteredAndSortedSalaries,
    currentPage,
    itemsPerPage,
    formatData,
    loading,
  ]);

  const renderBudgetTable = () => (
    <table className="w-full mt-4 border-collapse">
      <thead className="text-gray-500 border-b border-gray-200">
        <tr>
          <th className="px-3 py-2 text-left text-sm font-normal">S/N</th>
          <th className="px-3 py-2 text-left text-sm font-normal">Amount</th>
          <th className="px-3 py-2 text-left text-sm font-normal">Location</th>
          <th className="px-3 py-2 text-left text-sm font-normal">Status</th>
        </tr>
      </thead>
      <tbody>
        {budgets?.data?.length ? (
          budgets?.data?.map((budget: Budget, index: number) => (
            <tr className="border-b border-gray-200" key={budget?.id}>
              <td className="px-3 py-2 text-sm">{index + 1}</td>
              <td className="px-3 py-2 text-sm">
                {budget?.BudgetItem?.length
                  ? `${formatAmount(calculateTotalAmount(budget?.BudgetItem))}`
                  : "-"}
              </td>
              <td className="px-3 py-2 text-sm">{budget?.location || "-"}</td>
              <td className="px-3 py-2">
                <span
                  className={`rounded-full px-3 py-1 text-white text-sm ${getStatusColor(
                    budget?.status
                  )}`}
                >
                  {budget?.status || "-"}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <EmptyState />
        )}
      </tbody>
    </table>
  );

  return (
    <main className="font-outfit">
      <div className="flex flex-col md:flex-row h-auto md:h-[300px] justify-between gap-[1em]">
        <div className="h-auto md:h-[300px] w-full rounded-lg bg-white px-[2.5em] py-[1.3em] overflow-y-auto">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Transactions
              </h1>
              <Link to="/admin/dashboard/reports/all_transaction">
                <p className="font-medium text-primary-700 cursor-pointer">
                  See All
                </p>
              </Link>
            </div>
          </header>
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white">
              <tr className="text-gray-700 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Receipt No.
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {renderTransactionTableBody()}
            </tbody>
          </table>
        </div>

        <div className="h-auto md:h-[300px] w-full rounded-lg bg-white px-[2.5em] py-[1.3em] overflow-y-auto">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">Budgets</h1>
              <Link to="/admin/dashboard/reports/budgets">
                <p className="font-medium flex items-center text-primary-700">
                  See All
                  <MdKeyboardArrowRight />
                </p>
              </Link>
            </div>
          </header>
          {renderBudgetTable()}
        </div>
      </div>
    </main>
  );
};

export default Transaction;
