import { useUserActivity } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import empty from "../../../../../../assets/svg/Transaction.svg";

const Activity = () => {
  const { userActivity, loading, currentPage, handlePageChange } =
    useUserActivity();

  const handlePageChangeEvent = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    handlePageChange(page);
  };

  return (
    <main className="font-outfit">
      {userActivity?.data?.length === 0 ? (
        <div className="mt-[2em] flex flex-col items-center justify-center">
          <img src={empty} alt="No activity" />
          <p className="mt-2 text-sm text-gray-500">No activity found.</p>
        </div>
      ) : (
        <>
          {userActivity?.data?.map((activity: any, index: number) => (
            <div
              key={activity?.id}
              className={`flex justify-between font-outfit px-[2em] items-center ${
                index % 2 !== 0 ? "bg-[#F7F7F7]" : ""
              }`}
            >
              <div className="flex font-outfit flex-col py-2 gap-[4px]">
                <h1 className="font-medium text-sm lg:text-lg">
                  {activity?.activity}
                </h1>
                <small className="text-gray-500 font-outfit font-normal">
                  {new Date(activity?.createdAt)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toUpperCase()}{" "}
                  {new Date(activity?.createdAt).toLocaleDateString()}
                </small>
                <small>
                  <strong>Description:</strong>
                  <span className="ml-1">{activity?.description}</span>
                </small>
              </div>
            </div>
          ))}

          {!loading && userActivity?.data?.length > 0 && (
            <div className="mt-6 flex justify-center">
              <CustomPagination
                currentPage={currentPage}
                onPageChange={handlePageChangeEvent}
                hasMore={userActivity?.data?.length === 10}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Activity;
