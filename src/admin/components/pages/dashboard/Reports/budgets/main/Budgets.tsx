import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useBudgetFetch } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import noData from "../../../../../../../assets/svg/Transaction.svg";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";

const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-200">
      {Array.from({ length: 9 }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

const Budgets: React.FC = () => {
    const { budgets,loading } = useBudgetFetch();
    const navigate = useNavigate()
    const getStatusColor = (status: string) => {
        switch (status) {
          case "PAID":
            return "bg-green-500";
          case "PENDING":
            return "bg-yellow-500";
          default:
            return;
        }
      };

//   const highlightText = useCallback(
//     (text: string, query: string): React.ReactNode => {
//       if (!query.trim()) return text;
//       const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       const regex = new RegExp(`(${escapedQuery})`, "gi");
//       const parts = text.split(regex);
//       return parts.map((part, index) =>
//         regex.test(part) ? (
//           <span key={index} className="bg-yellow-300">
//             {part}
//           </span>
//         ) : (
//           part
//         )
//       );
//     },
//     []
//   );

  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Reports</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Budget /
            <span className="ml-1 font-medium text-primary-700">
              All Budgets
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>

        <section className="mt-[1em]">
          <div className="flex justify-between">
            <div className="flex items-center gap-[1em]">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                  placeholder="Search"
                />
                <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
              </div>
              <button
                type="button"
                className="flex cursor-pointer items-center  bg-gray-100 text-gray-500 text-sm font-mediums px-5 py-3"
              >
                <p className="whitespace-nowrap  text-sm">
                  Sort Order
                  <span className="ml-8">
                    {/* {sortBy === "order" && (sortOrder === "asc" ? "▲" : "▼")} */}
                  </span>
                </p>
              </button>
              <button
                type="button"
                className="flex cursor-pointer items-center bg-gray-100 px-5 py-3"
              >
                <p className="whitespace-nowrap text-gray-500 text-sm font-medium">
                  Status
                  <span className="ml-8">
                    {/* {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")} */}
                  </span>
                </p>
              </button>
            </div>
            <Link to="/admin/dashboard/reports/new_budgets">
              <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                <img src={plus} alt="plus" />
                 New Budget
              </button.PrimaryButton>
            </Link>
          </div>
        </section>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-gray-500  border-gray-200 border-b">
              <tr className="">
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Location
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Senders Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                   Date & time
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budgets?.data?.length > 0 ? (
                budgets?.data?.map(
                  (budget:any , index: number) => (
                    <tr
                      key={budget.id}
                      className="text-sm text-grey-primary font-medium"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 text-sm">
                      {budget.BudgetItem.length > 0
                      ? `NGN ${budget?.BudgetItem[0]?.amount}` 
                      : '-'}
                      </td>
                      <td className="px-3 py-2 text-sm">{budget?.location || '-'}</td>
                      <td className="px-3 py-2 text-sm">-</td>
                      <td className="px-3 py-2 text-sm">
                        {budget?.updatedAt 
                            ? new Date(budget?.updatedAt).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            }).replace(',', '').toLowerCase() 
                            : '-'}
                        </td>
                        <td className="px-3 py-2">
                        <span
                        className={`rounded-full px-3 py-1 text-white text-sm ${getStatusColor(
                            budget?.status
                        )}`}
                        >
                        {budget?.status || '-'}
                        </span>
                    </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center mt-8">
                      <img
                        src={noData}
                        alt="No applications"
                        className="mb-4"
                      />
                      <p>No applications</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </header>
    </main>
  );
};

export default Budgets;
