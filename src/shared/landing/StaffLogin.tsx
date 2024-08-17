import { Link } from "react-router-dom";
import welcome_signup from "../../assets/png/welcome_signup.png";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import { button } from "../buttons/Button";
import usePasswordToggle from "../utils/usePasswordToggle";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";


const StaffLanding = () => {
  const [passwordType, togglePasswordType] = usePasswordToggle();

  return (
    <main className="fixed flex min-h-screen w-full justify-between font-outfit">
      <section
        className="flex w-[65%] flex-col justify-between p-5"
        aria-labelledby="StaffLanding-header"
      >
        <div className="mx-auto w-full max-w-[80%] flex-1 items-center justify-center">
      <img
        src={gryn_index_logo}
        alt="gryn_index_logo"
        className="w-[11em] cursor-pointer"
      />
          <article
            className="flex h-full w-full flex-col justify-center"
            aria-labelledby="StaffLanding-article-header"
          >
           <header className="flex flex-col gap-[10px]">
              <h1 className="text-2xl font-medium">Staff Login</h1>
              <p className="text-grey- text-lg font-normal">
                Welcome back! Provide your login details
              </p>
              <p>
                Login as a Admin
                <span className="ml-1 font-bold text-primary-700">
                  <Link to="/admin_login">Click Here</Link>
                </span>
              </p>
            </header>
            <div className="w-full max-w-[60%]">
              <form
                className="mt-[2em] flex flex-col gap-[1em] text-grey-primary"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="flex-start flex font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="flex-start flex font-medium"
                  >
                    Enter 
                  </label>
                  <div className="relative flex items-center text-center">
                    <input
                      name="password"
                      id="password"
                      type={passwordType}
                      className="mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordType}
                      className="absolute right-4 mt-[1em] self-center"
                    >
                      {passwordType === "password" ? (
                        <MdOutlineVisibilityOff />
                      ) : (
                        <MdOutlineVisibility />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  <p className="font-semibold text-primary-700">
                    <Link to="/forgot_Password">Forgot Password ?</Link>
                  </p>
                </div>

                <button.PrimaryButton
                  className="mt-[1em] rounded-full bg-linear-gradient px-2 py-[13px] text-lg font-semibold text-white"
                  type="submit"
                >
             
                    Login
                </button.PrimaryButton>
              </form>
            </div>
          </article>
        </div>
      </section>
      <aside className="h-screen w-[35%]" aria-label="Welcome image">
        <img
          src={welcome_signup}
          alt="Welcome to Gryn Index Initiative"
          className="h-full w-full"
        />
      </aside>
    </main>
  );
};

export default StaffLanding;
