import { PieChart, Pie, Cell } from "recharts";
import { useEnquiriesData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

const PieChartEnquiries = () => {
  const { data, isLoading, total, isError } = useEnquiriesData();

  const CHART_DIMENSIONS = {
    sm: { width: 250, height: 250, radius: 100 },
    md: { width: 300, height: 300, radius: 120 },
    lg: { width: 350, height: 350, radius: 140 },
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 md:p-6 relative">
      {isLoading && (
        <div className="absolute top-2 right-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
        </div>
      )}

      {isError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Failed to load enquiries data. Please try again later.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Enquiries</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative">
            <PieChart
              width={CHART_DIMENSIONS.md.width}
              height={CHART_DIMENSIONS.md.height}
              className="transform scale-90 md:scale-100"
            >
              <Pie
                data={data}
                cx={CHART_DIMENSIONS.md.width / 2}
                cy={CHART_DIMENSIONS.md.height / 2}
                outerRadius={CHART_DIMENSIONS.md.radius}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-4">
          <div className="mb-6">
            <p className="text-gray-500">Social Media</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{total}</span>
              <span className="ml-1 text-gray-500">views</span>
            </div>
            <div
              className="mt-8 text-blue-800 font-semibold"
              title="all enquiries"
            />
          </div>

          <div className="grid gap-4">
            {data?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item?.name}</span>
                </div>
                <span className="font-semibold">
                  {item?.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartEnquiries;
