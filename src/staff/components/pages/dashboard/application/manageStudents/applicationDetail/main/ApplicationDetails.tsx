import React, { useState, useMemo, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import noData from "../../../../../../../../assets/svg/Transaction.svg";
import { useSingleStudentApplication } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import Loading from "../../../../../../../../shared/loading/Loading";
import Error from "../../../../../../../../shared/error/Error";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  degree: {
    degreeType: string;
    course: string;
  };
  documents: unknown[];
  status: string;
  handlevhandleViewDetails: any;
}

const ApplicationDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { applicationDetails, loading, error } = useSingleStudentApplication(
    studentId ?? ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"order" | "status">("order");

  const navigate = useNavigate();
  const location = useLocation();

  const filteredAndSortedApplications = useMemo(() => {
    if (!applicationDetails) return [];

    const filtered = applicationDetails.filter((app: Application) =>
      `${app.firstName} ${app.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a: Application, b: Application) => {
      if (sortBy === "order") {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    });
  }, [applicationDetails, searchTerm, sortBy, sortOrder]);

  const highlightText = useCallback(
    (text: string, query: string): React.ReactNode => {
      if (!query.trim()) return text;
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-300">
            {part}
          </span>
        ) : (
          part
        )
      );
    },
    []
  );

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const { firstName, lastName } =
    (location.state as { firstName?: string; lastName?: string }) || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (criteria: "order" | "status") => {
    if (sortBy === criteria) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  if (!applicationDetails || applicationDetails.length === 0) {
    return (
      <div className="bottom-0 left-0 right-0 top-0 m-auto flex h-screen flex-col items-center justify-center text-center">
        <img src={noData} alt="No data" />
        <p className="mt-[1em]">No data available</p>
      </div>
    );
  }

  const handleViewDetails = (applicationId: number) => {
    navigate(
      `/staff/dashboard/application/manage_student/view_Application/${applicationId}`
    );
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Manage Students /
            <span className="ml-1 font-medium text-primary-700">
              Application Details
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>

        <div className="mt-[1em]">
          <h2 className="text-xl font-semibold text-black">
            {lastName || "-"} {firstName || "-"}
          </h2>
          <p className="mt-[1em] font-medium">All Applications</p>
        </div>
        <section className="mt-[1em]">
          <div className="flex justify-between">
            <div className="flex items-center gap-[1em]">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
              </div>
              <button
                type="button"
                className="flex cursor-pointer items-center  bg-gray-100 text-gray-500 text-sm font-mediums px-5 py-3"
                onClick={() => handleSortChange("order")}
              >
                <p className="whitespace-nowrap  text-sm">
                  Sort Order
                  <span className="ml-8">
                    {sortBy === "order" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </p>
              </button>
              <button
                type="button"
                className="flex cursor-pointer items-center bg-gray-100 px-5 py-3"
                onClick={() => handleSortChange("status")}
              >
                <p className="whitespace-nowrap text-gray-500 text-sm font-medium">
                  Status
                  <span className="ml-8">
                    {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                  </span>
                </p>
              </button>
            </div>
          </div>
        </section>
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
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Course
                </th>
                <th className="px-6 py-3 text-left  text-sm font-normal">
                  Uploaded Document
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedApplications.length > 0 ? (
                filteredAndSortedApplications.map(
                  (app: Application, index: number) => (
                    <tr
                      key={app.id}
                      onClick={() => handleViewDetails(app.id)}
                      className="text-sm text-grey-primary font-medium"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(
                          `${app.lastName} ${app.firstName}`,
                          searchTerm
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(app.phoneNumber, searchTerm)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(app.email, searchTerm)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(app.degree.degreeType, searchTerm)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {highlightText(app.degree.course, searchTerm)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {app.documents.length}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          type="button"
                          className="text-primary-700 hover:underline"
                        >
                          View Details
                        </button>
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

export default ApplicationDetails;
