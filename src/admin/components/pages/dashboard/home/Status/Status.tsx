import { useCallback, useMemo } from "react";
import { useAllApplication } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import BarChat from "../Status/BarChat"

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Status = () => {
  const { applications, loading } = useAllApplication();
  const navigate = useNavigate()

  const handleViewDetails = useCallback(
    (applicationId: number) => {
      navigate("/admin/dashboard/application/all_application/view_application", {
        state: { applicationId: applicationId }
      });
    },
    [navigate]
  );
  
  const filteredAndSortedApplications = useMemo(() => {
    if (!applications || !Array?.isArray(applications)) {
      return [];
    }
    return applications;
   }, [applications,handleViewDetails]);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return (
        <>
          {Array?.from({ length: 10 })?.map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      );
    }
    const formatData = (data: any) => (data ? data : "-");

    if (filteredAndSortedApplications?.length > 0) {
      return filteredAndSortedApplications?.map((item: any, index: number) => (
        <tr
          key={item.id}
          className="text-sm text-gray-700 border-b border-gray-200 dark:text-white"
        >
          <td className="whitespace-nowrap px-2 py-2">
            {index + 1}
          </td>
          <td className="whitespace-nowrap px-2 text-sm py-2">
            {formatData(item?.degree?.degreeType)}
          </td>
          <td className="whitespace-nowrap px-2 text-sm py-2">
            {formatData(item?.degree?.course)}
          </td>
          <td className="flex items-center whitespace-nowrap px-3 py-2">
            <button
              className={`mr-2 rounded-full px-2 py-2 text-white ${
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
    filteredAndSortedApplications,
    loading,
  ]);

  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-[9px]">
        <div className="h-[414px] overflow-y-auto w-full rounded-lg bg-white px-[1.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Recent Application
              </h1>
              <Link to="/admin/dashboard/application">
              <p className="font-medium text-primary-700">See All</p>
              </Link>
            </div>
            <table className="min-w-full text-left">
              <thead className="border-b border-gray-200 text-gray-500 dark:text-white">
                <tr>
                  <th className="py-3 px-1 text-left text-sm font-normal">S/N</th>
                  <th className="py-3 px-1 text-left text-sm font-normal">
                    Degree
                  </th>
                  <th className="py-3 px-1 text-left text-sm font-normal">
                    Course
                  </th>
                  <th className="py-3 px-1 text-left text-sm font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </header>
        </div>

        <div className="h-auto w-full rounded-lg bg-white  py-[1px]">
          <header>
            <div className="flex items-center justify-between">
             
            </div>
          </header>
          <div className="mt-[1em] flex flex-col">
            <BarChat/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Status;
