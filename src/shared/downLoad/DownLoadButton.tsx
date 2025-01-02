import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { button } from "../../shared/buttons/Button";
import upload from "../../assets/svg/Upload.svg";
import { useState } from "react";

export const DownLoadButton = ({ applicationRef }: any) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("p", "mm", "a4");

    try {
      const content = applicationRef.current;
      if (content) {
        // Store original styles
        const originalStyle = {
          height: content.style.height,
          overflow: content.style.overflow,
          maxHeight: content.style.maxHeight,
        };

        // Remove scroll temporarily
        content.style.height = "auto";
        content.style.overflow = "visible";
        content.style.maxHeight = "none";

        const canvas = await html2canvas(content, {
          scale: 2,
          logging: false,
          useCORS: true,
          windowHeight: content.scrollHeight,
          height: content.scrollHeight,
          onclone: (clonedDoc, element) => {
            element.style.height = "auto";
            element.style.overflow = "visible";
            element.style.maxHeight = "none";
          },
        });

        // Restore original styles
        content.style.height = originalStyle.height;
        content.style.overflow = originalStyle.overflow;
        content.style.maxHeight = originalStyle.maxHeight;

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add pages if content is too long
        let heightLeft = imgHeight;
        let position = 0;
        let pageHeight = 287; // A4 page height in mm

        pdf.addImage(imgData, "JPEG", 20, 20, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 20, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("applications.pdf");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <button.PrimaryButton
      onClick={downloadPDF}
      disabled={isGeneratingPDF}
      className="items-center gap-2 hidden lg:flex rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      <img src={upload} alt="upload" />
      {isGeneratingPDF ? "Generating Report..." : "Download Report"}
    </button.PrimaryButton>
  );
};
