import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { login } from "../redux/shared/slices/shareLanding.slices";
import usePasswordToggle from "../utils/usePasswordToggle";
import { button } from "../buttons/Button";
import welcome_signup from "../../assets/png/welcomme.png";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { usePermissions } from "../redux/hooks/admin/usePermission";
import { findFirstAccessibleRouteStaff } from "../utils/findFirstAccessibleRoute";

const ROUTES = {
  STAFF_DASHBOARD: "/staff/dashboard/home",
  ADMIN_SIGNIN: "/admin_login",
  FORGOT_PASSWORD: "/forgot_password",
  APPLICATION: "/admin/dashboard/application",
  VERIFY_ACCOUNT: "/verify_account",
};

interface LoginFormData {
  email: string;
  password: string;
}

const StaffLanding: React.FC = () => {
  const [passwordType, togglePasswordType] = usePasswordToggle();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogOut = () => {
    navigate("/");
  };

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
        // const isEmailVerified = response?.data?.isEmailVerified;

        if (role === "STAFF") {
          // if (!isEmailVerified) {
          //   navigate(
          //     `/verify_account?email=${encodeURIComponent(formData.email)}`
          //   );
          //   return;
          // }

          toast.success("Welcome");
          setIsLoggedIn(true);
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
    [dispatch, formData, navigate]
  );

  useEffect(() => {
    if (isLoggedIn) {
      const accessibleRoute = findFirstAccessibleRouteStaff(hasPermission);
      if (accessibleRoute) {
        navigate(accessibleRoute);
      } else {
        setShowModal(true);
      }
    }
  }, [isLoggedIn, hasPermission, navigate]);

  const Modal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">No Accessible Pages</h2>
        <p className="mb-4">
          You don't have permission to access any pages. You will be logged out.
        </p>
        <button
          onClick={() => {
            setShowModal(false);
            handleLogOut();
          }}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <main className="fixed flex min-h-screen w-full justify-between font-outfit">
      <section
        className="flex w-[65%] flex-col justify-between p-5"
        aria-labelledby="StaffLanding-header"
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
            aria-labelledby="StaffLanding-article-header"
          >
            <header className="flex flex-col gap-[10px]">
              <h1 className="text-2xl font-medium">Staff Login</h1>
              <p className="text-grey- text-lg font-normal">
                Welcome back! Provide your login details
              </p>
              <p>
                Login as a Admin
                <span className="ml-1 font-bold text-primary-700">
                  <Link to={ROUTES.ADMIN_SIGNIN}>Click Here</Link>
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

export default StaffLanding;
