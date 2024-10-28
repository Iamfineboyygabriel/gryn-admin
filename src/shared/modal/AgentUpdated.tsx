import { Link } from "react-router-dom";
import { button } from "../../shared/buttons/Button";
import Success from "../../assets/svg/ResetPassword.svg";

const AgentUpdated = ({ onClose }: any) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={Success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">Agent User Updated</h1>
        </header>
        <article>
          <div className="mt-[1em] text-sm font-light text-center flex flex-col gap-[5px] tracking-wide text-grey">
            <p>you have updated an agent and an account</p>
            <p>Update link has been sent to</p>
            <p className="font-semibold text-black">tundegabriel999@gmail.com</p>
          </div>
        </article>
        <Link to="/admin/dashboard/all_users">
          <button.PrimaryButton className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white">
            Proceed to Dashboard
          </button.PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default AgentUpdated;
