import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  useBudgetFetch,
  useCurrentUser,
} from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import {
  setSort,
  setMonth,
  setSearch,
} from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import noData from "../../../../../../../assets/svg/Transaction.svg";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import BudgetPaymentDetail from "../../../../../../../shared/modal/BudgetPaymentDetail";
import Modal from "../../../../../../../shared/modal/Modal";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import BudgetPaymentReceiptResponse from "../../../../../../../shared/modal/BudgetPaymentReceiptResponse";

const ITEMS_PER_PAGE = 10;

const Budgets: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { userDetails } = useCurrentUser();
  const isSuperAdmin = useMemo(
    () => userDetails?.data?.role === "SUPER_ADMIN",
    [userDetails]
  );

  const { budgets, loading } = useBudgetFetch(currentPage, ITEMS_PER_PAGE);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      if (newPage >= 1) {
        setCurrentPage(newPage);
      }
    },
    []
  );

  const handleCloseApproveModal = () => {
    setSelectedBudgetId(null);
    setApproveModalOpen(false);
  };

  const handleOpenModal = (budgetId: string, status: string) => {
    setSelectedBudgetId(budgetId);
    if (status === "COMPLETED" && isSuperAdmin) {
      setReceiptModalOpen(true);
    } else {
      setApproveModalOpen(true);
    }
  };

  const handleApproved = () => {
    if (isSuperAdmin) {
      setApproveModalOpen(false);
      setReceiptModalOpen(true);
    } else {
      handleCloseApproveModal();
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    dispatch(setSearch(value));
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setCurrentPage(1);
    dispatch(setSort(newOrder));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMonth(value);
    setCurrentPage(1);
    dispatch(setMonth(value));
  };

  const handleCloseReceiptModal = () => {
    setSelectedBudgetId(null);
    setReceiptModalOpen(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-pink-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "PAID":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved";
      case "PENDING":
        return "In Progress";
      case "PAID":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

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

  const totalItems = budgets?.total || 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Reports</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Budget /
            <span className="ml-1 font-medium text-primary-700">
              All Budgets
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>
        <section className="mt-[1em]">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-wrap items-center gap-3 md:gap-[1em]">
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  className="w-full min-w-[200px] rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
              </div>

              <button
                type="button"
                onClick={toggleSortOrder}
                className="flex items-center bg-gray-100 px-3 md:px-5 py-2 md:py-3 rounded hover:bg-gray-200 transition-colors"
              >
                <p className="whitespace-nowrap text-gray-500 text-sm font-medium">
                  Sort Order
                  <span className="ml-2">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                </p>
              </button>

              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="bg-gray-100 px-3 md:px-5 py-2 md:py-3 rounded text-gray-500 text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month.toLowerCase()}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/admin/dashboard/reports/new_budgets"
              className="md:self-start"
            >
              <button className="flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-800">
                <img src={plus} alt="plus" />
                New Budget
              </button>
            </Link>
          </div>
        </section>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-gray-500 border-gray-200 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Location
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : budgets?.data?.length > 0 ? (
                budgets.data.map((budget: any, index: number) => (
                  <tr
                    key={budget.id}
                    className="text-sm text-grey-primary font-medium"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {budget.BudgetItem?.length > 0
                        ? `NGN ${formatAmount(
                            calculateTotalAmount(budget?.BudgetItem)
                          )}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {budget.location || "-"}
                    </td>
                    {/* <td className="px-3 py-2 text-sm">-</td> */}
                    <td className="px-3 py-2 text-sm">
                      {budget.updatedAt
                        ? new Date(budget.updatedAt)
                            .toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                            .replace(",", "")
                            .toLowerCase()
                        : "-"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        className={`mr-2 rounded-full px-3 py-2 ${getStatusStyle(
                          budget.status
                        )}`}
                      >
                        {getStatusText(budget.status)}
                      </button>
                    </td>
                    <td className="flex items-center whitespace-nowrap px-6 py-4">
                      <p
                        onClick={() =>
                          handleOpenModal(budget.id, budget.status)
                        }
                        className="cursor-pointer font-semibold text-primary-700"
                      >
                        View details
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center mt-8">
                      <img src={noData} alt="No budgets" className="mb-4" />
                      <p>No budget available.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={budgets?.data?.length === ITEMS_PER_PAGE}
            />
          </div>
        )}
      </header>

      {isApproveModalOpen && selectedBudgetId && (
        <BudgetPaymentDetail
          budgetId={selectedBudgetId}
          onClose={handleCloseApproveModal}
          budgets={budgets}
          onApproved={handleApproved}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {isReceiptModalOpen && selectedBudgetId && isSuperAdmin && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={handleCloseReceiptModal}
          data-aos="zoom-in"
        >
          <BudgetPaymentReceiptResponse budgetId={selectedBudgetId} />
        </Modal>
      )}
    </main>
  );
};

export default Budgets;
