import React, { useCallback, useEffect, useState } from "react";
import plus from "../../../../../../assets/svg/plus.svg";
import { Link, useNavigate } from "react-router-dom";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DocumentPreviewModal from "../../../../../../shared/modal/DocumentPreviewModal";
import { useAllVisa } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { FiSearch } from "react-icons/fi";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import eye from "../../../../../../assets/svg/eyeImg.svg";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";
import DOMPurify from 'dompurify';

interface VisaData {
  lastName: string;
  firstName: string;
  schoolName: string;
  id: string;
  agent: {
    profile: {
      lastName: string;
      firstName: string;
    };
  };
  destination: string;
  issuedDate: string;
  document: Array<{
    documentType: string;
    publicURL: string;
  }>;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 10 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Visa: React.FC = () => {
  const { 
    visa, 
    loading, 
    currentPage, 
    fetchApplications, 
    searchTerm,
    updateSearchTerm,
  } = useAllVisa();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const navigate = useNavigate();

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback((text: string) => {
    if (!searchTerm?.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text?.replace(
      regex,
      (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
    );
  }, [searchTerm]);

  const renderHighlightedText = useCallback((text: string) => {
    if (!text) return '-';
    const highlightedText = highlightText(text);
    return <span dangerouslySetInnerHTML={sanitizeHTML(highlightedText)} />;
  }, [highlightText, sanitizeHTML]);

  useEffect(() => {
    fetchApplications(1, itemsPerPage);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(1, itemsPerPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchTerm(e.target.value);
  };

  const getFileTypeFromUrl = (url: string) => {
    const segments = url.split("/");
    const fileExtension = segments.pop()?.split(".").pop();
    switch (fileExtension) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "application/octet-stream";
    }
  };

  const handlePreview = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    if (fileType === "application/pdf") {
      url += "&viewer=pdf";
    }
    setPreviewUrl(url);
    setPreviewFileType(fileType);
    setIsPreviewOpen(true);
  };
   
  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    fetchApplications(page, itemsPerPage);
  }, [fetchApplications, itemsPerPage]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchApplications(1, newItemsPerPage);
  }, [fetchApplications]);

  const handleViewDetails = useCallback(
    (applicationId: string) => {
      navigate(`/admin/dashboard/visa/view_visa_application/${applicationId}`);
    },
    [navigate]
  );

  const renderPaymentStatus = (documents: Array<{documentType: string; publicURL: string}>, type: string) => {
    const document = documents.find(doc => doc.documentType === type);
    if (document) {
      return (
        <div className="flex items-center">
          <span className="mr-3">Paid</span>
           <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[4px] text-center font-medium text-[#660066] dark:bg-gray-600 dark:text-white"
            onClick={() => handlePreview(document.publicURL)}
          >
            <img src={eye} alt="eye" />
            <span className="mr-6">View</span>
          </button>
        </div>
      );
    }
    return "-";
  };

  return (
    <main className="mt-4 font-outfit">
      <h1 className="text-2xl font-bold">Visa Application</h1>
      <div className="mt-4 h-auto w-full rounded-lg bg-white p-3 pb-[10em] dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Items per page:</span>
              <select
                className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <PrivateElement feature="APPLICATION" page="CreateVisa">
              <Link to="/admin/dashboard/visa/new_application">
                <button className="flex gap-2 rounded-full bg-linear-gradient px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                  <img src={plus} alt="cross" />
                  New Application
                </button>
              </Link>
            </PrivateElement>
          </div>
        </div>

        <section className="overflow-auto py-6">
          <table className="w-full border-collapse mt-4">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  School Name
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Destination
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Service Charge
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  IHS Payment
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Visa Fee Payment
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array?.from({ length: itemsPerPage })?.map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : visa && visa?.length > 0 ? (
                visa.map((item: VisaData, index: number) => (
                  <tr
                    key={index}
                    className="text-sm font-medium text-grey-primary font-outfit"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="whitespace-nowrap gap-2 px-6 py-4">
                      {renderHighlightedText(`${item?.lastName} ${item?.firstName}`)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderHighlightedText(item?.schoolName || "-")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderHighlightedText(`${item?.agent?.profile?.lastName} ${item?.agent?.profile?.firstName}`)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderHighlightedText(item.destination || "-")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "SERVICE_CHARGE")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "IHS")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "VISA_FEE")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderHighlightedText(item?.issuedDate || "-")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="font-medium text-primary-700 dark:text-gray-500"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={10}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={transaction}
                        alt="No applications"
                        className="mb-4"
                      />
                      No visa application.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {!loading && visa && visa.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={visa.length === itemsPerPage}
            />
          </div>
        )}
      </div>

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default Visa;