import { useState } from "react";
import { button } from "../buttons/Button";
import FileUpload from "../fileUpload/FileUpload";
import { RxCrossCircled } from "react-icons/rx";
import { toast } from "react-toastify";
import { DocumentType } from "../../data/data";
import { UploadStaffInvoicePaymentDocument } from "../redux/shared/slices/shareApplication.slices";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Modal from "./Modal";
import InvoicePaymentCreated from "./InvoicePaymentCreated";
import ReactLoading from "react-loading";

const PaymentReceiptResponse = ({ invoiceId }: any) => {
  const [other_Payment, setOther_Payment] = useState<File | null>(null);
  const [error, setError] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBrowseFileClick = (inputId: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        inputElement.click();
        setTimeout(resolve, 100);
      } else {
        resolve();
      }
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!other_Payment) {
      toast.error("Please provide a file ");
      return;
    }

    const formData = new FormData();
    formData.append("file", other_Payment);
    formData.append("documentType", DocumentType.OTHER_PAYMENT);

    try {
      setLoading(true);

      await dispatch(
        UploadStaffInvoicePaymentDocument({
          invoiceId,
          data: formData,
        })
      );

      setModalOpen(true);
      setOther_Payment(null);
      setError(""); 
    } catch (error: any) {
      setError(error || "Failed to update commission payment");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Payment Response</h1>
          <p className="font-light">Enter the details of the payment</p>
        </header>
      </div>

      <form onSubmit={submitPayment} className="w-full gap-4">
        <FileUpload
          label="Upload Document(s)"
          inputId="serviceCharge"
          file={other_Payment}
          setFile={setOther_Payment}
          onFileChange={(file) => setOther_Payment(file)}
          onBrowseClick={handleBrowseFileClick}
          error={error as string}
        />

        {other_Payment && (
          <span className="rounded-full items-center py-1 px-[2em] mt-[2em] text-primary-700 bg-purple-white flex justify-between">
            <p className="font-medium">{other_Payment.name}</p>
            <RxCrossCircled size={22} onClick={() => setOther_Payment(null)} />
          </span>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2 mb-[-8px]">{error}</p>
        )}

        <div className="flex justify-center">
          <button.PrimaryButton
            className="m-auto mt-[2em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            type="submit"
            disabled={loading} 
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
                <span className="ml-2">Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button.PrimaryButton>
        </div>
      </form>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <InvoicePaymentCreated to="/admin/dashboard/home" onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default PaymentReceiptResponse;
