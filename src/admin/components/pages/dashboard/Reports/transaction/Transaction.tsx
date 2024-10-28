import { Link } from "react-router-dom";
import { useBudgetFetch } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { MdKeyboardArrowRight } from "react-icons/md";
import transaction from "../../../../../../assets/svg/Transaction.svg";

const Transaction = () => {
  const { budgets } = useBudgetFetch();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
        case "APPROVED":
          return "bg-pink-500 text-white";
      default:
        return "";
    }
  };

  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-[1em]">
        <div className="h-[300px] w-full rounded-lg bg-white px-[2.5em] py-[1.3em] overflow-y-auto">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">Transactions</h1>
              <p className="font-medium text-primary-700">See All</p>
            </div>
          </header>
        </div>

        <div className="h-[300px] w-full rounded-lg bg-white px-[2.5em] py-[1.3em] overflow-y-auto">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">Budgets</h1>
              <Link to="/admin/dashboard/reports/budgets">
                <p className="font-medium flex items-center text-primary-700">
                  See All
                  <MdKeyboardArrowRight />
                </p>
              </Link>
            </div>
          </header>

          <table className="w-full mt-4 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-normal">S/N</th>
                <th className="px-3 py-2 text-left text-sm font-normal">Amount</th>
                <th className="px-3 py-2 text-left text-sm font-normal">Location</th>
                <th className="px-3 py-2 text-left text-sm font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets?.data?.length > 0 ? (
                budgets?.data.map((budget: any, index: number) => (
                  <tr className="border-b border-gray-200" key={budget?.id}>
                    <td className="px-3 py-2 text-sm">{index + 1}</td>
                    <td className="px-3 py-2 text-sm">
                      {budget?.BudgetItem?.length > 0
                        ? `NGN ${budget?.BudgetItem[0]?.amount}`
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-sm">{budget?.location || '-'}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    <div className="mt-[2em] flex flex-col items-center justify-center">
                      <img src={transaction} alt="No Data Available" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-white">
                        No Data Available.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Transaction;
