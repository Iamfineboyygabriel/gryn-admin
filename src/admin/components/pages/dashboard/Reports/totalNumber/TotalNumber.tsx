import { Link } from "react-router-dom";
import { useStats } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

const TotalNumber = () => {
  const { getApplicationStats } = useStats();
  
  const Data = [
    {
      label: "Number of Completed Applications",
      figure: getApplicationStats?.data?.numberOfCompletedApplication ?? 0,
      detail: "See All Completed Applications",
      to: "/admin/dashboard/reports/all_application"
    },
    {
      label: "Number of Pending Applications",
      figure: getApplicationStats?.data?.numberOfPendingApplication ?? 0,
      detail: "See All Pending Applications",
      to: "/admin/dashboard/reports/all_pending_applications"
    },
    {
      label: "Number of Pending Agents",
      figure: getApplicationStats?.data?.numberOfPendingAgents ?? 0,
      detail: "See All Pending Agents",
      to: "/admin/dashboard/reports/all_pending_agents"
    },
  ];

  return (
    <main className="font-outfit">
      <div className="grid grid-cols-1 gap-5 rounded-lg font-medium text-grey-primary md:grid-cols-2 lg:grid-cols-4">
        {Data?.map((text:any, index:number) => (
          <Link to={text.to} key={index}>
            <div className="w-full h-full flex flex-col justify-between rounded-lg bg-white cursor-pointer px-[20px] py-[1.5em] transition-colors duration-300">
              <header>
                <h1>{text.label}</h1>
              </header>
              <div className="mt-[1.5em]">
                <h1 className="text-2xl">{text.figure}</h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default TotalNumber;
