import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { button } from "../buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from 'react-loading';
import { RootState } from "../redux/store"; 
import { findStaffByEmail } from "../redux/shared/slices/shareApplication.slices";
import { assignAgentToStaff } from "../redux/admin/slices/application.slices";
import AgentAssigned from "./AgentAssigned";
import Modal from "./Modal";

interface FindStaffByEmailProps {
  onClose: () => void;
  redirect?: string;
  agentId: string;
}

const FindStaffByEmail: React.FC<FindStaffByEmailProps> = ({ onClose, redirect, agentId }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.application);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenSuccessModal = () => setSuccessModalOpen(true);
  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    onClose(); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(findStaffByEmail(email) as any);
      const response = await dispatch(assignAgentToStaff({ agentId, email }) as any);
      
      if (response.payload && !response.error) {
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
              <label htmlFor="email" className="flex-start flex font-medium">
                Email Address
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </article>
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
              'Continue'
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
            <p className="text-red-500 font-semibold">{error || "An error occurred while assigning the agent."}</p>
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