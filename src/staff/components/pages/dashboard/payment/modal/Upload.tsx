import { button } from "../../../../../../shared/buttons/Button";


interface UploadProps {
  onClose: () => void;
}

const Upload: React.FC<UploadProps> = ({ onClose }: any) => {
 return (
    <main className="px-[5em] font-outfit" data-aos="zoom-in">
      <div className="m-auto w-[24em] items-center py-[2em] text-center">
        <header className="flex flex-col gap-[1.5em]">
          <h1 className="text-2xl font-semibold">Application</h1>
          <div className="text-sm font-light tracking-wide text-grey">
            <p>Enter the details of the application to</p>
            <p>upload payments</p>
          </div>
        </header>
        <button.PrimaryButton
          className="m-auto mt-[2em] flex w-[60%] justify-center gap-2 rounded-full bg-linear-gradient px-2 py-[10px] text-center font-medium text-white"
        >     
            "Continue"
        </button.PrimaryButton>
      </div>
    </main>
  );
};

export default Upload;
