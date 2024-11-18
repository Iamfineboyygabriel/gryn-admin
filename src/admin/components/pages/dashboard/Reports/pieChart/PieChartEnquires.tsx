// import { PieChart, Pie, Cell } from "recharts";
// import eye from "../../../../../../assets/svg/eyeImg.svg";
// import { useEnquiriesData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
// import { Link } from "react-router-dom";

// const PieChartEnquiries = () => {
//   const { data, isLoading, total } = useEnquiriesData();

//   if (isLoading) {
//     return <div className="w-full bg-white rounded-lg p-6">Loading...</div>;
//   }

//   return (
//     <div className="w-full bg-white rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Enquiries</h2>
//       </div>
//       <div className="flex">
//         <div className="w-1/2">
//           <PieChart width={300} height={300}>
//             <Pie
//               data={data}
//               cx={150}
//               cy={150}
//               outerRadius={120}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {data.map((entry: any, index: any) => (
//                 <Cell key={`cell-${index}`} fill={entry?.color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </div>
//         <div className="w-1/2 pl-4">
//           <div className="mb-6">
//             <p className="text-gray-500">Social Media</p>
//             <div className="flex items-baseline">
//               <span className="text-2xl font-bold">{total}</span>
//               <span className="ml-1 text-gray-500">views</span>
//             </div>
//             <div
//               className="mt-[2em] text-blue-800 font-semibold"
//               title="all enquuiries"
//             >
//               <Link to="/admin/dashboard/reports/instagram">See All</Link>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {data?.map((item: any, index: any) => (
//               <div key={index} className="flex gap-5 items-center">
//                 <div className="flex items-center">
//                   <div
//                     className="w-2 h-2 rounded-full mr-2"
//                     style={{ backgroundColor: item.color }}
//                   ></div>
//                   <span>{item?.name}</span>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <span className="font-semibold">
//                     {item?.value?.toLocaleString()}
//                   </span>
//                   {/* <button className="text-purple-600 flex gap-2 bg-purple-50 px-2 py-1 rounded-full text-sm hover:bg-purple-100 transition-colors">
//                     <img src={eye} alt="eye_icon" />
//                     View Details
//                   </button> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PieChartEnquiries;

import { PieChart, Pie, Cell } from "recharts";
import { useEnquiriesData } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { Link } from "react-router-dom";

const PieChartEnquiries = () => {
  const { data, isLoading, total } = useEnquiriesData();

  if (isLoading) {
    return <div className="w-full bg-white rounded-lg p-6">Loading...</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Enquiries</h2>
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
              <span className="text-2xl font-bold">{total}</span>
              <span className="ml-1 text-gray-500">views</span>
            </div>
            <div
              className="mt-[2em] text-blue-800 font-semibold"
              title="all enquuiries"
            >
              <Link to="/admin/dashboard/reports/instagram">See All</Link>
            </div>
          </div>

          <div className="space-y-3">
            {data?.map((item: any, index: any) => (
              <div key={index} className="flex gap-5 items-center">
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
