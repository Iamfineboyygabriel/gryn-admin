import { useNavigate } from "react-router";
import Inbox from "../../../../assets/svg/Inbox.svg";

const RecoveryMail = () => {
  const navigate = useNavigate();
  const signIn = async () => {
    navigate("/student/sign_in");
  };

  return (
    <main className="font-outfit flex h-screen flex-col items-center justify-center text-center">
      <header className="flex flex-col gap-[1.6em]">
        <img
          src={Inbox}
          alt="inbox_image"
          className="mx-auto cursor-pointer"
          onClick={signIn}
        />
        <h1 className="text-grey-primary text-3xl font-bold">Reset Password</h1>
        <div className="text-grey text-l font-normal tracking-wide">
          <p>A password recovery link has been sent to your email address.</p>
          <p>Kindly check your email.</p>
        </div>
      </header>
    </main>
  );
};

export default RecoveryMail;
