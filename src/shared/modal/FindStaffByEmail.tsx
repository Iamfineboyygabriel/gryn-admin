import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { button } from "../buttons/Button";
import ReactLoading from "react-loading";
import { AppDispatch, RootState } from "../redux/store";
import { findStaffByEmail } from "../redux/shared/slices/shareApplication.slices";
import { assignAgentToStaff } from "../redux/admin/slices/application.slices";
import AgentAssigned from "./AgentAssigned";
import Modal from "./Modal";
import { useStaffEmails } from "../redux/hooks/admin/getAdminProfile";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";

interface FindStaffByEmailProps {
  onClose: () => void;
  redirect?: string;
  agentId: string;
}

interface StaffEmail {
  email: string;
}

const FindStaffByEmail: React.FC<FindStaffByEmailProps> = ({
  onClose,
  redirect,
  agentId,
}) => {
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const { loading, error } = useSelector(
    (state: RootState) => state?.application
  );
  const [errorStaff, setErrorStaff] = useState<string>("");

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array?.isArray(staffEmail)) {
      return staffEmail.map((item: StaffEmail) => ({ name: item?.email }));
    }
    return [];
  }, [staffEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem | null) => {
    setEmail(item?.name || "");
    setErrorStaff("");
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenSuccessModal = () => setSuccessModalOpen(true);
  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorStaff("Please select a staff email");
      return;
    }

    try {
      const staffResponse = await dispatch(findStaffByEmail(email) as any);

      if (staffResponse.error) {
        setErrorStaff("Staff not found");
        return;
      }

      const assignResponse = await dispatch(
        assignAgentToStaff({ agentId, email }) as any
      );

      if (assignResponse.payload && !assignResponse.error) {
        handleOpenSuccessModal();
      } else {
        handleOpenModal();
      }
    } catch (err) {
      handleOpenModal();
    }
  };

  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Staff Details</h1>
          <p className="font-light">Enter the details of the Staff</p>
        </header>
        <form onSubmit={handleSubmit}>
          <article>
            <div className="w-full mt-[2em]">
              <Dropdown
                label="Staff Email"
                items={emailItems}
                selectedItem={email ? { name: email } : null}
                onSelectItem={handleSelectEmail}
                asterisk
                searchVisible
                loading={emailLoading}
                placeholder="Select Staff Email"
              />
            </div>
          </article>
          {errorStaff && <p className="text-red-500 mt-2">{errorStaff}</p>}
          <button.PrimaryButton
            className="m-auto mt-[2em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
              "Continue"
            )}
          </button.PrimaryButton>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-red-500 font-semibold">
              {error || "An error occurred while assigning the agent."}
            </p>
          </div>
        </Modal>
      )}
      {isSuccessModalOpen && (
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
          data-aos="zoom-in"
        >
          <AgentAssigned onClose={handleCloseSuccessModal} />
        </Modal>
      )}
    </main>
  );
};

export default FindStaffByEmail;
