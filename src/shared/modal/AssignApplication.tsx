import { useState, useCallback } from "react";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { button } from "../../shared/buttons/Button"; 
import StaffEmailDropdown from "./StaffEmailDropdown";
import AgentEmailDropdown from "./AgentEmailDropdown";
import Modal from "./Modal";

interface Choice {
  name: string;
}

interface AssignApplicationProps {
  applicationId: any;
  onClose: () => void;
}

const AssignApplication = ({ applicationId, onClose }: AssignApplicationProps) => {
  const type: Choice[] = [{ name: "Staff" }, { name: "Agent" }];
  const [person, setPerson] = useState<string | null>(null);
  const [staffModal, setStaffModal] = useState(false);
  const [agentModal, setAgentModal] = useState(false);
  const [isParentModalVisible, setIsParentModalVisible] = useState(true); 

  const handleOpenStaffModal = () => {
    setIsParentModalVisible(false); 
    setStaffModal(true);
  };

  const handleOpenAgentModal = () => {
    setIsParentModalVisible(false); 
    setAgentModal(true); 
  };

  const handleCloseStaffModal = () => {
    setStaffModal(false);
    onClose(); 
  };

  const handleCloseAgentModal = () => {
    setAgentModal(false);
    onClose(); 
  };

  const handleSelectPerson = useCallback((item: DropdownItem) => {
    setPerson(item?.name || null);
  }, []);

  const handleContinue = () => {
    if (person === "Staff") {
      handleOpenStaffModal();
    } else if (person === "Agent") {
      handleOpenAgentModal();
    }
  };

  return (
    <main className="px-[5em] py-[2em] font-outfit">
      {isParentModalVisible && ( 
        <>
          <div className="m-auto w-[24em] text-center">
            <header className="flex gap-2 flex-col">
              <h1 className="text-2xl font-bold">Staff Details</h1>
              <p className="font-light">Enter the details of the Staff</p>
            </header>
          </div>
          <Dropdown
            label="Assign Application To"
            labelClassName="text-grey-primary mt-[1.5em]"
            className="text-purple-deep"
            items={type}
            selectedItem={person ? { name: person } : null}
            onSelectItem={handleSelectPerson}
            asterisk
            placeholder="Assign To:"
          />
          <div className="flex justify-center">
            <button.PrimaryButton
              className="m-auto mt-[2em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="button"
              onClick={handleContinue}
            >
              Continue
            </button.PrimaryButton>
          </div>
        </>
      )}

      {staffModal && (
        <Modal
          isOpen={staffModal}
          onClose={handleCloseStaffModal}
          data-aos="zoom-in"
        >
          <StaffEmailDropdown applicationId={applicationId} />
        </Modal>
      )}

      {agentModal && (
        <Modal
          isOpen={agentModal}
          onClose={handleCloseAgentModal}
          data-aos="zoom-in"
        >
          <AgentEmailDropdown applicationId={applicationId} />
        </Modal>
      )}
    </main>
  );
};

export default AssignApplication;
