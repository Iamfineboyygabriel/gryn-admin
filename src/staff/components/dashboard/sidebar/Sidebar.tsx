import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { button } from "../../../../shared/buttons/Button";
import logout from "../../../../assets/svg/Logout.svg";
import { usePermissions } from "../../../../shared/redux/hooks/admin/usePermission";
import { staffSidebarLinks } from "../../../../data/data";
import { AppDispatch } from "../../../../shared/redux/store";
import { useAppDispatch } from "../../../../shared/redux/hooks/shared/reduxHooks";
import UseUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";
import { logOutUser } from "../../../../shared/redux/shared/slices/shareLanding.slices";
import { toast } from "react-toastify";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  const { userProfile } = UseUserProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (userProfile?.userId) {
        const response = await dispatch(
          logOutUser(userProfile.userId)
        ).unwrap();

        if (response.status === 200) {
          toast.success("Logout successful");
        }
      }
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="flex h-screen w-[14em] flex-col bg-white font-outfit">
      <nav className="flex flex-grow flex-col px-4">
        {staffSidebarLinks?.map((link, index) => {
          const isActive = link.pathsToCheck.some((path) =>
            location.pathname.startsWith(path)
          );

          const requiresPermission = link?.feature && link.page;

          const hasAccess = requiresPermission
            ? hasPermission(link.feature, link.page)
            : true;

          if (!hasAccess) return null;

          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-3 py-2 text-lg hover:bg-purple-white dark:hover:bg-gray-700 ${
                isActive
                  ? "bg-purple-white text-lg font-medium text-primary-700 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500"
              }`}
            >
              <img
                src={isActive ? link.imgActive : link.img}
                alt={link?.text}
                className="mr-3"
              />
              {link?.text}
            </Link>
          );
        })}
        <div className="mt-[1.2em] flex flex-col items-center justify-center rounded-lg bg-purple-deep px-3 py-4 dark:bg-gray-700">
          <img src={logout} alt="logout_image" className="mt-2 w-[4em]" />
          <button.PrimaryButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-auth mt-[10px] rounded-lg px-[2em] py-[10px] font-medium text-white"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button.PrimaryButton>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
