import { Link } from "react-router-dom";
import { button } from "../../shared/buttons/Button";
import Success from "../../assets/svg/ResetPassword.svg";

const Processing = ({onClose}:any) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={Success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">Processing Document...</h1>
        </header>
        <article>
          <div className="mt-[1.5em] text-sm font-light tracking-wide text-grey">
            <p>
              Congratulations , you have successfully submited your application.
              Your document is under review
              <span className="m-1 font-bold text-black">Within 24hrs</span>
              and will be communicated once appproved. contact support
              <span className="ml-1 font-bold text-black">
                info@grynindexedu.ng
              </span>
            </p>
          </div>
        </article>
        <Link to="/staff/dashboard/payments">
          <button.PrimaryButton className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white">
            Proceed to Dashboard
          </button.PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default Processing;
