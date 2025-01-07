import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { AppDispatch } from "../redux/store";
import usePasswordToggle from "../utils/usePasswordToggle";
import { login, logOutUser } from "../redux/shared/slices/shareLanding.slices";
import { usePermissions } from "../redux/hooks/admin/usePermission";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { findFirstAccessibleRoute } from "../utils/findFirstAccessibleRoute";
import { button } from "../buttons/Button";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import welcome_signup from "../../assets/png/welcomme.png";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import useUserProfile from "../redux/hooks/shared/getUserProfile";

const ROUTES = {
  ADMIN_DASHBOARD: "/admin/dashboard/home",
  STAFF_SIGNIN: "/staff_login",
  FORGOT_PASSWORD: "/forgot_password",
  APPLICATION: "/admin/dashboard/application",
  ADMIN_LOGIN: "/admin_login",
  VERIFY_ACCOUNT: "/verify_account",
};

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [passwordType, togglePasswordType] = usePasswordToggle();
  const [autoLogoutTimer, setAutoLogoutTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const { userProfile } = useUserProfile();
  console.log("uu");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { hasPermission } = usePermissions();

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logOutUser(userProfile?.id));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    return () => {
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
    };
  }, [autoLogoutTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const loginUserData = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await dispatch(login(formData)).unwrap();
        const role = response?.data?.role;
        const isEmailVerified = response?.data?.isEmailVerified;

        if (role) {
          sessionStorage.setItem("userRole", role);
        }

        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          if (role === "ADMIN" && !isEmailVerified) {
            navigate(
              `/verify_account?email=${encodeURIComponent(formData.email)}`
            );
            return;
          }

          toast.success("Welcome");
          const accessibleRoute = findFirstAccessibleRoute(hasPermission);
          if (accessibleRoute) {
            navigate(accessibleRoute);
          } else {
            setShowModal(true);
            const timer = setTimeout(() => {
              handleLogout();
            }, 3000);
            setAutoLogoutTimer(timer);
          }
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error: any) {
        if (error) {
          toast.error(error);
        } else {
          toast.error("Network error: please check your internet connection");
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, formData, navigate, hasPermission, handleLogout]
  );

  const Modal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-[90%]">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            No Accessible Pages
          </h2>
          <p className="text-gray-600 text-center">
            You don't have permission to access any pages. You will be
            automatically logged out in a few seconds.
          </p>
          <button
            onClick={() => {
              setShowModal(false);
              handleLogout();
            }}
            className="w-full bg-[#660066] hover:bg-[#581c87] text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <main className="fixed flex min-h-screen w-full justify-between font-outfit">
      <section
        className="flex w-[65%] flex-col justify-between p-5"
        aria-labelledby="AdminLogin-header"
      >
        <div className="mx-auto w-full max-w-[80%] flex-1 items-center justify-center">
          <Link to="/">
            <img
              src={gryn_index_logo}
              alt="gryn_index_logo"
              className="w-[11em] cursor-pointer"
            />
          </Link>
          <article
            className="flex h-full w-full flex-col justify-center"
            aria-labelledby="AdminLogin-article-header"
          >
            <header className="flex flex-col gap-[10px]">
              <h1 className="text-2xl font-medium">Admin Login</h1>
              <p className="text-grey- text-lg font-normal">
                Welcome back! Provide your login details
              </p>
              <p>
                Login as a Staff
                <span className="ml-1 font-bold text-primary-700">
                  <Link to={ROUTES.STAFF_SIGNIN}>Click Here</Link>
                </span>
              </p>
            </header>
            <div className="w-full md:max-w-[60%]">
              <form
                className="mt-[1.5em] flex flex-col gap-[1em] text-grey-primary md:mt-[2em]"
                onSubmit={loginUserData}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="flex-start flex font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    disabled={loading}
                    onChange={handleInputChange}
                    value={formData.email}
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="flex-start flex font-medium"
                  >
                    Enter Password
                  </label>
                  <div className="relative flex items-center text-center">
                    <input
                      name="password"
                      id="password"
                      type={passwordType}
                      required
                      disabled={loading}
                      onChange={handleInputChange}
                      value={formData.password}
                      className="mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
                <div className="flex w-full justify-end">
                  <p className="font-semibold text-primary-700">
                    <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
                  </p>
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
                    "Login"
                  )}
                </button.PrimaryButton>
              </form>
            </div>
          </article>
        </div>
      </section>
      <aside className="fixed bottom-0 right-0 top-0 hidden w-[35%] md:block">
        <img
          src={welcome_signup}
          alt="Welcome to Gryn Index Initiative"
          className="h-full w-full"
        />
      </aside>
      {showModal && <Modal />}
    </main>
  );
};

export default AdminLogin;
