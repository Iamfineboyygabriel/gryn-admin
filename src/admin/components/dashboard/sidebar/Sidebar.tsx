import { Link, useLocation, useNavigate } from "react-router-dom";
import { button } from "../../../../shared/buttons/Button";
import logout from "../../../../assets/svg/Logout.svg";
import { adminSideBarLinks } from "../../../../data/data";
import { handleLogout } from "../../../../shared/utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-[13em] flex-col bg-white font-outfit dark:bg-gray-800">
      <nav className="flex flex-grow flex-col px-5">
        {adminSideBarLinks?.map((link: any, index: any) => {
          const isActive = link.pathsToCheck.some((path: any) =>
            location.pathname.startsWith(path)
          );

          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-4 py-3 text-lg hover:bg-purple-white dark:hover:bg-gray-700 ${
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
        <div className="mt-[4em] flex flex-col items-center justify-center rounded-lg bg-purple-deep px-3 py-4 dark:bg-gray-700">
          <img src={logout} alt="logout_image" className="mt-[1em] w-[4em]" />
          <button.PrimaryButton
            onClick={() => handleLogout(navigate)}
            className="mt-[1em] rounded-lg btn-auth px-[2.5em] py-[10px] font-medium text-white"
          >
            Log Out
          </button.PrimaryButton>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
