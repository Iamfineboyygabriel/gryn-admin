import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DocumentType } from "../../../../../../../data/data";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import FileUpload from "../../../../../../../shared/fileUpload/FileUpload";
import { RxCrossCircled } from "react-icons/rx";
import { uploadCommissionPayment } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import {
  AppDispatch,
  RootState,
} from "../../../../../../../shared/redux/store";
import CommissionCreated from "../../../../../../../shared/modal/CommissionCreated";
import { formatAmountWithCommas } from "../../../../../../../shared/utils/dateFormat";

interface StudentData {
  id: number;
  firstName: string;
  lastName: string;
  degree: {
    university: string;
    degreeType: string;
    applicationId: number;
  };
}

const NewPayment: React.FC = () => {
  const [commissionReceipt, setCommissionReceipt] = useState<File | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const studentData: StudentData = location.state?.studentData;

  const { status, error } = useSelector(
    (state: RootState) => state.shareApplication
  );

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      setAmount(formatAmountWithCommas(rawValue));
    }
  };

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!commissionReceipt || !amount) {
      toast.error("Please provide both file and amount");
      return;
    }

    const formData = new FormData();
    formData.append("file", commissionReceipt);
    formData.append("amount", amount.replace(/,/g, ""));
    formData.append("documentType", DocumentType.COMMISSION_RECEIPT);

    try {
      await dispatch(
        uploadCommissionPayment({
          applicationId: studentData.degree.applicationId.toString(),
          data: formData,
        })
      );

      setModalOpen(true);
      setCommissionReceipt(null);
      setAmount("");
    } catch (error) {
      toast.error("Failed to update commission payment");
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Commission</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Agent Commission /{" "}
            <span className="text-primary-700">New Commission</span>
          </p>
          <button.PrimaryButton className="btn-2" onClick={() => navigate(-1)}>
            Back
          </button.PrimaryButton>
        </div>
        <div className="mt-[2em]">
          <div className="grid w-[78%] grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="studentName"
                className="text-sm font-medium text-grey-primary"
              >
                Student Name
              </label>
              <input
                name="studentName"
                id="studentName"
                type="text"
                readOnly
                value={studentData?.firstName}
                className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="university"
                className="text-sm font-medium text-grey-primary"
              >
                University
              </label>
              <input
                name="university"
                id="university"
                type="text"
                readOnly
                value={studentData?.degree?.university}
                className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="degree"
                className="text-sm font-medium text-grey-primary"
              >
                Degree
              </label>
              <input
                name="degree"
                id="degree"
                type="text"
                readOnly
                value={studentData?.degree?.degreeType}
                className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
              />
            </div>
          </div>

          <form onSubmit={submitPayment}>
            <div className="flex flex-col mt-[2em]">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-grey-primary"
              >
                Amount
              </label>
              <input
                name="amount"
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="mt-[11px] rounded-lg border-[1px] w-[39%] p-3 focus:outline-none"
              />
            </div>

            <div className="mt-[1.5em] grid w-[80%] grid-cols-2 gap-4">
              <FileUpload
                label="Upload Document(s)"
                inputId="serviceCharge"
                file={commissionReceipt}
                setFile={setCommissionReceipt}
                onFileChange={(file) => setCommissionReceipt(file)}
                onBrowseClick={handleBrowseFileClick}
                error={error as string}
                success={status === "succeeded"}
              />
            </div>

            {commissionReceipt && (
              <span className="rounded-full items-center py-1 px-[2em] w-[39%] mt-[2em] text-primary-700 bg-purple-white flex justify-between">
                <p className="font-medium">{commissionReceipt.name}</p>
                <RxCrossCircled
                  size={22}
                  onClick={() => setCommissionReceipt(null)}
                />
              </span>
            )}

            <button.PrimaryButton
              className="mt-[5em] flex w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[12px] text-center font-medium text-white"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <div className="mr-auto flex">
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                </div>
              ) : (
                "Pay Commission"
              )}
            </button.PrimaryButton>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <CommissionCreated
            to="/admin/dashboard/all_users"
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
};

export default NewPayment;
