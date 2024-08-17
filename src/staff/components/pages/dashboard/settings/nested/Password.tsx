import usePasswordToggle from "../../../../../../shared/utils/usePasswordToggle";
import { button } from "../../../../../../shared/buttons/Button";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { CgAsterisk } from "react-icons/cg";
import { useState } from "react";

const Password = () => {
  const [oldPasswordType, toggleOldPasswordType] = usePasswordToggle();
  const [newPasswordType, toggleNewPasswordType] = usePasswordToggle();
  const [confirmPasswordType, toggleConfirmPasswordType] = usePasswordToggle();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  return (
    <main>
      <div>
        <header>
          <h1 className="text-xl font-semibold">Change Password</h1>
        </header>
        <form className="mt-[1.5em] w-full">
          <div className="mt-[1em] flex flex-col gap-3 lg:w-[50%]">
            <div className="w-full">
              <label
                htmlFor="oldPassword"
                className="flex-start flex gap-3 font-medium text-grey-primary"
              >
                Old Password
                <CgAsterisk className="text-red-500" />
              </label>
              <div className="relative flex text-center">
                <input
                  name="oldPassword"
                  id="oldPassword"
                  type={oldPasswordType}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="focus:border-focus:outline-none border-border mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3"
                />
                <button
                  type="button"
                  onClick={toggleOldPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {oldPasswordType === "password" ? (
                    <MdOutlineVisibilityOff />
                  ) : (
                    <MdOutlineVisibility />
                  )}
                </button>
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="newPassword"
                className="flex-start flex gap-3 font-medium text-grey-primary"
              >
                New Password
                <CgAsterisk className="text-red-500" />
              </label>
              <div className="relative flex text-center">
                <input
                  name="newPassword"
                  id="newPassword"
                  type={newPasswordType}
                  onClick={toggleConfirmPasswordType}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {newPasswordType === "password" ? (
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
                className="flex-start flex gap-3 font-medium text-grey-primary"
              >
                Confirm New Password
                <CgAsterisk className="text-red-500" />
              </label>
              <div className="relative flex items-center text-center">
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={confirmPasswordType}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
          </div>

          <button.PrimaryButton
            className="m-auto mt-[5em] w-[30%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
            type="submit"
          >
     
              Change Password
         </button.PrimaryButton>
        </form>
      </div>
    </main>
  );
};

export default Password;
