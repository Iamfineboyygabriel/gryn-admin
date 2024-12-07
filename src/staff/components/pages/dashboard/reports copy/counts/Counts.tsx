import { Link } from "react-router-dom";
import { useStaffStats } from "../../../../../../shared/redux/hooks/staff/getStaffProfile";

const Counts = () => {
  const { getApplicationStats } = useStaffStats();

  const Data = [
    {
      label: "Total Number of",
      labelContinuation: "Applications",
      figure: getApplicationStats?.data?.numberOfApplications ?? 0,
      to: "/staff/dashboard/reports/all_application"
    },
    {
      label: "Number of Completed",
      labelContinuation: "Applications",
      figure: getApplicationStats?.data?.numberOfCompletedApplication ?? 0,
      to: "/staff/dashboard/reports/all_application"
    },
    {
      label: "Number of Pending",
      labelContinuation: "Application",
      figure: getApplicationStats?.data?.numberOfPendingApplication ?? 0,
      to: "/staff/dashboard/reports/all_pending_applications"
    },
    {
      label: "All Agents",
      figure: getApplicationStats?.data?.numberOfAgent ?? 0,
      to: "/staff/dashboard/reports/all_agents"
    },
  ];

  return (
    <main className="font-outfit">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Data.map((text, index) => (
          <Link to={text.to} key={index}>
            <div
              className="w-full flex flex-col bg-white justify-between gap-[1em] text-grey-primary px-[20px] py-[1.5em] rounded-lg shadow-md h-full"
            >
              <div className="flex-grow flex flex-col justify-center">
                <h1>{text.label}</h1>
                <h1 className="mb-4">{text.labelContinuation}</h1>
              </div>
              <div>
                <h1 className="text-2xl">{text.figure}</h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Counts;
