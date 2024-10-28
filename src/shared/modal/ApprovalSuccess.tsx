import { Link } from "react-router-dom";
import { button } from "../buttons/Button";
import Success from "../../assets/svg/ResetPassword.svg";

interface ApprovalSuccessProps {
  onClose: () => void;
  approvalType: 'agent' | 'student';
}

const ApprovalSuccess: React.FC<ApprovalSuccessProps> = ({ onClose, approvalType }) => {
  const title = approvalType === 'agent' ? 'Agent Approved' : 'Student Application Approved';

  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <img src={Success} alt="success_img" className="m-auto" />
        <header className="mt-[2em] flex flex-col">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <article>
          <div className="mt-[1em] text-sm font-light text-center flex flex-col gap-[5px] tracking-wide text-grey">
          {approvalType === 'agent'
            ? 'Agent has been approved successfully.'
            : 'Student application has been approved successfully.'}
          </div>
        </article>
        <Link to="/admin/dashboard/home">
          <button.PrimaryButton className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient py-[10px] text-center font-medium text-white">
            Proceed to Dashboard
          </button.PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default ApprovalSuccess;
