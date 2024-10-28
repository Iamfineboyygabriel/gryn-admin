import { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { button } from "../../shared/buttons/Button";
import { useAgentsEmails } from "../redux/hooks/admin/getAdminProfile";
import Modal from "./Modal";
import { assignApplicationToAgent } from "../redux/admin/slices/application.slices";
import { useAppDispatch } from "../redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../redux/store";
import ReactLoading from "react-loading";
import ApplicationAssignedSuccessAgent from "./ApplicationAssignedSuccessAgent";
// import ApplicationAssignedSuccessStaff from "./ApplicationAssignSuccessStaff";

const AgentEmailDropdown = ({ applicationId }: { applicationId: string }) => {
    const dispatch:AppDispatch = useAppDispatch();
  const { agentsEmail, loading: emailLoading } = useAgentsEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(agentsEmail)) {
      return agentsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [agentsEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem) => {
    setEmail(item?.name || null);
    setError(null);
  }, []);

  const handleContinue = async () => {
    if (!email) {
      setError("Please select an agent email");
      return;
    }

    setIsAssigning(true);
    try {
      const resultAction = await dispatch(assignApplicationToAgent({ 
         applicationId, 
        email 
      }));
      
      if (assignApplicationToAgent.fulfilled.match(resultAction)) {
        handleModalOpen(); 
      } else if (assignApplicationToAgent.rejected.match(resultAction)) {
        setError(resultAction.payload as string || "Failed to assign application");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <main className="px-[5em] py-[3em] font-outfit">
      <div className="m-auto w-[24em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Agent Details</h1>
          <p className="font-light">Select the agent to assign the application to</p>
        </header>
      </div>
      <div className="mt-[1.5em]">
      <Dropdown
        label="Agent Email"
        items={emailItems}
        selectedItem={email ? { name: email } : null}
        onSelectItem={handleSelectEmail}
        asterisk
        searchVisible
        loading={emailLoading}
        placeholder="Select Agent Email"
      />
        </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="flex justify-center">
        <button.PrimaryButton
          className="m-auto mt-[3em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
          type="button"
          onClick={handleContinue}
          disabled={isAssigning}
        >
              {isAssigning ? (
                    <ReactLoading
                      color="#FFFFFF"
                      width={25}
                      height={25}
                      type="spin"
                    />
                  ) : (
                    "Continue"
                  )}
        </button.PrimaryButton>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          data-aos="zoom-in"
        >
          <ApplicationAssignedSuccessAgent />
        </Modal>
      )}
    </main>
  );
};

export default AgentEmailDropdown;