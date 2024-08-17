import { button } from "../../../../../../../shared/buttons/Button";
import success from "../../../../../../../assets/svg/ResetPassword.svg";

const Success = ({ onClose }: any) => {
  return (
    <main className="px-[4em] py-[3em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col gap-[1.2em]">
          <img
            src={success}
            alt="success_img"
            className="mx-auto cursor-pointer"
          />
          <h1 className="text-center text-2xl font-semibold text-grey-primary">
            Student User Created
          </h1>
          <div className="text-center font-light text-grey">
            <p>You have created a student and an account</p>
            <p>creation link has been sent to</p>
            <p className="font-semibold text-black">iammrnigeria@gmail.com</p>
          </div>
        </header>
        <button.PrimaryButton className="m-auto mt-[1.5em] flex rounded-full bg-linear-gradient px-[1.5em] py-[7px] text-lg font-semibold text-white">
          Proceed to Dashboard
        </button.PrimaryButton>
      </div>
    </main>
  );
};

export default Success;
