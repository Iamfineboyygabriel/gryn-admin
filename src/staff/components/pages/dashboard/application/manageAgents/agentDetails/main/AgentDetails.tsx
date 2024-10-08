import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { button } from "../../../../../../../../shared/buttons/Button";
import AgentProfile from "../agentProfile/AgentProfile";
import ManageApplications from "../manageApplication/main/ManageApplication";
import ManageStudents from "../manageStudents/main/ManageStudents";
import { useSingleAgentApplication } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: any }>();
  const { applicationDetails, loading, error } = useSingleAgentApplication(
    agentId ?? ""
  );
  const [activeLink, setActiveLink] = useState("manageApplication");

  const navigate = useNavigate();
  const location = useLocation();

  const { firstName, lastName } =
    (location.state as { firstName?: string; lastName?: string }) || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (applicationDetails) {
      console.log("Successfully loaded application details:", applicationDetails);
    }
  }, [applicationDetails]);

  return (
    <div className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <main className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <header className="flex items-center justify-between">
          <h2 className="font-medium">
            Manage Agent /
            <span className="ml-1 font-medium text-primary-700">
              Agent Details
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </header>

        <div className="mt-[1em]">
          <h2 className="text-xl font-semibold text-black">
            {lastName || "-"} {firstName || "-"}
          </h2>
        </div>

        <nav>
          <div className="flex mt-[1.5em] gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
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
                activeLink === "manageStudents"
                  ? "bg-purple-white text-primary-700"
                  : "bg-gray-100 text-grey-primary"
              } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
              onClick={() => setActiveLink("manageStudents")}
            >
              <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                Manage Student
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
                Agent Profile
              </button.PrimaryButton>
            </div>
          </div>
        </nav>
        <section className="mt-3">
          {activeLink === "manageApplication" && <ManageApplications error={error} loading={loading} applicationDetails={applicationDetails}/>}
          {activeLink === "manageStudents" && <ManageStudents error={error} loading={loading} applicationDetails={applicationDetails}/>}
          {activeLink === "agentProfile" && <AgentProfile error={error} loading={loading} applicationDetails={applicationDetails}/>}
        </section>
      </main>
    </div>
  );
};

export default AgentDetails;

