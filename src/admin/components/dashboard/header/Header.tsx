import React from "react";
import userIcon from "../../../../assets/avatar.png";
import gryn_index_logo from "../../../../assets/svg/Gryn_Index _logo.svg";
import { IoIosNotifications } from "react-icons/io";
import { formatDate } from "../../../../shared/utils/dateFormat";
import useUserProfile from "../../../../shared/redux/hooks/shared/getUserProfile";

const Header: React.FC = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const { userProfile } = useUserProfile();

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
          <div className="flex items-center gap-3">
            <time dateTime={today.toISOString()}>{formattedDate}</time>
            <button className="relative" aria-label="View notifications">
              <IoIosNotifications
                className="cursor-pointer fill-green-500 dark:fill-green-300"
                size={27}
                aria-hidden="true"
              />
            </button>
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
