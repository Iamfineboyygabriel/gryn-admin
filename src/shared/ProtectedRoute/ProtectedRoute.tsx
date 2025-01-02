import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { IdleTimerProvider } from "react-idle-timer";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOutUser } from "../redux/shared/slices/shareLanding.slices";
import { AppDispatch } from "../redux/store";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleOnIdle = async () => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      const { userId } = JSON.parse(userData);
      try {
        await dispatch(logOutUser(userId)).unwrap();
        toast.info("You have been logged out due to inactivity.");
      } catch (error) {
        toast.error("Session expired.");
      }
    }

    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const token = sessionStorage.getItem("userData");
  return token ? (
    <IdleTimerProvider onIdle={handleOnIdle} timeout={5 * 60 * 1000}>
      <Outlet />
    </IdleTimerProvider>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
