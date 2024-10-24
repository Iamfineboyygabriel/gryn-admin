import React, { useState } from 'react';
import ReactLoading from "react-loading";
import { button } from "../../buttons/Button";
import { toast } from 'react-toastify';
import { CreateNotification } from '../../redux/admin/slices/notificationApplication.slices';
import { useAppDispatch } from '../../redux/hooks/shared/reduxHooks';
import { AppDispatch } from '../../redux/store';
import MessageSent from '../MessageSent';
import Modal from '../Modal';
import { useCurrentUser } from '../../redux/hooks/shared/getUserProfile';

interface SendMessageProps {
  onClose: () => void;
  onSubmit: () => void;
  userData: any;
}

const SendMessage: React.FC<SendMessageProps> = ({ onClose, onSubmit, userData }) => {
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const dispatch: AppDispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState(false);  
  const { userDetails } = useCurrentUser();
  const role = userDetails?.data?.role 


  const handleOpenModal = () => {
    setModalOpen(true);
    onSubmit(); 
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userData) {
      toast.error('user details not available');
      return;
    }
    setLoading(true);

    try {
      const body = {
        description
      };
      const userId = userData.userId;
       await dispatch(CreateNotification({ body, userId })).unwrap();
      setHeader('');
      setDescription('');
      handleOpenModal(); 
      
    } catch (error: any) {
      toast.error(
        error.message || 'An error occurred while creating the application'
      );
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="mt-[10px] flex flex-col gap-[8px]">
          <div>
            <label htmlFor="recipient" className="text-sm font-medium">
              Send Message to
            </label>
            <input
              type="text"
              id="recipient"
              className="mt-[1em] w-full cursor-not-allowed items-center gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 focus:outline-none"
              value={`${userData.firstName} ${userData.lastName}`}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="mt-[1em] h-32 w-full items-center gap-3 rounded-lg border-2 bg-inherit px-4 py-3 font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full bg-error px-[3em] py-[8px] text-center font-medium text-white"
              onClick={onClose}
              disabled={loading}
            >
              Back
            </button.PrimaryButton>
            <button.PrimaryButton
              className="rounded-full bg-linear-gradient px-[2em] py-[8px] text-center font-medium text-white"
              type='submit'
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
                "Submit Response"
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          data-aos="zoom-in"
          onClose={handleCloseModal}
        >
          <MessageSent to="/admin/dashboard/application" onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default SendMessage;