import React from "react";
import { useStaffStats } from "../../../../../shared/redux/hooks/staff/getStaffProfile";

const Counts = () => {
  const { getApplicationStats } = useStaffStats();

  const Data = [
    {
      label: "Total Number of Applications",
      figure: getApplicationStats?.data?.numberOfApplications ?? 0,
    },
    {
      label: "Number of Completed Applications",
      figure: getApplicationStats?.data?.numberOfCompletedApplication ?? 0,
    },
    {
      label: "Number of Pending Applications",
      figure: getApplicationStats?.data?.numberOfPendingApplication ?? 0,
    },
    {
      label: "Number of Agents",
      figure: getApplicationStats?.data?.numberOfAgent ?? 0,
    },
  ];

  return (
    <main className="font-outfit w-full">
      <div className="min-w-0 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max pr-4">
          {Data.map((text, index) => (
            <div
              key={index}
              className="w-64 rounded-lg bg-purple-white hover:bg-primary-700 hover:text-white transition-colors duration-200"
            >
              <div className="p-6 flex flex-col gap-4">
                <h2 className="text-sm font-medium text-inherit">
                  {text.label}
                </h2>
                <p className="text-2xl font-semibold text-inherit">
                  {text.figure}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Counts;
