import { Link } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import { FiSearch } from "react-icons/fi";
import { useAllInvoices } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { usePagination } from "../../../../../../../shared/utils/paginationUtils";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import transaction from "../../../../../../../assets/svg/Transaction.svg";

const AllInvoices = () => {
  const { useAllInvoice } = useAllInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (useAllInvoice && useAllInvoice.data) {
      const flattenedItems = useAllInvoice.data.flatMap((invoice: any) =>
        invoice.item.map((item: any) => ({
          ...item,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
        }))
      );
      setItems(flattenedItems);
    }
  }, [useAllInvoice]);

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {DOMPurify.sanitize(part)}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredItems = items.filter(
    (item: any) =>
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
  const { currentPage, totalPages, visibleData, handlePageChange } =
    usePagination(filteredItems, itemsPerPage);

  const formatData = (data: any) => (data ? data : "-");

  return (
    <main className="font-outfit">
      <header>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[1.5em]">
            <h1 className="font-semibold text-lg">All Invoices</h1>
            <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
              <input
                type="text"
                className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
                placeholder="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="mr-3 text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/staff/dashboard/payments/generate_invoice">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="plus" />
              Generate Invoice
            </button.PrimaryButton>
          </Link>
        </div>
      </header>
      <table className="w-full border-collapse">
        <thead className="border-b border-gray-200 text-gray-500 dark:text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Invoice No
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Product Name
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Quantity
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Rate
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
          {visibleData.length > 0 ? (
            visibleData.map((item: any, index: number) => (
              <tr
                key={item.id}
                className="text-sm text-gray-700 dark:text-white"
              >
                <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {highlightText(formatData(item.invoiceNumber), searchQuery)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {highlightText(formatData(item.productName), searchQuery)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(item.quantity)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(item.rate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(item.amount)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(new Date(item.invoiceDate).toLocaleDateString())}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(new Date(item.dueDate).toLocaleDateString())}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatData(item.status)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                <div className="mt-[2em] flex flex-col items-center justify-center">
                  <img src={transaction} alt="No invoices" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-white">
                    No recent invoices.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4 flex w-[60%] items-center justify-between">
          <small>
            Showing {visibleData.length} of {filteredItems.length} results
          </small>
          {/* <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          /> */}
        </div>
      )}
    </main>
  );
};

export default AllInvoices;
