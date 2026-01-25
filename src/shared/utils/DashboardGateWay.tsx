import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../redux/shared/slices/shareLanding.slices";
import { AppDispatch } from "../redux/store";
import { toast } from "react-toastify";

interface DashboardGatewayProps {
  children: React.ReactNode;
}

const DashboardGateway: React.FC<DashboardGatewayProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: any) => state.shared.user);

  const handleLogOut = async () => {
    if (!user?.id) {
      console.error("User ID not available for logout");
      navigate("/");
      return;
    }

    try {
      setIsLogoutLoading(true);
      const result = await dispatch(logOutUser(user.id)).unwrap();
      console.log("Logout successful:", result);
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      navigate("/");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  useEffect(() => {
    const checkAccess = () => {

      if (!user) {
        console.error("User not available");
        navigate("/admin_login");
        return;
      }

      if (user.role === "SUPER_ADMIN") {
        setHasAccess(true);
        return;
      }

      const hasAnyPermission = user.page.some(
        (p: any) => p.pages && p.pages.length > 0
      );

      if (!hasAnyPermission) {
        setShowModal(true);
      } else {
        setHasAccess(true);
      }

    };

    checkAccess();
  }, [user, navigate]);

  const Modal = () => (
    <div className="fixed inset-0 font-outfit bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[30em] p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">No Accessible Pages</h2>
        <p className="mb-4">
          You lack required permissions. Please log out now to ensure successful
          future login attempts.
        </p>
        <button
          onClick={handleLogOut}
          disabled={isLogoutLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-primary-800 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {isLogoutLoading ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );

  if (showModal) {
    return <Modal />;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default DashboardGateway;
