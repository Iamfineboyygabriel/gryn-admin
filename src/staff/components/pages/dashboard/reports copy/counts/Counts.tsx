import { StaffStats } from "../../../../../../data/data";

const Counts = () => {
  return (
    <main className="font-outfit">
      <div className="grid grid-cols-1 gap-5 rounded-lg font-medium text-grey-primary md:grid-cols-2 lg:grid-cols-4">
        {StaffStats.map((text, index) => (
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

export default Counts;

// import { StaffStats } from "../../../../../../data/data";
// import { useStats } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

// const Counts = () => {
//   const { getApplicationStats } = useStats();

//   const Data = [
//     {
//       label: "Total Number of Applications",
//       figure: getApplicationStats?.data?.size ?? 0,
//       detail: "See Application",
//     },
//     {
//       label: "Number of Completed Applications",
//       figure: getApplicationStats?.data?.completed ?? 0,
//       detail: "See Completed Applications",
//     },
//     {
//       label: "Number of Pending Applications",
//       figure: getApplicationStats?.data?.pending ?? 0,
//       detail: "See Pending Applications",
//     },

//     {
//       label: "Number of Agents",
//       figure: getApplicationStats?.data?.numberOfAgent ?? 0,
//       detail: "See All Agents",
//     },
//   ];
//   return (
//     <main className="font-outfit">
//       <div className="grid grid-cols-1 gap-5 rounded-lg font-medium text-grey-primary md:grid-cols-2 lg:grid-cols-4">
//         {StaffStats.map((text, index) => (
//           <div
//             key={index}
//             className="w-full rounded-lg bg-white px-[20px] py-[1.5em] transition-colors duration-300"
//           >
//             <header>
//               <h1>{text.label}</h1>
//               <h1>{text.p}</h1>
//             </header>
//             <h1 className="mt-[1.5em] text-2xl">{text.figure}</h1>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Counts;
