import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { button } from "../../../../../../../../shared/buttons/Button";
import AgentProfile from "../agentProfile/AgentProfile";
import ManageApplication from "../manageApplication/main/ManageApplication";
import ManageStudents from "../manageStudents/main/ManageStudents";
import { useSingleAgentApplication } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import AgentCommission from "../../agentCommission/AgentCommission";


const AgentDetails: React.FC = () => {
  const location = useLocation();
  const { agentId } = useParams<{ agentId: string }>();
  const [activeLink, setActiveLink] = useState("manageApplication");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [status, setStatus] = useState("");

  const { applicationDetails, loading, error } = useSingleAgentApplication(
    agentId ?? "", 
    {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      sort: sortOrder,
      status: status
    }
  );

  const navigate = useNavigate();

  const { firstName, lastName } =
    (location.state as { firstName?: string; lastName?: string }) || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Manage Agent /
            <span className="ml-1 font-medium text-primary-700">
              Agent Details
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
        </div>
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
              <div
                className={`${
                  activeLink === "manageApplication"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageApplication")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Manage Application
                </button.PrimaryButton>
              </div>

              <div
                className={`${
                  activeLink === "agentProfile"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("agentProfile")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Agents Profile
                </button.PrimaryButton>
              </div>

              <div
                className={`${
                  activeLink === "agentCommission"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("agentCommission")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Agent Commission
                </button.PrimaryButton>
              </div>
            </div>
          </nav>
          <section className="mt-3">
            {activeLink === "manageApplication" && (
              <ManageApplication error={error} loading={loading} applicationDetails={applicationDetails}/>)}
            {activeLink === "agentProfile" && <AgentProfile error={error} loading={loading}  applicationDetails={applicationDetails}/>}
            {activeLink === "agentCommission" && <AgentCommission />}

          </section>
        </div>
  
      </header>
    </main>
  );
};

export default AgentDetails;

