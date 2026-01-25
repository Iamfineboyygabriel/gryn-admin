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
import noData from "../../../../../../../assets/svg/Transaction.svg";
import approved from "../../../../../../../assets/svg/Approved.svg";
import rejected from "../../../../../../../assets/svg/Rejected.svg";
import pending from "../../../../../../../assets/svg/Pending.svg";
import { PrivateElement } from "../../../../../../../shared/redux/hooks/admin/PrivateElement";

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
      remark: string;
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
  const {
    allApplicationPayment,
    loading,
    currentPage,
    fetchApplicationPayments,
  } = useAllApplicationPayment();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplicationPayments(currentPage, itemsPerPage);
  }, [fetchApplicationPayments, currentPage, itemsPerPage]);

  const handleFindByAllOpen = () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchApplicationPayments(page, itemsPerPage);
    },
    [fetchApplicationPayments, itemsPerPage]
  );

  const getFileTypeFromUrl = (url: string) => {
    const fileExtension = url?.split(".")?.pop()?.toLowerCase();
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

  const getStatusClassAndIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { class: "text-green-500", icon: approved };
      case "REJECTED":
        return { class: "text-red-500", icon: rejected };
      case "PENDING":
        return { class: "text-yellow-500", icon: pending };
      default:
        return { class: "text-gray-500", icon: undefined };
    }
  };

  const renderPaymentStatus = (
    documents: Array<{
      documentType: string;
      publicURL: string;
      remark: string;
    }>,
    type: string
  ) => {
    const document = documents?.find((doc) => doc?.documentType === type);

    if (!document?.remark || !document?.publicURL) {
      return <span>-</span>;
    }

    const { class: statusClass, icon } = getStatusClassAndIcon(document.remark);

    return (
      <div className={`flex flex-col items-start text-xs ${statusClass}`}>
        <div className="flex items-center gap-2 text-black">
          <p>Paid</p>
          <button
            onClick={() => {
              setPreviewUrl(document.publicURL);
              setPreviewFileType(getFileTypeFromUrl(document.publicURL));
              setIsPreviewOpen(true);
            }}
            className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[4px] text-center font-medium text-[#660066] dark:bg-gray-600 dark:text-white"
          >
            <img src={eye} alt="eye" />
            <span className="mr-3">View</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt="Status Icon" />}
          <p>{document.remark}</p>
        </div>
      </div>
    );
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text?.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleViewPaymentDetails = (item: PaymentData) => {
    navigate("/staff/dashboard/payments/update_payment", {
      state: {
        selectedUniversity: item?.degree?.university,
        selectedDegree: item?.degree?.degreeType,
        applicationId: item?.id,
        paymentId: item?.id,
        document: item.payment?.documents,
      },
    });
  };

  return (
    <main>
      <header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">All Payments</h1>
          <PrivateElement feature="PAYMENTS" page="New Payments">
            <button.PrimaryButton
              onClick={handleFindByAllOpen}
              className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
            >
              <img src={plus} alt="cross" />
              Upload Payments
            </button.PrimaryButton>
          </PrivateElement>
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
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  University
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Degree
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Course
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Country
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Service Charge
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Application Charge
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Tuition Fee
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 })?.map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : allApplicationPayment && allApplicationPayment?.length > 0 ? (
                allApplicationPayment?.map(
                  (item: PaymentData, index: number) => (
                    <tr
                      key={index}
                      className="text-sm font-medium text-grey-primary font-outfit"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(item?.degree?.university, searchQuery)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(item?.degree?.degreeType, searchQuery)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(item?.degree?.course, searchQuery)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(item?.degree?.country, searchQuery)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {renderPaymentStatus(
                          item?.payment?.documents,
                          "SERVICE_CHARGE"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {renderPaymentStatus(
                          item?.payment?.documents,
                          "APPLICATION_FEE"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {renderPaymentStatus(
                          item?.payment?.documents,
                          "TUTION_FEE"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handleViewPaymentDetails(item)}
                          className="font-medium text-primary-700 dark:text-gray-500"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={9}
                  >
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
        {!loading &&
          allApplicationPayment &&
          allApplicationPayment?.length > 0 && (
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
          <FindStudentByAll redirectTo="/staff/dashboard/payments/new_payment" />
        </Modal>
      )}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={() => setIsPreviewOpen(false)}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default AllPayment;
