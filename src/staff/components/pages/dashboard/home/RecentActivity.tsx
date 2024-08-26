import transaction from "../../../../../assets/svg/Transaction.svg";

const RecentActivity = () => {
  return (
    <main className="mt-8 font-outfit">
      <div>
        <div>
          <h1 className="text-lg font-semibold dark:text-white">
            Recent Activity
          </h1>
        </div>
        <div className="mt-8">
          <table className="w-full border-collapse">
            <thead className="text-grey border-b border-gray-200">
              <tr>
                <div>
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    Activity
                  </th>
                </div>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm font-normal">
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={transaction}
                      alt="No applications"
                      className="mb-4"
                    />
                    No applications
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default RecentActivity;
