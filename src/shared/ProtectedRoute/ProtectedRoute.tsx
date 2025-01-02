import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { IdleTimerProvider } from "react-idle-timer";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOutUser } from "../redux/shared/slices/shareLanding.slices";
import { AppDispatch } from "../redux/store";
import useUserProfile from "../redux/hooks/shared/getUserProfile";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { userProfile } = useUserProfile();

  const handleOnIdle = async () => {
    try {
      if (userProfile?.userId) {
        await dispatch(logOutUser(userProfile.userId)).unwrap();
        toast.info("You have been logged out due to inactivity.");
      }
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
      toast.error("Session expired.");
    }
  };

  const token = sessionStorage.getItem("userData");
  return token ? (
    <IdleTimerProvider onIdle={handleOnIdle} timeout={30 * 60 * 1000}>
      <Outlet />
    </IdleTimerProvider>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
