import transaction from "../../../../../assets/svg/Transaction.svg";

const RecentApplication = ({ sortOption }: any) => {
 

  return (
    <main className="mt-8 font-outfit">
      <div>
        <div>
          <h1 className="text-lg font-semibold dark:text-white">
            Recent Applications
          </h1>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-gray-500 dark:text-white">
              <tr>
                <div className="flex items-center gap-2 px-6 py-3">
                  <th className="px-6 py-3 text-left text-sm font-normal">
                    S/N
                  </th>
                  <th className="whitespace-nowrap text-left text-sm font-normal">
                    Full Name
                  </th>
                </div>
                <th className="whitespace-nowrap text-left text-sm font-normal">
                  Phone Number
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Uploaded Documents
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
          

         
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-gray-500"
                  >
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

export default RecentApplication;
