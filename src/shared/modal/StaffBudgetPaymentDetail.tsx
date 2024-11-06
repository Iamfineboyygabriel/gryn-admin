import React, { useEffect, useState } from "react";
import Success from "../../assets/svg/Success-Icon.svg";
import dayjs from "dayjs";
import background from "../../assets/svg/budget-icon.svg"
import DocumentPreviewModal from "./DocumentPreviewModal";
import eye from "../../assets/svg/eyeImg.svg";
import download from "../../assets/svg/download.svg";
import file from "../../assets/svg/File.svg"

interface BudgetPaymentDetailProps {
  budgetId: string;
  onClose: () => void;
  budgets: any | null;
  onApproved: (budgetId: string) => void;
  isSuperAdmin: boolean;
}

const BudgetPaymentDetail: React.FC<BudgetPaymentDetailProps> = ({ 
  budgetId, 
  onClose, 
  budgets, 
}) => {
  console.log("bb",budgets)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [budget, setBudget] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (budgets?.data && budgetId) {
      const foundBudget = budgets?.data?.find((b: any) => b?.id === budgetId);
      if (foundBudget) {
        setBudget(foundBudget);
        const total = foundBudget?.BudgetItem.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        setTotalAmount(total);
      }
    }
  }, [budgetId, budgets]);

  const isPaid = budget?.status === 'PAID';

  const handleDownload = (url: string, fileName: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error('Download failed:', error));
  };
  
  const getFileTypeFromUrl = (url: string) => {
    const segments = url?.split("/");
    const fileExtension = segments?.pop()?.split(".")?.pop();
    switch (fileExtension) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "application/octet-stream";
    }
  };

  const handlePreview = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    if (fileType === "application/pdf") {
      url += "&viewer=pdf";
    }
    setPreviewUrl(url);
    setPreviewFileType(fileType);
    setIsPreviewOpen(true);
  };
     
  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  const formatAmount = (amount: number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main className="fixed font-outfit inset-y-0 overflow-auto px-4 py-4 right-0 w-[500px] bg-white shadow-lg">
      <div className="h-full flex flex-col">
        <button onClick={onClose} className="text-gray-500 text-lg hover:text-gray-700 absolute top-4 right-4">
          &times;
        </button>
        
        {!isPaid ? (
          <>
            <img src={background} alt="Budget background" className="w-full" />
          </>
        ) : (
          <div className="flex-grow overflow-y-auto px-[1.5em]">
            <div className="flex border-b py-[1em] flex-col justify-center text-center">
              <div className="flex justify-center">
                <img src={Success} alt="success" className="w-[5em]" />
              </div>
              <p className="font-semibold">Payment Success!</p>
              <div className="bg-purple-white mt-[1em] py-[6px]">
                <p className="font-semibold text-sm text-red-500">
                  {budget?.paymentType || '-'}
                </p>
                <div>
                  <p className="font-semibold text-primary-700 text-2xl">
                    NGN {formatAmount(totalAmount)}
                  </p>
                </div>
              </div>

              <hr className="mt-5"/>

              <div className="mt-8 flex justify-between">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{budget?.location || '-'}</p>
              </div>

              <hr className="underline mt-8 border-dashed"/>

              <div className="space-y-6 flex flex-col gap-[3px] mt-4">
                {budget?.BudgetItem.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <p className="text-sm text-gray-500">{item.name}</p>
                    <p className="font-medium">NGN {item.amount ? formatAmount(item.amount) : '-'}</p>
                  </div>
                ))}
                {/* Add total row */}
                <div className="flex justify-between py-2 border-t border-dashed">
                  <p className="text-sm font-semibold text-gray-700">Total Amount</p>
                  <p className="font-semibold text-primary-700">NGN {formatAmount(totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <p className="text-sm text-gray-500">Time/Date</p>
              <p className="font-medium">{dayjs(budget?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
            
            <div className='flex mt-4 justify-between'>
              <p className="text-sm text-gray-500">Sender Name</p>
              <p className="font-medium">
                {budget?.staffPayment?.senderName || '-'}
              </p>
            </div>

            {budget?.document?.length > 0 && (
              <div className="bg-gray-100 flex mt-[1.5em] px-2 items-center justify-between py-3">
                <p className="flex items-center gap-2">
                  <img src={file} alt="file" />
                  <span className="text-sm">Document Attached</span>
                </p>
                <div className="flex gap-[2px]">
                  <button
                    onClick={() => handlePreview(budget?.document[0]?.publicURL)}
                    className="flex items-center gap-1 rounded-full bg-white px-2 py-[3px] text-center font-medium text-[#660066]"
                  >
                    <img src={eye} alt="eye" />
                    <span className="mr-3">View</span>
                  </button>

                  <button
                    onClick={() => handleDownload(budget?.document?.publicURL, budget?.document?.name)}
                    className="flex items-center gap-1 rounded-full bg-white px-2 py-[3px] text-center font-medium text-[#660066]"
                  >
                    <img src={download} alt="download" />
                    <span className="mr-3">Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default BudgetPaymentDetail;