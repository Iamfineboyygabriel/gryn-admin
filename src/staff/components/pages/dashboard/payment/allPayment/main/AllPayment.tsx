import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DocumentPreviewModal from "../../../../../../../shared/modal/DocumentPreviewModal";
import FindStudentByAll from "../../../../../../../admin/components/pages/dashboard/application/modal/FindStudentByAll";
import { useAllApplicationPayment } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import plus from "../../../../../../../assets/svg/plus.svg";
import eye from "../../../../../../../assets/svg/eyeImg.svg";
import noData from "../../../../../../../assets/svg/Transaction.svg"

interface PaymentData {
  id: string;
  firstName: string;
  lastName: string;
  degree: {
    university: string;
    degreeType: string;
    course: string;
    country: string;
  };
  payment: {
    documents: Array<{
      documentType: string;
      publicURL: string;
    }>;
  };
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllPayment: React.FC = () => {
  const [isFindByModalOpen, setIsFindByModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { allApplicationPayment, loading, totalPages, currentPage, fetchApplicationPayments } = useAllApplicationPayment();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplicationPayments(currentPage, itemsPerPage);
  }, [fetchApplicationPayments, currentPage, itemsPerPage]);

  const handleFindByAllOpen = () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    fetchApplicationPayments(page, itemsPerPage);
  }, [fetchApplicationPayments, itemsPerPage]);

  const getFileTypeFromUrl = (url: string) => {
    const fileExtension = url?.split(".")?.pop()?.toLowerCase();
    switch (fileExtension) {
      case "pdf": return "application/pdf";
      case "jpg":
      case "jpeg": return "image/jpeg";
      case "png": return "image/png";
      case "gif": return "image/gif";
      default: return "application/octet-stream";
    }
  };

  const handlePreview = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    setPreviewUrl(url);
    setPreviewFileType(fileType);
    setIsPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  const renderPaymentStatus = (documents: Array<{documentType: string; publicURL: string}>, type: string) => {
    const document = documents?.find(doc => doc?.documentType === type);
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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text?.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : part
    );
  };

  return (
    <main>
      <header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">All Payments</h1>
          <button.PrimaryButton
            onClick={handleFindByAllOpen}
            className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
          >
            <img src={plus} alt="cross" />
            Upload Payments
          </button.PrimaryButton>
        </div>
      </header>
      <div className="mt-4 h-auto w-full rounded-lg bg-white p-3 pb-[10em] dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
        </div>

        <section className="overflow-auto py-6">
          <table className="w-full border-collapse mt-4">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">University</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">Degree</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">Course</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">Country</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">Service Charge</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">Application Charge</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">Tuition Fee</th>
                <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 })?.map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : allApplicationPayment && allApplicationPayment?.length > 0 ? (
                allApplicationPayment?.map((item: PaymentData, index: number) => (
                  <tr key={index} className="text-sm font-medium text-grey-primary font-outfit">
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                    <td className="whitespace-nowrap px-6 py-4">{highlightText(item?.degree?.university, searchQuery)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{highlightText(item?.degree?.degreeType, searchQuery)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{highlightText(item?.degree?.course, searchQuery)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{highlightText(item?.degree?.country, searchQuery)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{renderPaymentStatus(item?.payment?.documents, "SERVICE_CHARGE")}</td>
                    <td className="whitespace-nowrap px-6 py-4">{renderPaymentStatus(item?.payment?.documents, "APPLICATION_FEE")}</td>
                    <td className="whitespace-nowrap px-6 py-4">{renderPaymentStatus(item?.payment?.documents, "TUTION_FEE")}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => navigate(`/staff/dashboard/payments/view_payment/${item.id}`)}
                        className="font-medium text-primary-700 dark:text-gray-500"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={9}>
                    <div className="flex flex-col items-center justify-center">
                      <img src={noData} alt="noData" />
                      No Payment Records Found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {!loading && allApplicationPayment && allApplicationPayment?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={allApplicationPayment?.length === itemsPerPage}
            />
          </div>
        )}
      </div>
      {isFindByModalOpen && (
        <Modal
          isOpen={isFindByModalOpen}
          onClose={handleFindByAllClose}
          data-aos="zoom-in"
        >
          <FindStudentByAll redirectTo="/staff/dashboard/payments/new_payment"/>
        </Modal>
      )}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default AllPayment;