import React, { useCallback, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import plus from "../../../../../../assets/svg/plus.svg";
import DOMPurify from "dompurify";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import eyeImg from "../../../../../../assets/svg/eyeImg.svg";
import { useAllDraftedNews } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../shared/utils/customPagination";

const SkeletonRow = () => (
  <div className="animate-pulse flex justify-between px-[2em] items-center mb-2">
    <div className="flex flex-col py-2 gap-[4px]">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
  </div>
);

const Drafts = () => {
  const {
    allUserDraftedNews,
    fetchNews,
    currentPage,
    loading,
    searchTerm,
    updateSearchTerm,
  } = useAllDraftedNews();
  const navigate = useNavigate();

  const itemsPerPage = 10;
  useEffect(() => {
    fetchNews(currentPage, itemsPerPage);
  }, [fetchNews, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchNews(page, itemsPerPage);
    },
    [fetchNews, itemsPerPage]
  );

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

  const handleEditDraft = (news: any) => {
    let formattedTime = "";
    let formattedDate = "";

    if (news.date) {
      const dateObj = new Date(news.date);
      formattedDate = dateObj.toISOString().split("T")[0];

      // Format time to local time string
      const hours = dateObj.getHours().toString().padStart(2, "0");
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      formattedTime = `${hours}:${minutes}`;
    }

    const formattedDraft = {
      topic: news.topic || "",
      description: news.description || "",
      sendTo:
        news.sendTo && news.sendTo.length > 0
          ? { name: news.sendTo[0].toUpperCase() }
          : null,
      date: formattedDate,
      time: formattedTime,
      link: news.link || "",
    };

    navigate("/admin/dashboard/news/create_news", {
      state: { draftData: formattedDraft },
    });
  };

  return (
    <main className="font-outfit">
      <div className="flex justify-between px-[2em] mb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search"
              value={searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
        </div>
        <Link to="/admin/dashboard/news/create_news">
          <button className="flex gap-2 rounded-full bg-primary-700 px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="cross" />
            Create News Alert
          </button>
        </Link>
      </div>

      {loading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : allUserDraftedNews?.data?.length > 0 ? (
        allUserDraftedNews?.data?.map((news: any, index: number) => (
          <div
            key={news?.id}
            className={`flex justify-between px-[2em] items-center mb-2 ${
              index % 2 !== 0 ? "bg-[#F7F7F7]" : ""
            }`}
          >
            <div className="flex flex-col py-2 gap-[4px]">
              <h1
                className="font-medium text-lg"
                dangerouslySetInnerHTML={sanitizeHTML(
                  highlightText(news?.topic)
                )}
              />
              <small className="text-gray-500 font-normal">
                {new Date(news?.createdAt)
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toUpperCase()}{" "}
                {new Date(news?.createdAt).toLocaleDateString()}
              </small>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() => handleEditDraft(news)}
                className="cursor-pointer"
              >
                <img src={eyeImg} alt="edit_draft" />
              </div>
              {/* <div>
                <img src={deleteImg} alt="delete_draft" />
              </div> */}
            </div>
          </div>
        ))
      ) : (
        <div className="mt-[2em] flex flex-col items-center justify-center">
          <img src={transaction} alt="No applications" />
          <p className="mt-2 text-sm text-gray-500 dark:text-white">
            No news available.
          </p>
        </div>
      )}

      {!loading && allUserDraftedNews?.data?.length > 0 && (
        <div className="mt-4 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={allUserDraftedNews?.data?.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default Drafts;
