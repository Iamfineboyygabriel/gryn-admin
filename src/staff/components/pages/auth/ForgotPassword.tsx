import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { button } from "../../../../shared/buttons/Button";
import Password from "../../../../assets/svg/ForgotPassword.svg";
import { CgAsterisk } from "react-icons/cg";
import sharedLandingServices from "../../../../shared/redux/shared/services/shareLanding.services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const Back = () => {
    navigate(-1);
  };

  const forgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_API_URL}/auth/forgot-password`;

    try {
      const response = await sharedLandingServices.forgotPassword(endpoint, {
        email,
      });

      if (response?.status === 200) {
        toast.success("Password reset link sent to your email");
        navigate(`/recovery_mail`);
      } else {
        toast.error(response?.message || "Failed to send reset link");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center text-center font-outfit">
      <header className="flex flex-col gap-[1.6em]">
        <img
          src={Password}
          alt="password_image"
          className="mx-auto cursor-pointer"
          onClick={Back}
        />
        <h1 className="text-3xl font-bold text-grey-primary">
          Forgot Password ?
        </h1>
        <p className="text-l font-normal tracking-wide text-grey">
          Recover your password by providing correctly the details below.
        </p>
      </header>
      <form
        onSubmit={forgotPassword} // Add this
        className="mt-[2em] flex flex-col gap-[1em] text-grey-primary"
      >
        <div className="m-auto w-[27em]">
          <div className="w-full">
            <label htmlFor="email" className="flex-start flex font-medium">
              Email Address
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              name="email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-25% mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <button.PrimaryButton
            className="mt-[3em] w-full rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Continue"}
          </button.PrimaryButton>
        </div>
      </form>
      <p className="mt-[2em]">
        Already have an account ?
        <span className="ml-1 font-medium text-primary-700">
          <Link to="/">Sign in here</Link>
        </span>
      </p>
    </main>
  );
};

export default ForgotPassword;
