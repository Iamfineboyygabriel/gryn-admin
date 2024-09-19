import { useStaffStats } from "../../../../../shared/redux/hooks/staff/getStaffProfile";

const Counts = () => {
  const { getApplicationStats } = useStaffStats();
  
  const Data = [
    {
      label: "Total Number of Applications",
      figure: getApplicationStats?.data?.numberOfApplications ?? 0,
      detail: "See Application",
    },
    {
      label: "Number of Completed Applications",
      figure: getApplicationStats?.data?.numberOfCompletedApplications ?? 0,
      detail: "See Completed Applications",
    },
    {
      label: "Number of Pending Applications",
      figure: getApplicationStats?.data?.numberOfPendingApplications ?? 0,
      detail: "See Pending Applications",
    },

    {
      label: "Number of Agents",
      figure: getApplicationStats?.data?.numberOfAgent ?? 0,
      detail: "See All Agents",
    },
  ];
  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-3 rounded-lg font-medium text-grey-primary">
        {Data.map((text, index) => (
          <div
            key={index}
            className="w-full rounded-lg flex flex-col bg-purple-white  hover:bg-primary-700 justify-between hover:text-white gap-[1em] text-grey-primary px-[20px] py-[1.5em]"
          >
            <div>
              <h1 className="mb-2">{text.label}</h1>
              <h1 className="text-2xl">{text.figure}</h1>
            </div>
            <p className="text-sm">{text.detail}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Counts;
