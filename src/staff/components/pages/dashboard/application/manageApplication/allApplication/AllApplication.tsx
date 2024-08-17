import transaction from "../../../../../../../assets/svg/Transaction.svg";

const AllApplication = () => {
  return (
    <main className="mt-[2em]">
      <table className="w-full border-collapse">
        <thead className="text-gray-500 dark:text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Full Name
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Phone Number
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Email Address
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Degree</th>
            <th className="px-6 py-3 text-left text-sm font-normal">Course</th>
            <th className="px-6 py-3 text-left text-sm font-normal">
              Uploaded Documents
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
              Assigned to
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          <tr>
            <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
              <div className="mt-[2em] flex flex-col items-center justify-center">
                <img src={transaction} alt="No applications" />
                <p className="mt-2 text-sm text-gray-500 dark:text-white">
                  No recent applications.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default AllApplication;
