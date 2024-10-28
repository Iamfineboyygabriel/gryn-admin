import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import ReactLoading from "react-loading";
import { AppDispatch } from "../../../../shared/redux/store";
import usePasswordToggle from "../../../../shared/utils/usePasswordToggle";
import { resetPassword } from "../../../../shared/redux/shared/slices/shareLanding.slices";
import { button } from "../../../../shared/buttons/Button";

const ResetPassword = () => {
  const [passwordType, togglePasswordType] = usePasswordToggle();
  const [confirmPasswordType, toggleConfirmPasswordType] = usePasswordToggle();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const Back = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link");
      return;
    }

    try {
      setLoading(true);
      await dispatch(resetPassword({ token, email, password })).unwrap();
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="mt-[2em] flex flex-col gap-[1em] text-grey-primary">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-25% mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  disabled={loading}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-25% mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  disabled={loading}
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
            <button.PrimaryButton
              className="mt-[1em] rounded-full bg-linear-gradient px-2 py-[13px] text-lg font-semibold text-white"
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
                "Reset Password"
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;