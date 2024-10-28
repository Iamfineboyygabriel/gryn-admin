import { useUserActivity } from "../../../../../shared/redux/hooks/admin/getAdminProfile";
import transaction from "../../../../../assets/svg/Transaction.svg";
import dayjs from "dayjs";
import CustomPagination from "../../../../../shared/utils/customPagination";

const RecentActivity = () => {
  const { userActivity, loading, currentPage, handlePageChange, limit } = useUserActivity();

  const handlePageChangeEvent = (event: React.ChangeEvent<unknown>, page: number) => {
    handlePageChange(page);
  };

  return (
    <main className="mt-8 font-outfit">
      <div>
        <div>
          <h1 className="text-lg font-semibold dark:text-white">
            Recent Activity
          </h1>
        </div>
        <div className="mt-8">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200 text-grey dark:text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm font-normal">
              {userActivity?.data?.length > 0 ? (
                userActivity?.data?.map((item: any, index: any) => (
                  <tr
                    key={index}
                    className="text-sm font-medium text-grey-primary dark:text-white"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                    {((currentPage - 1) * limit) + index + 1}
                      </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item?.activity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item?.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {dayjs(item.date).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="mt-[2em] flex flex-col items-center justify-center">
                      <img
                        src={transaction}
                        alt="No applications"
                        className="mb-4"
                      />
                      No activity.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {!loading && userActivity?.data?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChangeEvent}
            hasMore={userActivity?.data?.length === 10}
          />
        </div>
      )}
    </main>
  );
};

export default RecentActivity;
