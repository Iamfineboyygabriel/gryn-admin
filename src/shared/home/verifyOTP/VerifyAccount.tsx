import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { button } from "../../buttons/Button";
import welcome from "../../../assets/png/welcome_signup.png";
import gryn_index_logo from "../../../assets/svg/Gryn_Index _logo.svg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { logOutUser } from "../../redux/shared/slices/shareLanding.slices";
import sharedLandingServices, {
  verifyUser,
} from "../../redux/shared/services/shareLanding.services";
import OTPInput from "react-otp-input";
import useUserProfile from "../../redux/hooks/shared/getUserProfile";
import { usePermissions } from "../../redux/hooks/admin/usePermission";
import {
  findFirstAccessibleRoute,
  findFirstAccessibleRouteStaff,
} from "../../utils/findFirstAccessibleRoute";

const TIMEOUT_DURATION = 30 * 1000;

const VerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);
  const [canResend, setCanResend] = useState(false);
  const [pageTimeout, setPageTimeout] = useState(TIMEOUT_DURATION / 1000);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { userProfile } = useUserProfile();
  const { hasPermission } = usePermissions();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timeLeft]);

  useEffect(() => {
    let timeoutTimer: NodeJS.Timeout | undefined;

    if (pageTimeout > 0) {
      timeoutTimer = setInterval(() => {
        setPageTimeout((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      handleTimeout();
    }

    return () => {
      if (timeoutTimer) {
        clearInterval(timeoutTimer);
      }
    };
  }, [pageTimeout]);

  const handleTimeout = async () => {
    if (userProfile?.userId) {
      try {
        await dispatch(logOutUser(userProfile.userId)).unwrap();
        toast.info("Session expired. Please try again.");
      } catch (error) {
        toast.error("Error during logout. Please try again.");
      }
    }
    navigate("/");
  };

  const handleLogOut = () => {
    if (userProfile?.userId) {
      dispatch(logOutUser(userProfile.userId));
      sessionStorage.removeItem("userRole");
    }
    navigate("/");
  };

  const Modal = () => (
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

  const handleTokenChange = (tokenValue: string) => {
    setToken(tokenValue);
  };

  const verifyUserData = async () => {
    setLoading(true);
    try {
      const endpoint = `/auth/verify-account?email=${email}`;
      const response = await verifyUser(endpoint, { token });

      if (response.status === 200) {
        toast.success("Account Verified Successfully");

        const userRole = sessionStorage.getItem("userRole");

        if (!userRole) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        switch (userRole) {
          case "ADMIN":
          case "SUPER_ADMIN": {
            const accessibleRoute = findFirstAccessibleRoute(hasPermission);
            if (accessibleRoute) {
              navigate(accessibleRoute);
            } else {
              setShowModal(true);
            }
            break;
          }
          case "STAFF": {
            const accessibleRoute =
              findFirstAccessibleRouteStaff(hasPermission);
            if (accessibleRoute) {
              navigate(accessibleRoute);
            } else {
              setShowModal(true);
            }
            break;
          }
          default:
            navigate("/");
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendToken = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const endpoint = `${process.env.REACT_APP_API_URL}/auth/request-email-verification`;

    try {
      const response: any = await sharedLandingServices.resendToken(endpoint, {
        email,
      });
      if (response?.status === 200) {
        toast.success("Verification code resent successfully.");
        setTimeLeft(60);
        setCanResend(false);
      } else {
        const errorMessage = response?.message;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const landingPage = () => {
    navigate("/");
  };

  return (
    <main className="fixed flex min-h-screen w-full justify-between font-outfit">
      <section
        className="flex w-full flex-col justify-between p-5 md:w-2/3 lg:w-[65%]"
        aria-labelledby="landing-header"
      >
        <div className="mx-auto w-full max-w-[80%] flex-1 items-center justify-center lg:max-w-[65%]">
          <nav className="mb-4 flex w-full justify-between">
            <img
              src={gryn_index_logo}
              alt="Gryn_Index_Logo"
              className="w-[8em] cursor-pointer md:w-[10em] lg:w-[11em]"
              onClick={landingPage}
            />
            <div className="text-gray-500">
              Time remaining: {Math.floor(pageTimeout / 60)}:
              {pageTimeout % 60 < 10 ? "0" : ""}
              {pageTimeout % 60}
            </div>
          </nav>
          <article className="flex h-full w-full flex-col justify-center text-grey-primary">
            <header>
              <h1 className="text-xl font-medium text-black md:text-2xl lg:text-3xl">
                Verify your Account
              </h1>
              <p className="mt-4 font-medium md:mt-5">
                Enter the 4-digit OTP authorization sent to your registered
                email
              </p>
            </header>
            <div className="mt-5 md:mt-6">
              <div className="flex space-x-3 md:space-x-5" data-hs-pin-input="">
                <OTPInput
                  skipDefaultStyles
                  value={token}
                  onChange={handleTokenChange}
                  containerStyle="gap-2 md:gap-3 my-5"
                  numInputs={4}
                  inputStyle="block h-[45px] w-[45px] md:h-[50px] md:w-[50px] lg:h-[55px] lg:w-[55px] text-center border border-gray-300 rounded-md text-sm placeholder:text-gray-300 focus:border-red-500 dark:focus:border-red-500"
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <p>
                Didn't receive code?
                {canResend ? (
                  <button
                    onClick={resendToken}
                    className="ml-1 font-semibold text-primary-700"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="ml-1 font-medium text-primary-700">
                    {timeLeft}s
                  </span>
                )}
              </p>
            </div>
            <button.PrimaryButton
              className="mt-8 w-[80%] rounded-full bg-linear-gradient px-2 py-3 text-lg font-semibold text-white md:mt-10 md:w-[85%] md:py-[13px] lg:w-[90%]"
              onClick={verifyUserData}
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
                "Verify Account"
              )}
            </button.PrimaryButton>
          </article>
        </div>
      </section>
      <aside
        className="hidden h-screen md:block md:w-1/3 lg:w-[35%]"
        aria-label="Welcome image"
      >
        <img
          src={welcome}
          alt="Welcome"
          className="h-full w-full object-cover"
        />
      </aside>
      {showModal && <Modal />}
    </main>
  );
};

export default VerifyAccount;
