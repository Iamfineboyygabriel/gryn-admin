import { useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";
import { button } from "../../shared/buttons/Button";
import { useStaffEmails } from "../redux/hooks/admin/getAdminProfile";
import Modal from "./Modal";
import ApplicationAssignedSuccess from "./ApplicatonAssignedSuccess";
import { assignApplicationToStaff } from "../redux/admin/slices/application.slices";
import { useAppDispatch } from "../redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../redux/store";
import ReactLoading from "react-loading";

const StaffEmailDropdown = ({ applicationId }: any) => {
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch: AppDispatch = useAppDispatch();

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(staffEmail)) {
      return staffEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [staffEmail]);

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
      const resultAction = await dispatch(
        assignApplicationToStaff({
          applicationId,
          email,
        })
      );

      if (assignApplicationToStaff.fulfilled.match(resultAction)) {
        handleModalOpen();
      } else if (assignApplicationToStaff.rejected.match(resultAction)) {
        setError(
          (resultAction.payload as string) || "Failed to assign application"
        );
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <main className="px-[5em] py-[3em] font-outfit">
      <div className="m-auto w-[24em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-bold">Staff Details</h1>
          <p className="font-light">Enter the details of the Staff</p>
        </header>
      </div>
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
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex justify-center">
        <button.PrimaryButton
          className="m-auto mt-[3em] w-[70%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
          onClick={handleContinue}
        >
          {isAssigning ? (
            <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
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
          <ApplicationAssignedSuccess />
        </Modal>
      )}
    </main>
  );
};

export default StaffEmailDropdown;
