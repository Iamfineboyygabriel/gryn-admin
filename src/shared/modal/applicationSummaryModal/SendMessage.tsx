import { button } from "../../buttons/Button";

const SendMessage = ({ onClose, onSubmit }: any) => {
  return (
    <main className="px-[4em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col">
          <h1 className="m-auto text-2xl font-semibold">Send Message</h1>
          <div className="mt-[1em] text-center font-light text-grey">
            <p>Kindly Preview The Application Response</p>
            <p>Before Proceeding.</p>
          </div>
        </header>
        <div className="mt-[10px] flex flex-col gap-[8px]">
          <div>
            <label htmlFor="recipient" className="text-sm font-medium">
              Send Message to
            </label>
            <input
              type="text"
              id="recipient"
              className="mt-[1em] w-full cursor-not-allowed items-center gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 focus:outline-none"
              value="Akintola Babatunde"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="header" className="text-sm font-medium">
              Header
            </label>
            <input
              type="text"
              id="header"
              className="mt-[1em] w-full items-center gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="mt-[1em] h-32 w-full items-center gap-3 rounded-lg border-2 bg-inherit px-4 py-3 font-medium"
            ></textarea>
          </div>

          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full bg-error px-[3em] py-[8px] text-center font-medium text-white"
              onClick={onClose}
            >
              Back
            </button.PrimaryButton>
            <button.PrimaryButton
              className="rounded-full bg-linear-gradient px-[2em] py-[8px] text-center font-medium text-white"
              onClick={onSubmit}
            >
              Submit Response
            </button.PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SendMessage;
