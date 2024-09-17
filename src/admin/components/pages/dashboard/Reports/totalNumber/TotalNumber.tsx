import { useStats } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { useAllPendingAgents } from "../../../../../../shared/redux/hooks/shared/getUserProfile";

const TotalNumber = () => {
  const { getApplicationStats } = useStats();
  const { agents } = useAllPendingAgents();
  const Data = [
    {
      label: "Number of Completed Applications",
      figure: getApplicationStats?.data?.completed ?? 0,
      detail: "See Completed Applications",
    },
    {
      label: "Number of Pending Applications",
      figure: getApplicationStats?.data?.pending ?? 0,
      detail: "See Pending Applications",
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
      <div className="w-[em]">
       <div
       className="w-full rounded-lg bg-white px-[20px] py-[1.5em] transition-colors duration-300"
        >
        <header>
            <h1>Pending</h1>
            <h1>Agents</h1>
        </header>
        <h1 className="mt-[1.5em] text-2xl">{agents?.length}</h1>
        </div>
     </div>
      </div>
    </main>
  );
};

export default TotalNumber;
