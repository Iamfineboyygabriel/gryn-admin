import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useAllDraftItems } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import eyeImg from "../../../../../../../assets/svg/eyeImg.svg";
import online from "../../../../../../../assets/svg/online.svg";
import DOMPurify from "dompurify";
import { usePagination } from "../../../../../../../shared/utils/paginationUtils";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import CustomPagination from "../../../../../../../shared/utils/customPagination";

const AllDrafts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { useAllItems } = useAllDraftItems();

  const drafts = useAllItems?.data || [];

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

  const filteredDrafts = drafts.filter((item: any) =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 3;
  const { currentPage, totalPages, visibleData, handlePageChange } =
    usePagination(filteredDrafts, itemsPerPage);

  return (
    <main>
      <header className="flex justify-between">
        <h1 className="font-semibold text-xl">Drafts</h1>
      </header>
      <div className="flex mt-[1em] items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
        <input
          type="text"
          className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FiSearch className="mr-3 text-lg text-gray-500" />
      </div>
      <section>
        {visibleData.length > 0 ? (
          visibleData.map((draft: any) => (
            <div
              key={draft.id}
              className="flex mt-[1em] justify-between items-center"
            >
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-lg">
                  {highlightText(draft.productName, searchQuery)}
                </h1>
                <small>{new Date(draft.createdAt).toLocaleString()}</small>
              </div>
              <div className="flex gap-[2em] items-center">
                <img src={eyeImg} alt="View" />
                <img src={online} alt="Online" />
              </div>
            </div>
          ))
        ) : (
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No drafts" />
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              No recent drafts.
            </p>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="mt-4 flex w-[60%] items-center justify-between">
          <small>
            Showing {visibleData.length} of {filteredDrafts.length} results
          </small>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
};

export default AllDrafts;
