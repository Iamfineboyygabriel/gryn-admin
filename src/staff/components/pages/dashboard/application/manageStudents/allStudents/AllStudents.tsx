import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";
import { useAllStudents } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";

interface Student {
  profile: {
    firstName: string;
    lastName: string;
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

const AllStudents: React.FC = () => {
  const { useAllStudent, fetchApplications, loading } = useAllStudents();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications(page, itemsPerPage);
  }, [fetchApplications, page, itemsPerPage]);

  const studentsData = useMemo(() => {
    const data =
      useAllStudent || useAllStudent || [];
    return Array.isArray(data) ? data : [];
  }, [useAllStudent]);

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student: Student) =>
      `${student.profile.firstName} ${student.profile.lastName} ${student.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [studentsData, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const isCurrentPageEmpty = page > totalPages;

  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, page, itemsPerPage]);

  // const paginatedStudents = filteredStudents;

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    []
  );

  const formatData = useCallback(
    (data: string | undefined): string => (data ? data : "-"),
    []
  );

  const highlightText = useCallback(
    (text: string, query: string): React.ReactNode => {
      if (!query) return text;
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-300">
            {DOMPurify.sanitize(part)}
          </span>
        ) : (
          DOMPurify.sanitize(part)
        )
      );
    },
    []
  );
  const handleViewDetails = useCallback(
    (studentId: string, firstName: string, lastName: string) => {
      navigate(
        `/staff/dashboard/application/manage_student/application_details/${studentId}`,
        {
          state: { firstName, lastName },
        }
      );
    },
    [navigate]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (paginatedStudents.length > 0) {
      return paginatedStudents.map((student: Student, index: number) => (
        <tr
          key={student.id}
          className="text-[14px] leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(page - 1) * itemsPerPage + index + 1}
          </td>
          <td className="py-[16px] gap-1 px-[24px]">
            {highlightText(
              `${formatData(student.profile.lastName)} ${formatData(
                student.profile.firstName
              )}`,
              searchQuery
            )}
          </td>
          <td className="py-[16px] px-[24px]">
            {highlightText(formatData(student.phoneNumber), searchQuery)}
          </td>
          <td className="py-[16px] px-[24px]">
            {highlightText(student.email, searchQuery)}
          </td>
          <td className="py-[16px] px-[24px]">
            <p
              onClick={() =>
                handleViewDetails(
                  student?.id,
                  student?.profile.firstName,
                  student?.profile.lastName
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
                No recent applications.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    loading,
    paginatedStudents,
    page,
    handleViewDetails,
    itemsPerPage,
    formatData,
    highlightText,
    searchQuery,
  ]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setPage(1);
    },
    []
  );

  return (
    <main>
      <div className="relative">
        <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            value={searchQuery}
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
                Phone Number
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
      </div>

      {!loading && filteredStudents.length > 0 && (
        <div className="mt-6 flex justify-center">
           {/* <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={filteredStudents.length === itemsPerPage}
          /> */}
        </div>
      )}
    </main>
  );
};

export default AllStudents;
