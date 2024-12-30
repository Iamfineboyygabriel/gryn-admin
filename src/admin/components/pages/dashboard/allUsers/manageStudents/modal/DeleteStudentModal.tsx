import React from "react";
import question from "../../../../../../../assets/svg/question.svg";
import { button } from "../../../../../../../shared/buttons/Button";

const DeleteStudentModal = ({ onConfirm, onCancel, selectedCount }: any) => {
  return (
    <main className="px-[3em] font-outfit">
      <div className="m-auto w-[24em] flex flex-col justify-center py-[2em] text-center">
        <img src={question} alt="success_img" className="m-auto" />
        <header className="mt-[2em] text-center justify-center flex flex-col">
          {/* <h1 className="text-2xl text-center whitespace-nowrap font-semibold">
            Are you sure you want to delete Student ?
          </h1> */}
          <h1 className="text-xl font-semibold">
            Are you sure you want to delete Student ?
          </h1>
        </header>
        <article>
          <div className="mt-1 text-sm font-light text-center flex flex-col gap-[5px] tracking-wide text-grey">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCount} selected student{" "}
              {selectedCount === 1 ? "member" : "members"}? This action cannot
              be undone.
            </p>
          </div>
        </article>
        <div className="flex gap-4">
          <button.PrimaryButton
            className="m-auto mt-[2em] flex justify-center gap-2 px-6 rounded-full bg-red-600 py-[10px] text-center font-medium text-white"
            onClick={onCancel}
          >
            Cancel
          </button.PrimaryButton>

          <button.PrimaryButton
            className="m-auto mt-[2em] flex w-[55%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white"
            onClick={onConfirm}
          >
            Continue
          </button.PrimaryButton>
        </div>
      </div>
    </main>
  );
};
export default DeleteStudentModal;
