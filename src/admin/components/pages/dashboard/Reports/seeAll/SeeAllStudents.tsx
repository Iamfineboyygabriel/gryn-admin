import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useNavigate } from "react-router-dom";
import { button } from "../../../../../../shared/buttons/Button";
import DOMPurify from "dompurify";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllStudents } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

interface Student {
  profile: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  id: string;
  email: string;
  phoneNumber: string;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const SeeAllStudents: React.FC = () => {
  const {
    useAllStudent,
    currentPage,
    loading,
    fetchApplications,
    searchTerm,
    updateSearchTerm,
  } = useAllStudents();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [isDownloading, setIsDownloading] = useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [originalPage, setOriginalPage] = useState(1);
  const [originalItemsPerPage, setOriginalItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const itemsPerPage = 10;
  const contentRef = useRef(null);

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  const studentsData = useMemo(() => {
    const data = useAllStudent || [];
    return Array?.isArray(data) ? data : [];
  }, [useAllStudent]);

  const filteredStudents = useMemo(() => {
    return studentsData?.filter((student: Student) =>
      `${student?.profile?.firstName} ${student?.profile?.lastName} ${student?.email}`
        .toLowerCase()
        .includes(localSearchTerm.toLowerCase()),
    );
  }, [studentsData, localSearchTerm]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchApplications(page, itemsPerPage);
    },
    [fetchApplications, itemsPerPage],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
    updateSearchTerm(e.target.value);
  };

  const formatData = useCallback(
    (data: string | undefined): string => (data ? data : "-"),
    [],
  );

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!localSearchTerm.trim()) return text;
      const regex = new RegExp(`(${localSearchTerm})`, "gi");
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`,
      );
    },
    [localSearchTerm],
  );

  const handleViewDetails = useCallback(
    (studentId: string, firstName: string, lastName: string) => {
      navigate(`/admin/dashboard/all_users/student_applications`, {
        state: { firstName, lastName, studentId },
      });
    },
    [navigate],
  );

  const performDownload = useCallback(() => {
    try {
      if (!studentsData || studentsData.length === 0) {
        alert("No data available to download");
        setShouldDownload(false);
        setIsDownloading(false);
        return;
      }

      const excelData = studentsData.map((student: Student, index: number) => {
        return {
          "S/N": index + 1,
          "Full Name": `${formatData(student?.profile?.lastName)} ${formatData(student?.profile?.firstName)}`,
          "Email Address": formatData(student?.email),
          "Phone Number": formatData(student?.phoneNumber),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 }, // S/N
        { wch: 30 }, // Full Name
        { wch: 35 }, // Email Address
        { wch: 20 }, // Phone Number
      ];
      worksheet["!cols"] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students Report");

      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Students_Report_${currentDate}.xlsx`;

      XLSX.writeFile(workbook, filename);

      fetchApplications(originalPage, originalItemsPerPage);

      setShouldDownload(false);
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download report. Please try again.");

      fetchApplications(originalPage, originalItemsPerPage);
      setShouldDownload(false);
      setIsDownloading(false);
    }
  }, [
    studentsData,
    formatData,
    fetchApplications,
    originalPage,
    originalItemsPerPage,
  ]);

  useEffect(() => {
    if (shouldDownload && !loading && studentsData && studentsData.length > 0) {
      performDownload();
    }
  }, [shouldDownload, loading, studentsData, performDownload]);

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      setOriginalPage(currentPage);
      setOriginalItemsPerPage(itemsPerPage);

      setShouldDownload(true);

      await fetchApplications(1, 9999);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download report. Please try again.");
      setShouldDownload(false);
      setIsDownloading(false);
    }
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredStudents.length > 0) {
      return filteredStudents.map((student: Student, index: number) => (
        <tr
          key={student.id}
          className="text-[14px] leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td
            className="py-[16px] gap-1 px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(
                `${formatData(student?.profile?.lastName)} ${formatData(
                  student?.profile?.firstName,
                )}`,
              ),
            )}
          />
          <td
            className="py-[16px] px-[24px]"
            dangerouslySetInnerHTML={sanitizeHTML(
              highlightText(student?.email),
            )}
          />
          <td className="py-[16px] px-[24px]">
            <p
              onClick={() =>
                handleViewDetails(
                  student?.id,
                  student?.profile?.firstName,
                  student?.profile?.lastName,
                )
              }
              className="text-primary-700 cursor-pointer font-[600] flex items-center gap-[8px]"
            >
              View Application
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No student available.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    loading,
    filteredStudents,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails,
  ]);

  return (
    <main ref={contentRef} className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <button
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Download Report
              </>
            )}
          </button>
        </div>
      </header>
      <div className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Reports /
                <span className="ml-1 font-medium text-primary-700">
                  All Students
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div className="flex items-center w-64 mt-[1em] rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            value={localSearchTerm}
            onChange={handleSearchChange}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-6 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renderTableBody()}
          </tbody>
        </table>

        {!loading && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={studentsData.length === itemsPerPage}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default SeeAllStudents;
