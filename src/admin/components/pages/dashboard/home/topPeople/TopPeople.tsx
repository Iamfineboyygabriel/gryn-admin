import { useEffect } from "react";
import { useAllStaffForSuperAdmin, useTopAgentCommisson } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";

const SkeletonRow = () => (
  <div className="animate-pulse flex items-center justify-between py-2">
    <div className="flex items-center gap-[1em]">
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 w-20 bg-gray-200 rounded"></div>
  </div>
);

const ListSection = ({ title, data, loading, error, renderItem, seeAllLink }:any) => (
  <div className="overflow-y-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
    <header>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-grey-primary">{title}</h1>
        <Link to={seeAllLink}>
        <p className="font-medium text-primary-700">See All</p>
        </Link>
      </div>
    </header>

    <div className="flex mt-[1em] justify-between">
      <small>Name</small>
      <small>{title === "Top Staffs" ? "Designation" : "Commission"}</small>
    </div>

    <div className="mt-[1em] flex flex-col gap-[1.2em]">
      {loading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : data?.length > 0 ? (
        data.map((item:any, index:number) => renderItem(item, index))
      ) : (
        <div className="mt-[2em] flex flex-col items-center justify-center">
          <img src={transaction} alt={`No ${title.toLowerCase()}`} />
          <p className="mt-2 text-sm text-gray-500 dark:text-white">No {title.slice(4)} found.</p>
        </div>
      )}
    </div>
  </div>
);

const TopPeople = () => {
  const { admins, currentPage, loading: loadingAdmins, error: adminError, fetchAdmins } = useAllStaffForSuperAdmin();
  const { useTopCommission, loading: commissionLoading, error: commissionError, fetchCommissions } = useTopAgentCommisson();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins(currentPage, itemsPerPage);
    fetchCommissions(currentPage, itemsPerPage);
  }, [fetchAdmins, fetchCommissions, currentPage, itemsPerPage]);

  const formatAmount = (amount:number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  
  const renderStaffItem = (admin: any, index: number) => (
    <div className="flex items-center justify-between" key={index}>
      <div className="flex items-center gap-[1em] font-lg">
        <p>{index + 1}</p>
        <p>{admin?.profile?.lastName} {admin?.profile?.firstName}</p>
      </div>
      <div>
        <h1 className="font-bold">{admin.role}</h1>
      </div>
    </div>
  );

  const renderAgentItem = (agent: any, index: number) => (
    <div className="flex items-center justify-between" key={index}>
      <div className="flex font-lg items-center gap-[1em]">
        <p>{index + 1}</p>
        <p>{agent?.lastName} {agent?.firstName}</p>
      </div>
      <div>
        <h1 className="font-bold">NGN {agent?.commission ? formatAmount(agent?.commission) : '0'}</h1>
      </div>
    </div>
  );

  return (
    <main className="font-outfit">
      <div className="flex h-[300px] justify-between gap-[1em]">
        <ListSection
          title="Top Staffs"
          data={admins?.data}
          loading={loadingAdmins}
          error={adminError}
          renderItem={renderStaffItem}
          seeAllLink="/admin/dashboard/all_staffs" 
        />
        <ListSection
          title="Top Agents"
          data={useTopCommission}
          loading={commissionLoading}
          error={commissionError}
          renderItem={renderAgentItem}
          seeAllLink="/admin/dashboard/reports/all_top_agents"  
        />
      </div>
    </main>
  );
};

export default TopPeople;

