import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { button } from "../../../../shared/buttons/Button";
import { usePermissions } from "../../../../shared/redux/hooks/admin/usePermission";
import { staffSidebarLinks } from "../../../../data/data";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { AppDispatch } from "../../../../shared/redux/store";
import { useAppDispatch } from "../../../../shared/redux/hooks/shared/reduxHooks";
import useUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";
import { logOutUser } from "../../../../shared/redux/shared/slices/shareLanding.slices";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  const { userProfile } = useUserProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside
      className={`relative flex h-screen flex-col bg-white py-6 font-outfit transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-[15em]"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hover:bg-primary-600 absolute ${
          isCollapsed ? "left-1/2 -translate-x-1/2" : "-right-3"
        } top-4 z-10 rounded-full bg-primary-700 p-1 text-white shadow-lg transition-all duration-300`}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <div className="flex h-full flex-col">
        <div
          className={`transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={gryn_index_logo}
            alt="Gryn_Index_Logo"
            className="mx-auto w-[9em]"
          />
        </div>

        <nav className={`mt-5 space-y-1 ${isCollapsed ? "px-2" : "px-4"}`}>
          {staffSidebarLinks?.map((link, index) => {
            const isActive = link.pathsToCheck.some((path) =>
              location.pathname.startsWith(path)
            );

            return (
              <div key={index} className="relative group">
                <Link
                  to={link.to}
                  className={`flex items-center rounded-lg py-2 transition-colors ${
                    isActive
                      ? "bg-purple-white font-medium text-primary-700"
                      : "text-gray-500 hover:bg-purple-white"
                  } ${isCollapsed ? "justify-center px-2" : "px-4"}`}
                >
                  <img
                    src={isActive ? link.imgActive : link.img}
                    alt={link?.text}
                    className="w-5"
                  />
                  {!isCollapsed && <span className="ml-3">{link?.text}</span>}
                </Link>
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {link.title}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={`mt-[1em] mx-auto w-[80%] transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <button.PrimaryButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-auth mt-[10px] rounded-lg px-[2em] py-[10px] font-medium text-white"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button.PrimaryButton>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
