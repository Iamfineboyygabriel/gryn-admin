import React from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";

const AllAgents = () => {
  const agentsData = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+234 65789 847",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+234 65789 847",
    },
  ];

  return (
    <main>
      <div className="relative mt-[2em]">
        <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-6 border-collapse">
          <thead className="text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agentsData.length > 0 ? (
              agentsData.map((student, index) => (
                <tr key={student.id} className="text-sm text-gray-700">
                  <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student.lastName} {student.firstName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student.phoneNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      to="/staff/dashboard/application/manage_student/new_student"
                      className="text-primary-700"
                    >
                      View Application
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="mt-8 flex flex-col items-center justify-center">
                    <img
                      src={transaction}
                      alt="No applications"
                      className="w-24 h-24"
                    />
                    <p className="mt-2 font-medium">No applications</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AllAgents;
