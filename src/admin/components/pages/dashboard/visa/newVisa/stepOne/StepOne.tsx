import { useState } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";

const StepOne = ({ onNext }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const submitApplication: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const body = {
        firstName,
        lastName,
        otherName,
        email,
      };
      onNext(body);
      setLoading(false);
    }, 3000);
  };
  
  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">
          Personal Details
        </h2>
      </header>
      <form
        className="mt-[2em] w-[77%] dark:text-white"
        onSubmit={submitApplication}
      >
        <div className="flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="firstName" className="flex-start flex font-medium">
              First Name
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              disabled={loading}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="flex-start flex font-medium">
              Last Name
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              disabled={loading}
              onChange={(e) => setLastName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="middleName" className="flex-start font-medium">
              Other Name (Optional)
            </label>
            <input
              id="otherName"
              name="otherName"
              onChange={(e) => setOtherName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="flex-start flex font-medium">
              Email Address
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mr-auto mt-4">
          <button.PrimaryButton
            className="m-auto mt-[5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <ReactLoading
                color="#FFFFFF"
                width={25}
                height={25}
                type="spin"
              />
            ) : (
              "Save and Continue"
            )}
          </button.PrimaryButton>
        </div>
      </form>
    </main>
  );
};

export default StepOne;
