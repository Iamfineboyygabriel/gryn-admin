import { button } from "../../../../shared/buttons/Button";
import Success from "../../../../assets/svg/ResetPassword.svg";
import { Link } from "react-router-dom";

const PasswordSuccessful = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center text-center font-outfit">
      <header className="flex flex-col gap-[1.6em]">
        <img
          src={Success}
          alt="success_img"
          className="mx-auto cursor-pointer"
        />
        <h1 className="text-3xl font-bold text-grey-primary">
          Password Changed
        </h1>
        <div className="text-xl font-light tracking-wide text-grey">
          <p>You have successfully changed your password.</p>
          <p>You can proceed to login to your dashboard.</p>
        </div>
      </header>
      <Link to="/">
      <button.PrimaryButton className="mt-[2em] w-[25%] rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white">
        Proceed to Login
      </button.PrimaryButton>
      </Link>
    </main>
  );
};

export default PasswordSuccessful;
