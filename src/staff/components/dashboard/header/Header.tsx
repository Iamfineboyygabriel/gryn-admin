import React, { useEffect } from "react";
import userIcon from "../../../../assets/avatar.png";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { IoIosNotifications } from "react-icons/io";
import { formatDate } from "../../../../shared/utils/dateFormat";
import useUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";
import { Link } from "react-router-dom";
import { useNotification } from "../../../../shared/redux/hooks/admin/notification";

const Header: React.FC = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const { userProfile } = useUserProfile();
 
  const { notificationCount, fetchNotificationCount } = useNotification();

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000); 
    
    return () => clearInterval(interval);
  }, [fetchNotificationCount]);

  return (
    <header className="bg-white p-2 font-outfit text-grey dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between px-[1em]">
        <div className="flex items-center gap-[3em]">
          <img
            src={gryn_index_logo}
            alt="Gryn_Index_Logo"
            className="w-[9em] cursor-pointer"
          />
        </div>
        <nav
          className="flex items-center gap-3"
          aria-label="Secondary navigation"
        >
            <div className="mr-[1em] flex gap-[1em] items-center">
         <time dateTime={today.toISOString()}>{formattedDate}</time>
         <Link to="/staff/dashboard/notifications">
         <button className="relative inline-flex items-center" aria-label="View notifications">
              <IoIosNotifications
                className="cursor-pointer"
                size={27}
                aria-hidden="true"
                />
              {notificationCount?.data > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notificationCount.data > 99 ? '99+' : notificationCount.data}
                </span>
              )}
            </button>
          </Link>
         </div>
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full bg-gray-200">
              <img
                src={userProfile?.avatar?.publicURL || userIcon}
                alt="profile"
                className="rounded-full object-cover"
              />
            </div>

            <p>
              {userProfile
                ? `${userProfile?.lastName} ${userProfile?.firstName} `
                : ""}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
