import transaction from "../../../../../../../../assets/svg/Transaction.svg";

const ViewDetails: React.FC = () => {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
            <th className="px-6 py-3 text-left text-sm font-normal">
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
              Uploaded Document
            </th>
            <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center mt-8">
                <img src={transaction} alt="No applications" className="mb-4" />
                <p>No applications</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewDetails;
