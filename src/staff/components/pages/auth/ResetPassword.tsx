import { useNavigate } from "react-router";
import usePasswordToggle from "../../../../shared/utils/usePasswordToggle";
import { button } from "../../../../shared/buttons/Button";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";

const ResetPassword = () => {
  const [passwordType, togglePasswordType] = usePasswordToggle();
  const [confirmPasswordType, toggleConfirmPasswordType] = usePasswordToggle();
  const navigate = useNavigate();

  const Back = () => {
    navigate(-1);
  };

  return (
    <main className="h-screen bg-gray-100 p-[1.8em] font-outfit">
      <section className="flex h-full flex-col items-center justify-center rounded-lg bg-white">
        <img
          src={gryn_index_logo}
          alt="gryn_index_logo"
          className="mx-auto w-[11em] cursor-pointer"
          onClick={Back}
        />
        <header className="mt-[2.5em]">
          <h1 className="text-3xl font-bold text-grey-primary">
            Reset Password
          </h1>
        </header>
        <form className="mt-[2em] flex flex-col gap-[1em] text-grey-primary">
          <div className="m-auto flex w-[27em] flex-col gap-[1.5em]">
            <div className="w-full">
              <label htmlFor="password" className="flex-start flex font-medium">
                Password
              </label>
              <div className="relative flex items-center text-center">
                <input
                  name="password"
                  id="password"
                  type={passwordType}
                  className="w-25% mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {passwordType === "password" ? (
                    <MdOutlineVisibilityOff />
                  ) : (
                    <MdOutlineVisibility />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="flex-start flex font-medium"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center text-center">
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={confirmPasswordType}
                  className="w-25% mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {confirmPasswordType === "password" ? (
                    <MdOutlineVisibilityOff />
                  ) : (
                    <MdOutlineVisibility />
                  )}
                </button>
              </div>
            </div>
            <button.PrimaryButton className="mt-[2em] w-full rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white">
              Reset Password
            </button.PrimaryButton>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
