import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { button } from "../../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../../assets/svg/Upload.svg";
import PersonalDetails from "../personalDetails/PersonalDetails";
import BankDetails from "../bankDetails/BankDetails";
import UploadedDocuments from "../uploadedDocuments/UploadedDocuments";
import { findAgentByEmail } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import {
  AppDispatch,
  RootState,
} from "../../../../../../../../shared/redux/store";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ApprovePendingAgent = () => {
  const [activeLink, setActiveLink] = useState("personalDetails");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { agent, loading } = useSelector(
    (state: RootState) => state.shareApplication,
  );

  const personalDetailsRef = useRef<HTMLDivElement>(null);
  const bankDetailsRef = useRef<HTMLDivElement>(null);
  const uploadedDocumentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (email) {
      dispatch(findAgentByEmail(email));
    }
  }, [dispatch, email]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("p", "mm", "a4");
    const components = [
      { ref: personalDetailsRef, title: "Personal Details" },
      { ref: bankDetailsRef, title: "Bank Details" },
      { ref: uploadedDocumentsRef, title: "Uploaded Documents" },
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

      pdf.save("agent_application.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Pending Agent /
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
                  className={`cursor-pointer whitespace-nowrap py-3 ${
                    activeLink === "personalDetails"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("personalDetails")}
                >
                  Personal Details
                </div>
                <div
                  className={`cursor-pointer whitespace-nowrap py-3 ${
                    activeLink === "bankDetails"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("bankDetails")}
                >
                  Bank Details
                </div>
                <div
                  className={`cursor-pointer whitespace-nowrap py-3 ${
                    activeLink === "uploadedDocument"
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500"
                  }`}
                  onClick={() => setActiveLink("uploadedDocument")}
                >
                  Uploaded Documents
                </div>
              </div>
              <button.PrimaryButton
                onClick={downloadPDF}
                className="ml-[3em] lg:flex hidden items-center gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300"
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
              {activeLink === "personalDetails" && agent && (
                <PersonalDetails agentData={agent} loading={loading} />
              )}
            </div>
            <div
              ref={bankDetailsRef}
              style={{
                display: activeLink === "bankDetails" ? "block" : "none",
              }}
            >
              {activeLink === "bankDetails" && agent && (
                <BankDetails agentData={agent} loading={loading} />
              )}
            </div>
            <div
              ref={uploadedDocumentsRef}
              style={{
                display: activeLink === "uploadedDocument" ? "block" : "none",
              }}
            >
              {activeLink === "uploadedDocument" && agent && (
                <UploadedDocuments agentData={agent} />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ApprovePendingAgent;
