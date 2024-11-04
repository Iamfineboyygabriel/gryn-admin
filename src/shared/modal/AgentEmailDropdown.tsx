import { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { button } from "../../shared/buttons/Button";
import { useAgentsEmails, useStaffEmails } from "../redux/hooks/admin/getAdminProfile";
import Modal from "./Modal";
import { assignApplicationToAgent } from "../redux/admin/slices/application.slices";
import { useAppDispatch } from "../redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../redux/store";
import ReactLoading from "react-loading";
import ApplicationAssignedSuccessAgent from "./ApplicationAssignedSuccessAgent";

const AgentEmailDropdown = ({ applicationId, onClose }: { applicationId: any, onClose: any }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { agentsEmail, loading: agentEmailLoading } = useAgentsEmails();
  const { staffEmail: staffsEmail, loading: staffLoading } = useStaffEmails();
  
  const [selectedAgentEmail, setSelectedAgentEmail] = useState<string | null>(null);
  const [selectedStaffEmail, setSelectedStaffEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const agentEmailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(agentsEmail)) {
      return agentsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [agentsEmail]);

  const staffEmailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(staffsEmail)) {
      return staffsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [staffsEmail]);

  const handleSelectAgentEmail = useCallback((item: DropdownItem) => {
    setSelectedAgentEmail(item?.name || null);
    setError(null);
  }, []);

  const handleSelectStaffEmail = useCallback((item: DropdownItem) => {
    setSelectedStaffEmail(item?.name || null);
    setError(null);
  }, []);

  const handleContinue = async () => {
    if (!selectedAgentEmail) {
      setError("Please select an agent email");
      return;
    }

    if (!selectedStaffEmail) {
      setError("Please select a staff email");
      return;
    }

    setIsAssigning(true);
    try {
      const resultAction = await dispatch(assignApplicationToAgent({ 
        applicationId, 
        agentEmail: selectedAgentEmail,
        staffEmail: selectedStaffEmail
      }));
      
      if (assignApplicationToAgent.fulfilled.match(resultAction)) {
        handleModalOpen();
        onClose();
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
          <p className="font-light">Select the agent under staff to assign the application to</p>
        </header>
      </div>
      
      <div className="mt-[1.5em] space-y-4">
        <Dropdown
          label="Agent Email"
          items={agentEmailItems}
          selectedItem={selectedAgentEmail ? { name: selectedAgentEmail } : null}
          onSelectItem={handleSelectAgentEmail}
          asterisk
          searchVisible
          loading={agentEmailLoading}
          placeholder="Select Agent Email"
        />

        <Dropdown
          label="Staff Email"
          items={staffEmailItems}
          selectedItem={selectedStaffEmail ? { name: selectedStaffEmail } : null}
          onSelectItem={handleSelectStaffEmail}
          asterisk
          searchVisible
          loading={staffLoading}
          placeholder="Select Staff Email"
        />
      </div>

      {error && (
        <p className="text-red-500 mt-2 text-center">{error}</p>
      )}

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