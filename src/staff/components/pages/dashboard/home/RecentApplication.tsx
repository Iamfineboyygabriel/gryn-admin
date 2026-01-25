import React, { useCallback, useEffect } from "react";
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

const AllApplication = () => {
  const { applications, loading, fetchApplications, updateSortTerm } =
    useAllApplication();
  const navigate = useNavigate();

  useEffect(() => {
    updateSortTerm("desc");
    fetchApplications(1, 5);
  }, [fetchApplications, updateSortTerm]);

  const handleViewDetails = useCallback(
    (applicationId: number) => {
      navigate(
        "/staff/dashboard/application/manage_application/view_application",
        {
          state: { applicationId: applicationId },
        },
      );
    },
    [navigate],
  );

  const formatData = (data: any) => data || "-";

  const sanitizeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const renderTableBody = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonRow key={`skeleton-${index}`} />
      ));
    }

    if (!applications?.length) {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-8 flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No applications found.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return applications?.map((item: any, index: number) => (
      <tr
        key={item?.id}
        className="text-sm text-grey-primary font-medium border-b border-gray-200"
      >
        <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
        <td
          className="whitespace-nowrap px-6 py-4"
          dangerouslySetInnerHTML={sanitizeHTML(
            `${formatData(item?.lastName)} ${formatData(item?.middleName)} ${formatData(item?.firstName)}`,
          )}
        />
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.phoneNumber)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.email)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.degreeType)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.course)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.documents?.length)}
        </td>
        <td className="flex items-center whitespace-nowrap px-6 py-4">
          <button
            className={`mr-2 rounded-full w-[7em] px-3 py-2 text-white ${
              item?.status === "SUBMITTED"
                ? "bg-yellow-500"
                : item?.status === "COMPLETED"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          >
            {item?.status === "SUBMITTED"
              ? "In Progress"
              : item?.status === "COMPLETED"
                ? "Completed"
                : "Declined"}
          </button>
          <button
            onClick={() => handleViewDetails(item?.id)}
            className="cursor-pointer font-semibold text-primary-700"
          >
            View details
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <main className="mt-5 font-outfit">
      <header>
        <h1 className="text-lg font-semibold dark:text-white">
          Recent Applications
        </h1>
      </header>
      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr className="text-gray-700 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                Degree Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </main>
  );
};

export default AllApplication;
