import { Link } from "react-router-dom";
import Success from "../../assets/svg/ResetPassword.svg";
import { button } from "../../shared/buttons/Button";

interface ApplicationUpdatedProps {
  onClose?: () => void;
  to: string;
}

const MessageSent = ({ onClose, to }: ApplicationUpdatedProps) => {
  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={Success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">Message Sent</h1>
        </header>
        <article>
          <div className="mt-[1.5em] text-sm font-light text-center tracking-wide text-grey">
            <p>You have successfully reviewed and responded to an application</p>
          </div>
        </article>
      </div>
    </main>
  );
};

export default MessageSent;
