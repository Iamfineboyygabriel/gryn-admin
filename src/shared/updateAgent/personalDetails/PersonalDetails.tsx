import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../shared/redux/store";
import { updateAgentCreated } from "../../../shared/redux/shared/slices/shareApplication.slices";
import { useAppDispatch } from "../../../shared/redux/hooks/shared/reduxHooks";
import { button } from "../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";

interface AgentData {
  profile: {
    firstName: string;
    lastName: string;
    userId: string;
    [key: string]: any;
  };
  email: string;
}

interface PersonalDetailsProps {
  agentData: AgentData;
  onNext: (data?: { newApplicationId?: string }) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  onNext,
  agentData,
}) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const [firstName, setFirstName] = useState(
    agentData?.profile?.firstName || ""
  );
  const [lastName, setLastName] = useState(agentData?.profile?.lastName || "");
  const [otherName, setOtherName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agentData) {
      navigate("/admin/dashboard/all_users");
    }
  }, [agentData, navigate]);

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const body = {
        firstName,
        lastName,
      };
      await dispatch(
        updateAgentCreated({ body, userId: agentData.profile.userId })
      ).unwrap();
      onNext();
    } catch (error: any) {
      toast.error(error || "An error occurred while updating the student");
    } finally {
      setLoading(false);
    }
  };

  if (!agentData) {
    return null;
  }

  return (
    <main className="font-outfit">
      <div className="h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Personal Details
          </h2>
        </header>
        <form
          className="mt-[1.5em] w-[77%] dark:text-white"
          onSubmit={submitApplication}
        >
          <div className="flex flex-col lg:flex-row gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="flex-start flex font-medium"
              >
                First Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                disabled={loading}
                value={firstName}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-[1em] flex flex-col lg:flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="middleName" className="flex-start font-medium">
                Other Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="otherName"
                name="otherName"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
                value={agentData?.email || ""}
                readOnly
                className="border-border cursor-not-allowed focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[45%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
                "Update Application"
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PersonalDetails;
