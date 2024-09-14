import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { button } from "../../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../../assets/svg/Upload.svg";
import PersonalDetails from "../personalDetails/PersonalDetails";
import BankDetails from "../bankDetails/BankDetails";
import UploadedDocuments from "../uploadedDocuments/UploadedDocuments";
import { findAgentByEmail } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { AppDispatch, RootState } from "../../../../../../../../shared/redux/store";

const ApprovePendingAgent = () => {
  const [activeLink, setActiveLink] = useState("personalDetails");
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { agent, loading, error } = useSelector((state: RootState) => state.shareApplication);

  useEffect(() => {
    if (email) {
      dispatch(findAgentByEmail(email));
    }
  }, [dispatch, email]);

  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  View Application
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div>
          <nav className="mt-[1.5em]">
            <div className="flex items-center border-b-[3px] border-gray-100 text-base font-semibold">
              <div className="flex gap-[2em]">
                <div
                  className={`cursor-pointer py-3 ${
                    activeLink === "personalDetails"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("personalDetails")}
                >
                  Personal Details
                </div>
                <div
                  className={`cursor-pointer py-3 ${
                    activeLink === "bankDetails"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("bankDetails")}
                >
                  Bank Details
                </div>
                <div
                  className={`cursor-pointer py-3 ${
                    activeLink === "uploadedDocument"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("uploadedDocument")}
                >
                  Uploaded Documents
                </div>
              </div>
              <button.PrimaryButton className="ml-[3em] flex items-center gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={upload} alt="upload" />
                Download Application
              </button.PrimaryButton>
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "personalDetails" && agent && (
              <PersonalDetails agentData={agent} loading={loading} />
            )}
            {activeLink === "bankDetails" && agent && (
              <BankDetails  agentData={agent} loading={loading}/>
            )}
            {activeLink === "uploadedDocument" && agent && (
              <UploadedDocuments  agentData={agent} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ApprovePendingAgent;