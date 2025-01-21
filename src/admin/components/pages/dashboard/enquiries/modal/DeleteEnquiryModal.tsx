import React from "react";
import question from "../../../../../../assets/svg/question.svg";
import { button } from "../../../../../../shared/buttons/Button";

interface DeleteEnquiryModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  selectedCount: number;
  isDeleting?: boolean;
  error?: string | null;
}

const DeleteEnquiryModal: React.FC<DeleteEnquiryModalProps> = ({
  onConfirm,
  onCancel,
  selectedCount,
  isDeleting = false,
  error = null,
}) => {
  return (
    <main className="px-[3em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={question} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-xl whitespace-nowrap font-semibold">
            Are you sure you want to delete Enquiry?
          </h1>
        </header>
        <article>
          <div className="mt-1 text-sm font-light text-center flex flex-col gap-[5px] tracking-wide text-grey">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCount} selected{" "}
              {selectedCount === 1 ? "enquiry" : "enquiries"}? This action
              cannot be undone.
            </p>
          </div>
        </article>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex gap-4">
          <button.PrimaryButton
            className="m-auto mt-[2em] flex justify-center gap-2 px-6 rounded-full bg-red-600 py-[10px] text-center font-medium text-white disabled:opacity-50"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button.PrimaryButton>

          <button.PrimaryButton
            className="m-auto mt-[2em] flex w-[55%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Continue"}
          </button.PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default DeleteEnquiryModal;
