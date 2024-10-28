import { Link } from "react-router-dom";
import Success from "../../assets/svg/ResetPassword.svg";
import { button } from "../../shared/buttons/Button";

interface ApplicationUpdatedProps {
  onClose?: () => void;
  to: string;
}

const ApplicationUpdated = ({ onClose, to }: ApplicationUpdatedProps) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={Success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">Application Updated</h1>
        </header>
        <article>
          <div className="mt-[1.5em] text-sm font-light text-center tracking-wide text-grey dark:text-white">
            <p>You have updated an application successfully </p>
          </div>
        </article>
        <Link to={to}>
          <button.PrimaryButton className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white">
            Proceed to Dashboard
          </button.PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default ApplicationUpdated;
