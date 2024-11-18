import { PieChart, Pie, Cell } from "recharts";
import eye from "../../../../../../assets/svg/eyeImg.svg";
import { useEnquiriesData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

const PieChartEnquiries = () => {
  const { data, isLoading } = useEnquiriesData();
  const totalViews = data?.reduce(
    (sum: any, item: any) => sum + item?.value,
    0
  );

  if (isLoading) {
    return <div className="w-full bg-white rounded-lg p-6">Loading...</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Enquiries</h2>
        <div className="flex items-center text-sm text-gray-500">
          <span>July</span>
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              cx={150}
              cy={150}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="w-1/2 pl-4">
          <div className="mb-6">
            <p className="text-gray-500">Social Media</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">
                {totalViews.toLocaleString()}
              </span>
              <span className="ml-1 text-gray-500">views</span>
            </div>
            <div className="flex items-center text-green-500">
              <span className="font-semibold">34%</span>
              <span className="ml-1 text-sm">(+20.90%)</span>
            </div>
          </div>
          <div className="space-y-3">
            {data?.map((item: any, index: any) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item?.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">
                    {item?.value?.toLocaleString()}
                  </span>
                  <button className="text-purple-600 flex gap-2 bg-purple-50 px-2 py-1 rounded-full text-sm hover:bg-purple-100 transition-colors">
                    <img src={eye} alt="eye_icon" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartEnquiries;
