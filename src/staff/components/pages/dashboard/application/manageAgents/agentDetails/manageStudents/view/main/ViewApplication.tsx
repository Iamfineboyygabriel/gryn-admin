import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../personalDetails/PersonalDetails";
import Degree from "../degree/Degree";
import UploadedDocument from "../upload/UploadedDocuments";
import { button } from "../../../../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../../../../assets/svg/Upload.svg";

const ViewApplication = () => {
  const [activeLink, setActiveLink] = useState("personalDetails");

  const navigate = useNavigate();

  const handleBackClick = async () => {
    navigate(-1);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Agent /
                <span className="ml-1 font-medium">Agent Details</span> /
                <span className="ml-1 font-medium">Manage Application</span> /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  View Application
                </span>
              </h1>
            </div>
            <button.PrimaryButton
              onClick={handleBackClick}
              className="gap-2 rounded-lg bg-purple-pink p-[12px] font-medium text-primary-700"
            >
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
                    activeLink === "degree"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("degree")}
                >
                  Degree
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
              <button.PrimaryButton className=" ml-[3em] items-center gap-2 flex rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={upload} alt="upload" />
                Download Application
              </button.PrimaryButton>
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "personalDetails" && <PersonalDetails />}
            {activeLink === "degree" && <Degree />}
            {activeLink === "uploadedDocument" && <UploadedDocument />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ViewApplication;
