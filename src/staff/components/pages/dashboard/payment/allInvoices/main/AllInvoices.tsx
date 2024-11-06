import { useEffect, useState, useMemo, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useAllInvoice } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllInvoices = () => {
  const { useInvoice, fetchInvoice, loading, currentPage } = useAllInvoice();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const invoiceData = useMemo(() => useInvoice || [], [useInvoice]);

  useEffect(() => {
    fetchInvoice(page, itemsPerPage);
  }, [fetchInvoice, page, itemsPerPage]);

  const escapeRegExp = (string:any) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text:any, query:any) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts?.map((part:any, index:number) =>
      part?.toLowerCase() === query?.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {DOMPurify.sanitize(part)}
        </span>
      ) : (
        part
      )
    );
  };

  const formatAmount = (amount:number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateInvoiceTotal = (items:any[]) => {
    return items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  };

  const filteredInvoice = useMemo(
    () =>
      (invoiceData || [])?.filter(
        (invoice:any) =>
          (invoice?.invoiceNumber || "")
            .toLowerCase()
            .includes(searchQuery?.toLowerCase()) ||
          invoice?.item?.some((item:any) =>
            (item?.name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
      ),
    [invoiceData, searchQuery]
  );

  const visibleData = filteredInvoice;

  const handlePageChange = (event:any, value:any) => {
    setPage(value);
  };

  const formatData = (data:any) => (data != null ? data : "-");

  const startIndex = (page - 1) * itemsPerPage;

  const getSerialNumber = (invoiceIndex:any, itemIndex:any, totalPreviousItems:any) => {
    return startIndex + totalPreviousItems + itemIndex + 1;
  };

  const handleViewDetails = useCallback(
    (invoice:any) => {
      navigate("/staff/dashboard/payments/view_invoice", {
        state: { invoiceData: invoice }
      });
    },
    [navigate]
  );
  
  return (
    <main className="font-outfit">
      <div className="relative">
        <header>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-[1.5em]">
              <h1 className="font-semibold text-lg">All Invoices</h1>
              <div className="flex items-center w-68 rounded-full border-[1px] border-border bg-gray-100">
                <input
                  type="text"
                  className="flex-grow rounded-full bg-transparent py-2 pl-5 pr-2 text-sm focus:border-grey-primary focus:outline-none"
                  placeholder="Search by Product Name"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="mr-3 text-lg text-gray-500" />
              </div>
            </div>
            <Link to="/staff/dashboard/payments/generate_invoice">
              <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={plus} alt="cross" />
                Generate Invoice
              </button.PrimaryButton>
            </Link>
          </div>
        </header>
        <section className="overflow-auto py-6">
          <table className="w-full mt-4 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Invoice No
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Invoice Date
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Due Date
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array?.from({ length: itemsPerPage })?.map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : visibleData?.length > 0 ? (
                visibleData?.map((invoice:any, invoiceIndex:any) => {
                  const previousItemsCount = visibleData
                    .slice(0, invoiceIndex)
                    .reduce((acc:any, inv:any) => acc + inv?.item?.length, 0);

                  const totalInvoiceAmount = calculateInvoiceTotal(invoice?.item);

                  return invoice?.item?.map((item:any, itemIndex:any) => (
                    <tr
                      key={`${invoice?.id}-${itemIndex}`}
                      className="text-[14px] leading-[20px] text-grey-primary font-medium"
                    >
                      <td className="py-[16px] px-[24px]">
                        {getSerialNumber(invoiceIndex, itemIndex, previousItemsCount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(
                          formatData(invoice?.invoiceNumber),
                          searchQuery
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        NGN {formatAmount(totalInvoiceAmount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatData(
                          new Date(invoice?.invoiceDate).toLocaleDateString()
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatData(
                          new Date(invoice?.dueDate).toLocaleDateString()
                        )}
                      </td>
                      <td className="flex items-center whitespace-nowrap px-6 py-4">
                        <button
                          className={`mr-2 rounded-full px-3 py-2 text-white ${
                            invoice?.status === "SUBMITTED"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {formatData(invoice?.status) === "SUBMITTED"
                            ? "In Progress"
                            : "Completed"}
                        </button>
                        <p 
                          className="cursor-pointer font-semibold text-primary-700"
                          onClick={() => handleViewDetails(invoice)}
                        >
                          View details
                        </p>
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    <div className="mt-[2em] flex flex-col items-center justify-center">
                      <img src={transaction} alt="No invoices" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-white">
                        No invoices found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {!loading && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={visibleData?.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default AllInvoices;