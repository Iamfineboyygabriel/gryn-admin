import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import { useAllStudent } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import DOMPurify from "dompurify";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
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
  const { useAllStudents, fetchApplications, loading } = useAllStudent();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications(page, itemsPerPage);
  }, [page, fetchApplications]);

  const studentsData: Student[] = useAllStudents.data || [];

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = (text: string, query: string): React.ReactNode => {
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

  const filteredStudents = studentsData.filter((student) =>
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleData = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value); 
  };

  const formatData = (data: string | undefined): string => (data ? data : "-");

  return (
    <main>
      <div className="relative">
        <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : visibleData.length > 0 ? (
              visibleData.map((student, index) => (
                <tr
                  key={student.id}
                  className="text-[14px] leading-[20px] text-[#101828]"
                >
                  <td className="py-[16px] px-[24px]">
                    {(page - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-[16px] gap-1 px-[24px]">
                    {formatData(student?.lastName)}{" "}
                    {formatData(student?.firstName)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {formatData(student?.phoneNumber)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    {highlightText(student.email, searchQuery)}
                  </td>
                  <td className="py-[16px] px-[24px]">
                    <Link
                      to={`/student/${student.id}`}
                      className="text-primary-700 font-[600] flex items-center gap-[8px]"
                    >
                      View Application
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
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
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-[3em] flex justify-center">
        <CustomPagination
          page={page}
          onChange={handlePageChange}
          hasMore={filteredStudents.length > 0}
        />
      </div>
    </main>
  );
};

export default AllStudents;
