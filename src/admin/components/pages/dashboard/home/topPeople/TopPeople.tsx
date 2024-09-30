import { useEffect } from "react";
import { useAllAdminForSuperAdmin } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { useAllAgent } from "../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonRow = () => (
  <div className="animate-pulse flex justify-between py-2">
    <div className="flex gap-[1em]">
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 w-20 bg-gray-200 rounded"></div>
  </div>
);


const TopPeople = () => {
  const { admins, currentPage, loading: loadingAdmins, error: adminError, fetchAdmins } = useAllAdminForSuperAdmin();
  const { agents, loading: loadingAgents, error: agentError, fetchAgents } = useAllAgent();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins(currentPage, itemsPerPage);
  }, [fetchAdmins, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAgents(currentPage, itemsPerPage);
  }, [fetchAgents, currentPage, itemsPerPage]);

  return (
    <main className="font-outfit">
      <div className="flex h-[300px] justify-between gap-[1em]">
        <div className="overflow-y-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">Top Staffs</h1>
              <p className="font-medium text-primary-700">See All</p>
            </div>
          </header>

          <div className="flex mt-[1em] justify-between">
            <small>Name</small>
            <small>Designation</small>
          </div>

          <div className="mt-[1em] flex flex-col gap-[1.2em]">
          {loadingAdmins && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}
            {admins?.data?.length > 0 ? (
              admins.data.map((admin: any, index: number) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-[1em] font-lg">
                    <p>{index + 1}</p>
                    <p>{admin?.profile?.lastName} {admin?.profile?.firstName}</p>
                  </div>
                  <div>
                    <h1 className="font-bold">{admin.role}</h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-[2em] flex flex-col items-center justify-center">
                <img src={transaction} alt="No admins" />
                <p className="mt-2 text-sm text-gray-500 dark:text-white">No Staff found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">Top Agents</h1>
              <p className="font-medium text-primary-700">See All</p>
            </div>
          </header>

          <div className="flex mt-[1em] justify-between">
            <small>Name</small>
            <small>Commission</small>
          </div>

          <div className="mt-[1em] flex flex-col gap-[1.2em]">
            {loadingAgents && <p>Loading agent data...</p>}
            {agents?.length > 0 ? (
              agents.map((agent: any, index: number) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex font-lg items-center gap-[1em]">
                    <p>{index + 1}</p>
                    <p>{agent?.profile?.lastName} {agent?.profile?.firstName}</p>
                  </div>
                  <div>
                    <h1 className="font-bold">NGN 100,000</h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-[2em] flex flex-col items-center justify-center">
                <img src={transaction} alt="No agents" />
                <p className="mt-2 text-sm text-gray-500 dark:text-white">No Agent found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopPeople;
