import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { button } from "../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from 'react-loading';
import Modal from "../../../../../../shared/modal/Modal";
import { RootState } from "../../../../../../shared/redux/store";
import { findStaffByEmail } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface UpdateStaffByEmailProps {
  onClose: () => void;
}

const UpdateStaff: React.FC<UpdateStaffByEmailProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await dispatch(findStaffByEmail(email) as any);
      const staffEmail = response.payload.email;
      navigate(`/admin/dashboard/all_staffs/view_profile/${staffEmail}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false); 
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
    </main>
  );
};

export default UpdateStaff;