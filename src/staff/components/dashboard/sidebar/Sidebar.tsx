import { Link, useLocation, useNavigate } from "react-router-dom";
import { staffSidebarLinks } from "../../../../data/data";
import { button } from "../../../../shared/buttons/Button";
import logout from "../../../../assets/svg/Logout.svg";
import { handleLogout } from "../../../../shared/utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-[14em] flex-col bg-white font-outfit dark:bg-gray-800">
      <nav className="flex flex-grow flex-col px-4">
        {staffSidebarLinks?.map((link: any, index: any) => {
          const isActive = link.pathsToCheck.some((path: any) =>
            location.pathname.startsWith(path)
          );

          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center px-3 py-3 text-lg hover:bg-purple-white dark:hover:bg-gray-700 ${
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
        <div className="mt-[1.5em] flex flex-col items-center justify-center rounded-lg bg-purple-deep px-3 py-4 dark:bg-gray-700">
          <img src={logout} alt="logout_image" className="mt-6 w-[4em]" />
          <button.PrimaryButton
            onClick={() => handleLogout(navigate)}
            className="btn-auth mt-[1em] rounded-lg px-[2.5em] py-[10px] font-medium text-white"
          >
            Log Out
          </button.PrimaryButton>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
