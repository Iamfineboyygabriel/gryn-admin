import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { button } from "../../shared/buttons/Button";
import upload from "../../assets/svg/Upload.svg";
import { useState } from "react";

export const DownLoadButton = ({ applicationRef }: any) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF("l", "mm", "a4"); // Switch to landscape

    try {
      const content = applicationRef.current;
      if (content) {
        const table = content.querySelector("table");
        const originalStyles = {
          height: content.style.height,
          overflow: content.style.overflow,
          maxHeight: content.style.maxHeight,
          width: content.style.width,
          tableWidth: table.style.width,
        };

        // Temporarily modify styles for full capture
        content.style.height = "auto";
        content.style.overflow = "visible";
        content.style.maxHeight = "none";
        content.style.width = "auto";
        table.style.width = "auto";

        const canvas = await html2canvas(content, {
          scale: 1.5,
          logging: false,
          useCORS: true,
          windowWidth: table.scrollWidth,
          width: table.scrollWidth,
          height: content.scrollHeight,
          onclone: (clonedDoc, element) => {
            const clonedTable = element.querySelector("table");
            if (!clonedTable) return;

            element.style.height = "auto";
            element.style.overflow = "visible";
            element.style.maxHeight = "none";
            element.style.width = "auto";
            clonedTable.style.width = "auto";
          },
        });

        // Restore original styles
        content.style.height = originalStyles.height;
        content.style.overflow = originalStyles.overflow;
        content.style.maxHeight = originalStyles.maxHeight;
        content.style.width = originalStyles.width;
        table.style.width = originalStyles.tableWidth;

        const imgData = canvas.toDataURL("image/jpeg", 1);
        const pageWidth = 277; // A4 landscape width
        const pageHeight = 190; // A4 landscape height
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
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
