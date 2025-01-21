import React from "react";
import success from "../../../../../../../assets/svg/deleted.svg";
import { Link } from "react-router-dom";

const SuccessModal = ({ message, onClose }: any) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">Enquiry Deleted</h1>
        </header>
        <article>
          <div className="mt-[1em] text-sm font-light text-center flex flex-col gap-[5px] tracking-wide text-grey">
            {/* <p className="text-gray-600 mb-6">{message}</p> */}
          </div>
        </article>
      </div>
    </main>
  );
};

export default SuccessModal;
