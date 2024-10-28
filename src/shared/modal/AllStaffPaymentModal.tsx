import { useState } from "react";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import Success from "../../assets/svg/ResetPassword.svg";
import dayjs from 'dayjs';
import DocumentPreviewModal from "./DocumentPreviewModal";
import eye from "../../assets/svg/eyeImg.svg";
import download from "../../assets/svg/download.svg";
import file from "../../assets/svg/File.svg";

const AllStaffPaymentModal = ({ isOpen, onClose, payment }: any) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  if (!payment) return null;

  const formatAmount = (amount:number) => {
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

  const hasDocuments = payment?.invoice?.document && payment.invoice.document.length > 0;

  return (
    <main className={`fixed font-outfit inset-y-0 py-2 right-0 w-[500px] bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div><img src={gryn_index_logo} alt="gryn_logo" className='w-[7em]' /></div>
            <button onClick={onClose} className="text-gray-500 text-lg hover:text-gray-700">
              &times;
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-[1.5em]">
          <div className='flex border-b py-[1em] flex-col justify-center text-center'>
            <div className='flex justify-center'>
              <img src={Success} alt="success" className='w-[5em]' />
            </div>
            <p className='font-semibold'>Payment Success!</p>
            <div className='bg-purple-white mt-[1em] py-[6px]'>
              <h1>
                <p className="font-semibold text-red-500 text-sm">{payment.status}!</p>
                <p className="font-semibold text-primary-700 mt-[4px] text-2xl">NGN
                   {payment?.invoice?.item[0]?.amount ? formatAmount(payment?.invoice?.item[0].amount) : '-'}
                   </p>
              </h1>
            </div>
          </div>

          <div className="space-y-6 flex flex-col gap-[3px]">
            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Invoice No.</p>
              <p className="font-semibold text-sm">{payment?.invoice?.invoiceNumber || '-'}</p> 
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-semibold text-sm">NGN {payment?.invoice?.item[0]?.amount ? formatAmount(payment?.invoice?.item[0].amount) : '-'}
              </p> 
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Payment Name</p>
              <p className="font-semibold text-sm">{payment?.invoice?.item?.[0]?.name || '-'}</p> 
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Payment Time/Date.</p>
              <p className="font-medium">
                {payment?.createdAt 
                  ? dayjs(payment?.createdAt).format("DD-MM-YYYY, HH:mm:ss") 
                  : '-'}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Sender Name</p>
              <p className="font-medium">
                {payment?.senderName || '-'}
              </p>
            </div>
          </div>

          {hasDocuments && payment.invoice.document.map((doc: any, index: number) => (
            <div key={doc.id} className="bg-gray-100 flex mt-[2em] px-2 items-center justify-between py-2">
              <p className="flex items-center gap-2">
                <img src={file} alt="file" />
                <span className="text-sm">Document {index + 1}</span> 
              </p>
              <div className="flex gap-[1px]">
                <button
                  onClick={() => handlePreview(doc.publicURL)}
                  className="flex items-center gap-1 rounded-full bg-white px-2 py-[3px] text-center font-medium text-[#660066]"
                >
                  <img src={eye} alt="eye" />
                  <span className="mr-3">View</span>
                </button>

                <button
                  onClick={() => handleDownload(doc.publicURL, doc.name)}
                  className="flex items-center gap-1 rounded-full bg-white px-2 py-[3px] text-center font-medium text-[#660066]"
                >
                  <img src={download} alt="download" />
                  <span className="mr-3">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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

export default AllStaffPaymentModal;
