import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PersonalDetails from "../personalDeatils/PersonalDetails";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import Degree from "../degree/Degree";
import UploadedDocument from "../upload/UploadedDocuments";
import { button } from "../../../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../../../assets/svg/Upload.svg";
import Loading from "../../../../../../../../../shared/loading/Loading";
import Error from "../../../../../../../../../shared/error/Error";

const ViewApplication = () => {
  const [activeLink, setActiveLink] = useState("personalDetails");

  const navigate = useNavigate();

  const { applicationId } = useParams<{ applicationId: any }>();

  const { applicationDetails, loading, error } = useApplicationDetails(
    applicationId && applicationId.trim() !== "" ? applicationId : null
  );

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error)
    return (
      <div>
        <Error error={error} />
      </div>
    );
  if (!applicationDetails) return <div>No data available</div>;
  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
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
            {activeLink === "personalDetails" && (
              <PersonalDetails applicationId={applicationId} />
            )}
            {activeLink === "degree" && (
              <Degree applicationId={applicationId} />
            )}
            {activeLink === "uploadedDocument" && <UploadedDocument />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ViewApplication;
