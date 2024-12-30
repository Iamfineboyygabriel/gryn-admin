import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../shared/redux/store";
import usePasswordToggle from "../../../../../../shared/utils/usePasswordToggle";
import { button } from "../../../../../../shared/buttons/Button";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { CgAsterisk } from "react-icons/cg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { updatePassword } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";

const Password = () => {
  const [oldPasswordType, toggleOldPasswordType] = usePasswordToggle();
  const [newPasswordType, toggleNewPasswordType] = usePasswordToggle();
  const [confirmPasswordType, toggleConfirmPasswordType] = usePasswordToggle();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const updatePasswordHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    let body = {
      newPassword,
      oldPassword,
    };
    const response: any = await dispatch(updatePassword(body));
    if (response?.payload?.status === 200) {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setLoading(false);
      toast.success(response?.payload?.message);
    } else {
      toast.error(response?.payload?.message);
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <div>
        <header>
          <h1 className="text-xl font-semibold dark:text-white">
            Change Password
          </h1>
        </header>
        <form onSubmit={updatePasswordHandler} className="mt-[1.5em] w-full">
          <div className="mt-[1em] flex flex-col gap-3 lg:w-[50%]">
            <div className="w-full">
              <label
                htmlFor="oldPassword"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:border-gray-700 dark:text-white"
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
                  className="focus:border-focus:outline-none border-border mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 dark:border-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={toggleOldPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {oldPasswordType === "password" ? (
                    <MdOutlineVisibilityOff className="dark:text-white" />
                  ) : (
                    <MdOutlineVisibility className="dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="newPassword"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                New Password
                <CgAsterisk className="text-red-500" />
              </label>
              <div className="relative flex text-center">
                <input
                  name="newPassword"
                  id="newPassword"
                  type={newPasswordType}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {newPasswordType === "password" ? (
                    <MdOutlineVisibilityOff className="dark:text-white" />
                  ) : (
                    <MdOutlineVisibility className="dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
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
                  className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordType}
                  className="absolute right-4 mt-[1em] self-center"
                >
                  {confirmPasswordType === "password" ? (
                    <MdOutlineVisibilityOff className="dark:text-white" />
                  ) : (
                    <MdOutlineVisibility className="dark:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <PrivateElement feature="SETTINGS" page="Change Password">
            <button.PrimaryButton
              className="m-auto mt-[5em] w-[30%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ReactLoading
                  color="#FFFFFF"
                  width={25}
                  height={25}
                  type="spin"
                />
              ) : (
                "Change Password"
              )}
            </button.PrimaryButton>
          </PrivateElement>
        </form>
      </div>
    </main>
  );
};

export default Password;
