import React from "react";
import noData from "../../assets/svg/Transaction.svg";
import { useNavigate } from "react-router";

const Error = React.memo(({ error }: any) => {
  const navigate = useNavigate();
  if (!error) return null;
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="bottom-0 left-0 right-0 top-0 m-auto flex h-screen flex-col items-center justify-center text-center">
      <img src={noData} alt="No data" />
      <p className="mt-[1em]">{error}</p>
      <button
        className="btn-2 mt-[2em] gap-2 p-[12px]"
        onClick={handleBackClick}
      >
        Back
      </button>
    </div>
  );
});

export default Error;



