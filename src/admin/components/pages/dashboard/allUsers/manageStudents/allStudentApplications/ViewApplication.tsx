import React, { useState, useRef } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import PersonalDetails from "../allStudentApplications/personalDeatils/PersonalDetails";
import Degree from "../allStudentApplications/degree/Degree";
import UploadedDocument from "../allStudentApplications/upload/UploadedDocuments";
import { button } from "../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../assets/svg/Upload.svg";
import Loading from "../../../../../../../shared/loading/Loading";
import Error from "../../../../../../../shared/error/Error";
import { useApplicationDetails } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Payments from "../../../application/allApplication/viewApplicationDetails/view/payments/Payments";

interface LocationState {
  applicationId: any;
}

const ViewApplication: React.FC = () => {
  const location = useLocation();
  const { applicationId } = location.state as LocationState;
  const [activeLink, setActiveLink] = useState("personalDetails");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const navigate = useNavigate();
  const personalDetailsRef = useRef<HTMLDivElement>(null);
  const degreeRef = useRef<HTMLDivElement>(null);
  const uploadedDocumentRef = useRef<HTMLDivElement>(null);
  const paymentDocumentRef = useRef<HTMLDivElement>(null);

  const { applicationDetails, loading, error } = useApplicationDetails(
    applicationId !== "" ? applicationId : null
  );

  const handleBackClick = () => {
    navigate(-1);
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("p", "mm", "a4");
    const components = [
      { ref: personalDetailsRef, title: "Personal Details" },
      { ref: degreeRef, title: "Degree" },
      { ref: uploadedDocumentRef, title: "Uploaded Documents" },
      { ref: paymentDocumentRef, title: "Payments" },
    ];

    try {
      for (let i = 0; i < components.length; i++) {
        const { ref, title } = components[i];
        const content = ref.current;
        if (content) {
          content.style.display = "block";

          const canvas = await html2canvas(content, {
            scale: 2,
            logging: false,
            useCORS: true,
          });

          const imgData = canvas.toDataURL("image/jpeg", 0.95);

          if (i !== 0) {
            pdf.addPage();
          }

          pdf.setFontSize(16);
          pdf.text(title, 20, 20);

          const imgWidth = 170;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "JPEG", 20, 30, imgWidth, imgHeight);

          content.style.display = i === 0 ? "block" : "none";
        }
      }

      pdf.save("application.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
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
                <div
                  className={`cursor-pointer py-3 ${
                    activeLink === "payments"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("payments")}
                >
                  Payments
                </div>
              </div>
              <button.PrimaryButton
                onClick={downloadPDF}
                className="ml-[3em] items-center gap-2 flex rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
              >
                <img src={upload} alt="upload" />
                {isGeneratingPDF ? "Generating PDF..." : "Download Application"}
              </button.PrimaryButton>
            </div>
          </nav>
          <section className="mt-8">
            <div
              ref={personalDetailsRef}
              style={{
                display: activeLink === "personalDetails" ? "block" : "none",
              }}
            >
              <PersonalDetails applicationId={applicationId} />
            </div>
            <div
              ref={degreeRef}
              style={{ display: activeLink === "degree" ? "block" : "none" }}
            >
              <Degree applicationId={applicationId} />
            </div>
            <div
              ref={uploadedDocumentRef}
              style={{
                display: activeLink === "uploadedDocument" ? "block" : "none",
              }}
            >
              <UploadedDocument applicationId={applicationId} />
            </div>
            <div
              ref={uploadedDocumentRef}
              style={{ display: activeLink === "payments" ? "block" : "none" }}
            >
              <Payments applicationId={applicationId} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ViewApplication;
