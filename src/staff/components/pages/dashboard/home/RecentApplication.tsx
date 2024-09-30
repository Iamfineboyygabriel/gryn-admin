import React, { useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import transaction from "../../../../../assets/svg/Transaction.svg";
import { useAllApplication } from "../../../../../shared/redux/hooks/admin/getAdminProfile";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const RecentApplication: React.FC = () => {
  const { applications, currentPage, loading, fetchApplications } = useAllApplication();
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  const recentApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications)) {
      return [];
    }
    return applications;
  }, [applications]);

  const handleViewDetails = useCallback(
    (applicationId: string) => {
      navigate(`/staff/dashboard/application/manage_application/view_application/${applicationId}`);
    },
    [navigate]
  );

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      );
    }

    if (recentApplications?.length > 0) {
      return recentApplications.map((item: any, index: number) => (
        <tr key={item.id} className="text-sm text-grey-primary font-medium border-b border-gray-200">
          <td className="whitespace-nowrap px-6 py-4">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td className="whitespace-nowrap px-6 py-4">
            {formatData(item?.lastName)} {formatData(item?.middleName)} {formatData(item?.firstName)}
          </td>
          <td className="whitespace-nowrap px-6 py-4">{formatData(item?.phoneNumber)}</td>
          <td className="whitespace-nowrap px-6 py-4">{formatData(item?.email)}</td>
          <td className="whitespace-nowrap px-6 py-4">{formatData(item?.degree?.degreeType)}</td>
          <td className="whitespace-nowrap px-6 py-4">{formatData(item?.degree?.course)}</td>
          <td className="whitespace-nowrap px-6 py-4">{formatData(item?.documents?.length)}</td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button
              className={`mr-2 rounded-full px-3 py-2 text-white ${
                item?.status === "SUBMITTED" ? "bg-yellow-500" : "bg-green-500"
              }`}
            >
              {item?.status === "SUBMITTED" ? "In Progress" : "Completed"}
            </button>
            <p
              onClick={() => handleViewDetails(item?.id)}
              className="cursor-pointer font-semibold text-primary-700"
            >
              View details
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
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
    recentApplications,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    formatData,
    handleViewDetails,
    loading,
  ]);

  return (
    <main className="font-outfit mt-7">
      <header>
        <h1 className="text-lg font-semibold dark:text-white">
          Recent Applications
        </h1>
      </header>
      <div className="overflow-x-auto">
        <table className="mt-4 w-full table-auto overflow-x-auto">
          <thead>
            <tr className="text-gray-700 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Phone Number</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                Degree Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Documents</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </main>
  );
};

export default RecentApplication;
