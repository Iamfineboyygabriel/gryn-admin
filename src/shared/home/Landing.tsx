import { Link } from "react-router-dom";
import { signUp } from "../../data/data";
import welcome_signup from "../../assets/png/welcome_signup.png";
import { IoIosArrowForward } from "react-icons/io";
import LandingNav from "./LandingNav";

const Landing = () => {
  return (
    <main className="fixed flex min-h-screen w-full justify-between font-outfit">
      <section
        className="flex w-[65%] flex-col justify-between p-5"
        aria-labelledby="landing-header"
      >
        <div className="mx-auto w-full max-w-[80%] flex-1 items-center justify-center">
          <LandingNav />
          <article
            className="flex h-full w-full flex-col justify-center"
            aria-labelledby="landing-article-header"
          >
            <header id="landing-header">
              <h2 className="text-2xl font-normal">
                Get Started with
                <span className="gradient-text ml-2 text-3xl font-extrabold tracking-wide">
                  Gryn Index Initiative
                </span>
              </h2>
              <p className="mt-[1.2em] font-semibold text-grey-primary">
                Manage your application easily starting from now.
              </p>
            </header>
            <nav
              className="mt-[2em] flex w-[60%] flex-col gap-[2em]"
              aria-label="Sign up options"
            >
              {signUp?.map((link, index) => (
                <Link key={index} to={link?.path}>
                  <button className="to-secondary-500 flex w-full items-center justify-center rounded-lg bg-gradient-to-tr from-primary-700 via-primary-200 p-[1px]">
                    <button className="relative flex flex-1 justify-between rounded-lg bg-white px-6 py-[1.4em]">
                      <p className="gradient-text text-xl font-normal">
                        {link.text}
                      </p>
                      <IoIosArrowForward size={20} aria-hidden="true" />
                    </button>
                  </button>
                </Link>
              ))}
            </nav>
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

export default Landing;
