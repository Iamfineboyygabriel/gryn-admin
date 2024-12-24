import { button } from "../../buttons/Button";
import success from "../../../assets/svg/ResetPassword.svg";
import { Link } from "react-router-dom";

const Success = ({ onClose }: any) => {
  return (
    <main className="px-[4em] py-[1.5em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col gap-[1.2em]">
          <img
            src={success}
            alt="success_img"
            className="mx-auto cursor-pointer"
          />
          <h1 className="text-center text-2xl font-semibold text-grey-primary">
            Message Sent
          </h1>
          <div className="text-center font-light text-grey">
            <p>You have successfully reviewed and responded</p>
            <p>to an Agent appication.</p>
          </div>
        </header>
        <Link to="/admin/dashboard/home">
        <button.PrimaryButton  className="m-auto mt-[1.5em] flex rounded-full bg-linear-gradient px-[1.5em] py-[7px] text-lg font-semibold text-white">
          Proceed to Dashboard
        </button.PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default Success;
