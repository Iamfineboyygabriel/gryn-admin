import React from 'react';
import { button } from "../../buttons/Button";
import { LuEye } from "react-icons/lu";

const ApplicationSummary = ({ onClose, documents, personalDetails, degree }:any) => {
  return (
    <main className="px-[4em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col">
          <h1 className="m-auto text-2xl font-semibold">Application Summary</h1>
          <div className="mt-[1em] text-center font-light text-grey">
            <p>Kindly Preview The Application Response</p>
            <p>Before Proceeding.</p>
          </div>
        </header>
        <div className="mt-[1em] flex flex-col gap-[1em]">
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Personal Details</p>
            <LuEye className="text-primary-700" size={20} />
          </button>
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Degree</p>
            <LuEye className="text-primary-700" size={20} />
          </button>
          <div className="h-auto w-full gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <header>
              <h1 className="font-medium">Uploaded Documents</h1>
            </header>
            <div className="mt-[1em] flex flex-col gap-[1em]">
              {documents.map((doc:any, index:number) => (
                <div key={index} className="flex w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <p>{doc.documentType}</p>
                    <LuEye className="text-primary-700" size={20} />
                  </div>
                  <p>{doc.status}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full bg-error px-[3em] py-[8px] text-center font-medium text-white"
              onClick={onClose}
            >
              Cancel
            </button.PrimaryButton>
            <button.PrimaryButton
              className="rounded-full bg-linear-gradient px-[2em] py-[8px] text-center font-medium text-white"
            >
              Submit Response
            </button.PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplicationSummary;