import { useStats } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { useAllPendingAgents } from "../../../../../../shared/redux/hooks/shared/getUserProfile";

const TotalNumber = () => {
  const { getApplicationStats } = useStats();
  
  const Data = [
    {
      label: "Number of Completed Applications",
      figure: getApplicationStats?.data?.numberOfCompletedApplication ?? 0,
      detail: "See All Completed Applications",
    },
    {
      label: "Number of Pending Applications",
      figure: getApplicationStats?.data?.numberOfPendingApplication ?? 0,
      detail: "See All Pending Applications",
    },
    {
      label: "Number of Pending Agents",
      figure: getApplicationStats?.data?.numberOfPendingAgents ?? 0,
      detail: "See All Pending Agents",
    },
  ];
  return (
    <main className="font-outfit">
      <div className="grid grid-cols-1 gap-5 rounded-lg font-medium text-grey-primary md:grid-cols-2 lg:grid-cols-4">
        {Data?.map((text:any, index:number) => (
          <div
            key={index}
            className="w-full rounded-lg bg-white px-[20px] py-[1.5em] transition-colors duration-300"
          >
            <header>
              <h1>{text.label}</h1>
              <h1>{text.p}</h1>
            </header>
            <h1 className="mt-[1.5em] text-2xl">{text.figure}</h1>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TotalNumber;
