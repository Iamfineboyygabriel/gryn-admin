import { Link } from "react-router-dom";
import { useStats } from "../../../../../shared/redux/hooks/admin/getAdminProfile";
import { IoIosArrowForward } from "react-icons/io";
const Counts = () => {
  const { getApplicationStats } = useStats();

  const Data = [
    {
      label: "Total Number of Applications",
      figure: getApplicationStats?.data?.size ?? 0,
      detail: "See All Application",
      to: "/admin/dashboard/application"
    },
    {
      label: "Number of Students",
      figure: getApplicationStats?.data?.numberOfStudent ?? 0,
      detail: "See All Students",
      to:"/admin/dashboard/all_users"
    },
    {
      label: "Number of Agents",
      figure: getApplicationStats?.data?.numberOfAgents ?? 0,
      detail: "See All Agents",
      to:"/admin/dashboard/all_users"
    },
    {
      label: "Number of Staffs",
      figure: getApplicationStats?.data?.numberOfStaffs ?? 0,
      detail: "See All Staffs",
      to: "/admin/dashboard/all_staffs"
    },
  ];

  const getBackgroundColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-primary-700";
      case 1:
        return "bg-pink-primary";
      case 2:
        return "bg-primary-300";
      case 3:
        return "bg-primary-400";
      default:
        return "bg-purple-white";
    }
  };

  return (
    <main>
      <div className="flex justify-between gap-3 rounded-lg font-medium text-grey-primary">
        {Data.map((text, index) => (
          <div
            key={index}
            className={`w-full rounded-lg flex flex-col justify-between gap-[1em] text-white px-[20px] py-[1.5em] ${getBackgroundColor(
              index
            )}`}
          >
            <div>
              <h1 className="mb-2">{text.label}</h1>
              <h1 className="text-2xl">{text.figure}</h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">{text.detail}</p>
              <Link to={text.to}>
                <IoIosArrowForward className="cursor-pointer" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Counts;
