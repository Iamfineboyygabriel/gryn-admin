import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import noData from "../../../../../../../../../assets/svg/Transaction.svg";
import Error from "../../../../../../../../../shared/error/Error";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  degree: {
    degreeType: string | null;
    course: string | null;
  } | null;
  documents: unknown[] | null;
  status: string;
}

interface ManageApplicationProps {
  applicationDetails: {
    application: Application[];
  };
  loading: boolean;
  error: string | null;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 8 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

const ManageApplication: React.FC<ManageApplicationProps> = ({
  applicationDetails,
  loading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"order" | "status">("order");

  const navigate = useNavigate();

  const filteredAndSortedApplications = useMemo(() => {
    if (!applicationDetails?.application) return [];

    return applicationDetails.application
      .filter((app) =>
        `${app.firstName} ${app.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
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

  const handleBackClick = () => navigate(-1);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleSortChange = (criteria: "order" | "status") => {
    setSortBy(criteria);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleViewDetails = useCallback(
    (applicationId: number) => {
      if (applicationId) {
        navigate("/staff/dashboard/application/manage_application/view_application", {
          state: { applicationId: applicationId }
        });
      }
    },
    [navigate]
  );

  if (error) return <Error error={error} />;

  if (!loading && (!applicationDetails?.application || applicationDetails.application.length === 0)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <img src={noData} alt="No data" />
        <p className="mt-4">No data available</p>
        <button className="btn-2 mt-8 p-3" onClick={handleBackClick}>
          Back
        </button>
      </div>
    );
  }

  return (
    <main className="font-outfit">
      <header className="mt-4 rounded-lg bg-white p-3 pb-40">
        <section className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-10 text-sm"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
            </div>
            <button
              type="button"
              className="flex items-center bg-gray-100 text-gray-500 text-sm font-medium px-5 py-3"
              onClick={() => handleSortChange("order")}
            >
              Sort Order
              <span className="ml-2">
                {sortBy === "order" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
            </button>
            <button
              type="button"
              className="flex items-center bg-gray-100 text-gray-500 text-sm font-medium px-5 py-3"
              onClick={() => handleSortChange("status")}
            >
              Status
              <span className="ml-2">
                {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
              </span>
            </button>
          </div>
        </section>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-gray-500 whitespace-nowrap">
              <tr>
                {["S/N", "Full Name", "Phone Number", "Email Address", "Degree", "Course", "Uploaded Document", "Action"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-sm font-normal">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredAndSortedApplications.length > 0 ? (
                filteredAndSortedApplications.map((app, index) => (
                  <tr
                    key={app.id}
                    onClick={() => handleViewDetails(app.id)}
                    className="text-sm text-grey-primary font-medium cursor-pointer hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(`${app.lastName ?? "-"} ${app.firstName ?? "-"}`, searchTerm)}
                    </td>
                    <td>{highlightText(app.phoneNumber ?? "-", searchTerm)}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(app.email ?? "-", searchTerm)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(app.degree?.degreeType ?? "-", searchTerm)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(app.degree?.course ?? "-", searchTerm)}
                    </td> 
                    <td className="whitespace-nowrap px-6 py-4">
                      {app.documents?.length ?? 0}
                    </td>
                    <td className="flex items-center whitespace-nowrap px-6 py-4">
                    <button
                      className={`mr-2 rounded-full w-[7em] px-3 py-2 text-white ${
                        app?.status === "SUBMITTED" ? "bg-yellow-500" : 
                        app?.status === "COMPLETED" ? "bg-green-500" :
                        "bg-red-500"
                      }`}
                    >
                      {app?.status === "SUBMITTED" ? "In Progress" : 
                      app?.status === "COMPLETED" ? "Completed" :
                      "Declined"}
                    </button>
                    <button
                      onClick={() => handleViewDetails(app?.id)}
                      className="cursor-pointer font-semibold text-primary-700"
                    >
                      View details
                    </button>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No applications found
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

export default ManageApplication;
