// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { button } from "../../../../shared/buttons/Button";
// import { usePermissions } from "../../../../shared/redux/hooks/admin/usePermission";
// import { logOutUser } from "../../../../shared/redux/shared/slices/shareLanding.slices";
// import useUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../../shared/redux/store";
// import { adminSideBarLinks } from "../../../../data/data";
// import { toast } from "react-toastify";
// import { useState } from "react";
// import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
// import { Menu, X } from "lucide-react";
// import { useMessage } from "../../../../shared/redux/hooks/shared/message";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const { unreadCount } = useMessage();

//   const dispatch: AppDispatch = useDispatch();
//   const { hasPermission } = usePermissions();
//   const { userProfile } = useUserProfile();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const filteredSidebarLinks = adminSideBarLinks?.filter((link) => {
//     if (link.feature && link.page) {
//       return hasPermission(link.feature, link.page);
//     }
//     return true;
//   });

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       if (userProfile?.userId) {
//         const response = await dispatch(
//           logOutUser(userProfile.userId)
//         ).unwrap();

//         if (response.status === 200) {
//           toast.success("Logout successful");
//         }
//       }
//       sessionStorage.clear();
//       localStorage.clear();
//       navigate("/");
//     } catch (error) {
//       sessionStorage.clear();
//       localStorage.clear();
//       navigate("/");
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <aside
//       className={`relative flex h-screen flex-col bg-white py-6 font-outfit transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-[15em]"
//       }`}
//     >
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className={`hover:bg-primary-600 absolute ${
//           isCollapsed ? "left-1/2 -translate-x-1/2" : "-right-3"
//         } top-4 z-10 rounded-full bg-primary-700 p-1 text-white shadow-lg transition-all duration-300`}
//       >
//         {isCollapsed ? <Menu size={20} /> : <X size={20} />}
//       </button>

//       <div className="flex h-full flex-col">
//         <div
//           className={`transition-opacity duration-300 ${
//             isCollapsed ? "opacity-0" : "opacity-100"
//           }`}
//         >
//           <img
//             src={gryn_index_logo}
//             alt="Gryn_Index_Logo"
//             className="mx-auto w-[9em]"
//           />
//         </div>

//         <nav className={`mt-5 space-y-1 ${isCollapsed ? "px-2" : "px-4"}`}>
//           {filteredSidebarLinks?.map((link, index) => {
//             const isActive = link.pathsToCheck.some((path) =>
//               location.pathname.startsWith(path)
//             );
//             const isMessaging = link.text === "Messaging";

//             return (
//               <div key={index} className="relative group">
//                 <Link
//                   to={link.to}
//                   className={`flex items-center rounded-lg py-2 transition-colors ${
//                     isActive
//                       ? "bg-purple-white font-medium text-primary-700"
//                       : "text-gray-500 hover:bg-purple-white"
//                   } ${isCollapsed ? "justify-center px-2" : "px-4"}`}
//                 >
//                   <div className="relative">
//                     <img
//                       src={isActive ? link.imgActive : link.img}
//                       alt={link?.text}
//                       className="w-5"
//                     />
//                     {isMessaging && unreadCount > 0 && isCollapsed && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </div>
//                   {!isCollapsed && (
//                     <div className="ml-3 flex items-center">
//                       <span>{link?.text}</span>
//                       {isMessaging && unreadCount > 0 && (
//                         <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] text-center">
//                           {unreadCount}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </Link>
//                 {isCollapsed && (
//                   <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
//                     {link.title}
//                     {isMessaging && unreadCount > 0 && (
//                       <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] text-center">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//         <div
//           className={`mt-[1em] mx-auto w-[80%] transition-opacity duration-300 ${
//             isCollapsed ? "opacity-0" : "opacity-100"
//           }`}
//         >
//           <button.PrimaryButton
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className="btn-auth mx-auto w-full rounded-lg py-2 text-sm font-medium text-white"
//           >
//             Log Out
//           </button.PrimaryButton>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { button } from "../../../../shared/buttons/Button";
import { usePermissions } from "../../../../shared/redux/hooks/admin/usePermission";
import { logOutUser } from "../../../../shared/redux/shared/slices/shareLanding.slices";
import useUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../shared/redux/store";
import { adminSideBarLinks } from "../../../../data/data";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { Menu, X } from "lucide-react";
import { useMessage } from "../../../../shared/redux/hooks/shared/message";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { unreadCount } = useMessage(); // This updates in real-time! 🔥

  const dispatch: AppDispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const { userProfile } = useUserProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  const filteredSidebarLinks = adminSideBarLinks?.filter((link) => {
    if (link.feature && link.page) {
      return hasPermission(link.feature, link.page);
    }
    return true;
  });

  // Animate unread count changes
  useEffect(() => {
    if (unreadCount > prevUnreadCount && prevUnreadCount > 0) {
      // New message received - you could add a subtle animation here
      console.log(
        "📬 New unread messages detected:",
        unreadCount - prevUnreadCount
      );
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

  // Update browser favicon with unread count
  useEffect(() => {
    const updateFavicon = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw base favicon (you can customize this)
        ctx.fillStyle = "#6366f1"; // Primary color
        ctx.fillRect(0, 0, 32, 32);

        if (unreadCount > 0) {
          // Add red badge
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(16, 0, 16, 16);

          // Add count text
          ctx.fillStyle = "white";
          ctx.font = "bold 10px Arial";
          ctx.textAlign = "center";
          const countText = unreadCount > 99 ? "99+" : unreadCount.toString();
          ctx.fillText(countText, 24, 10);
        }
      }

      // Update favicon
      const favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = canvas.toDataURL("image/png");
      }
    };

    updateFavicon();
  }, [unreadCount]);

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
          {filteredSidebarLinks?.map((link, index) => {
            const isActive = link.pathsToCheck.some((path) =>
              location.pathname.startsWith(path)
            );
            const isMessaging = link.text === "Messaging";

            return (
              <div key={index} className="relative group">
                <Link
                  to={link.to}
                  className={`flex items-center rounded-lg py-2 transition-all duration-200 ${
                    isActive
                      ? "bg-purple-white font-medium text-primary-700 shadow-sm"
                      : "text-gray-500 hover:bg-purple-white hover:text-gray-700"
                  } ${isCollapsed ? "justify-center px-2" : "px-4"}`}
                >
                  <div className="relative">
                    <img
                      src={isActive ? link.imgActive : link.img}
                      alt={link?.text}
                      className="w-5"
                    />
                    {/* Collapsed view unread indicator */}
                    {isMessaging && unreadCount > 0 && isCollapsed && (
                      <span
                        className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-all duration-200 ${
                          unreadCount > prevUnreadCount ? "animate-bounce" : ""
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="ml-3 flex items-center">
                      <span>{link?.text}</span>
                      {/* Expanded view unread indicator */}
                      {isMessaging && unreadCount > 0 && (
                        <span
                          className={`ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center font-bold transition-all duration-200 ${
                            unreadCount > prevUnreadCount ? "animate-pulse" : ""
                          }`}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                </Link>

                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    {link.title}
                    {isMessaging && unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.2rem] text-center font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div
          className={`mt-[1em] mx-auto w-[80%] transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <button.PrimaryButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn-auth mx-auto w-full rounded-lg py-2 text-sm font-medium text-white"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button.PrimaryButton>
        </div>

        {/* Real-time status indicator */}
        {!isCollapsed && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Live updates
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
