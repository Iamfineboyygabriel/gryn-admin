import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllSalary } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import AllStaffPaymentModal from "../../../../../../shared/modal/AllStaffPaymentModal";
import useUserProfile, { useCurrentUser } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface SalaryItem {
  id: number;
  invoice?: {
    user?: {
      designation?: string;
      profile?: {
        lastName?: string;
        firstName?: string;
      }
      item: {
        name: string;
        amount: number;
      }[];
    };
    document?: any[];
  };
  createdAt: string;
}

const Payment: React.FC = () => {
  const { salaries, currentPage, loading, fetchSalaries, searchTerm, updateSearchTerm } = useAllSalary();
  const [sortField, setSortField] = useState("lastName");
  const [selectedPayment, setSelectedPayment] = useState<SalaryItem | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userProfile } = useUserProfile();

  const isSuperAdmin = useMemo(() => userProfile?.user?.role === "SUPER_ADMIN", [userProfile]);

  const itemsPerPage = 10;

  const handleViewDetails = (payment: SalaryItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSalaries(currentPage, itemsPerPage, "COMPLETED");
  }, [fetchSalaries, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    fetchSalaries(page, itemsPerPage, "COMPLETED");
  }, [fetchSalaries, itemsPerPage]);

  const filteredAndSortedSalaries = useMemo(() => {
    if (!salaries || !Array.isArray(salaries)) {
      return [];
    }

    const filtered = salaries.filter((item: SalaryItem) => {
      const fullName = `${item.invoice?.user?.profile?.lastName || ""} ${item.invoice?.user?.profile?.firstName || ""}`.toLowerCase();
      return fullName.includes((searchTerm || '').toLowerCase());
    });

    return filtered.sort((a: SalaryItem, b: SalaryItem) => {
      const aValue = (a.invoice?.user?.profile?.lastName || "").toString().toLowerCase();
      const bValue = (b.invoice?.user?.profile?.lastName || "").toString().toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [salaries, searchTerm, sortOrder]);

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!searchTerm?.trim()) return text;
      const regex = new RegExp(`(${searchTerm})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [searchTerm]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredAndSortedSalaries.length > 0) {
      return filteredAndSortedSalaries.map((item: SalaryItem, index: number) => (
        <tr
          key={item.id}
          className="text-sm text-grey-primary font-medium border-b border-gray-200"
        >
          <td className="whitespace-nowrap px-6 py-4">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="whitespace-nowrap px-6 py-4"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${formatData(item.invoice?.user?.profile?.lastName)} ${formatData(item.invoice?.user?.profile?.firstName)}`
              )
            )}
          />
          <td className="whitespace-nowrap px-6 py-4">
            {formatData(item.invoice?.user?.designation)}
          </td>
          <td className="whitespace-nowrap px-6 py-4">
            {formatData(item.invoice?.document?.length)}
          </td>
          <PrivateElement feature="ALL_USERS" page="View Details">
            <td className="flex items-center whitespace-nowrap px-6 py-4">
              <button
                onClick={() => handleViewDetails(item)}
                className="cursor-pointer font-semibold text-primary-700"
              >
                View details
              </button>
            </td>
          </PrivateElement>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No recent payments.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    filteredAndSortedSalaries,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    loading,
  ]);

  return (
    <main className="mt-[1.3em] font-outfit h-auto w-full bg-white px-[1em] py-3 pb-[10em]">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-xl">All Payments</h1>
          {/**after creating invoice its not returning the id for us to contine the process so i have to comment it out */}
           {/* <div className="flex gap-2">
            {isSuperAdmin && (
              <Link to="/admin/dashboard/payments/new_payments">
                <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                  <img src={plus} alt="plus" />
                  New Payment
                </button.PrimaryButton>
              </Link>
            )}
          </div> */}
        </header>
        <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
            placeholder="Search"
            value={searchTerm || ''}
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
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Designation</th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
                Uploaded Documents
              </th>
              <PrivateElement feature="ALL_USERS" page="View Details">
                <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
              </PrivateElement>
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
    </main>
  );
};

export default Payment;