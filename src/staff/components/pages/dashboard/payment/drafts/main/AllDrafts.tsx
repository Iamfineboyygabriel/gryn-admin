import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useAllDraftItems } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import eyeImg from "../../../../../../../assets/svg/eyeImg.svg";
import DOMPurify from "dompurify";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { formatDateTime } from "../../../../../../../shared/utils/dateFormat";
import { useNavigate } from "react-router";


interface DraftItem {
  id: number;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
  invoiceId: number | null;
  budgetId: number | null;
  isDraft: boolean;
  createdAt: string;
}

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllDrafts: React.FC = () => {
  const { draftItems, fetchDraftItems, loading, currentPage } = useAllDraftItems();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const itemsPerPage = 8;

  const draftData = useMemo(() => {
    return draftItems || [];
  }, [draftItems]);

  useEffect(() => {
    fetchDraftItems(currentPage, itemsPerPage);
  }, [fetchDraftItems, currentPage, itemsPerPage]);

  const handleViewDraft = (draft: DraftItem) => {
    const groupedItems = draftData
      .filter((item : any)=> item.id === draft.id)
      .map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        discount: item.discount
      }));

    const formattedDraft = {
      status: "SUBMITTED",
      invoiceNumber: draft.id.toString(),
      invoiceDate: new Date(draft.createdAt),
      dueDate: new Date(), 
      items: groupedItems,
    };

    navigate(`/staff/dashboard/payments/use_draft_information`, {
      state: { draftData: formattedDraft }
    });
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part: string, index: number) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {DOMPurify.sanitize(part)}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredDrafts = useMemo(() => {
    return draftData.filter((item: DraftItem) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [draftData, searchQuery]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchDraftItems(page, itemsPerPage);
    },
    [fetchDraftItems, itemsPerPage]
  );

  if (loading) {
    return (
      <div className="w-full">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </div>
    );
  }

  return (
    <main className="font-outfit">
      <header className="flex justify-between">
        <h1 className="font-semibold text-xl">Drafts</h1>
      </header>
      
      <div className="flex mt-[1em] items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
        <input
          type="text"
          className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
          placeholder="Search by Product Name"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FiSearch className="mr-3 text-lg text-gray-500" />
      </div>

      <section className="mt-4">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft: DraftItem) => (
            <div
              key={draft.id}
              className="flex mt-[1em] justify-between items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-lg">
                  {highlightText(draft.name, searchQuery)}
                </h1>
                <small className="text-gray-600">{formatDateTime(draft.createdAt)}</small>
              </div>
              <div className="flex gap-[2em] items-center">
                <button
                  onClick={() => handleViewDraft(draft)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={eyeImg} alt="View" className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No drafts" className="w-32 h-32 opacity-50" />
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              No recent drafts.
            </p>
          </div>
        )}
      </section>

      {!loading && draftItems?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={draftItems.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default AllDrafts;