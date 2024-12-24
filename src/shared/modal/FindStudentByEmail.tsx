import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { button } from "../buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import { findStudentByEmail } from "../redux/shared/slices/shareApplication.slices";
import ReactLoading from 'react-loading';
import { useStudentEmails } from "../redux/hooks/admin/getAdminProfile";
import { Dropdown, DropdownItem } from "../dropDown/DropDown";

interface FindStudentByEmailProps {
  onClose: () => void;
  redirect?: string; 
}

const FindStudentByEmail: React.FC<FindStudentByEmailProps> = ({ onClose, redirect }) => {
  const { studentsEmail, loading: emailLoading } = useStudentEmails();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(studentsEmail)) {
      return studentsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [studentsEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem | null) => {
    setEmail(item?.name || '');
    setError(null);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(findStudentByEmail(email) as any);
      onClose();

      const redirectPath = redirect || "/admin/dashboard/all_users/update_student";
      navigate(redirectPath, {
        state: { studentData: response.payload }
      });
    } catch (error) {
      console.log("Error",error)
      setError("Failed to find student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-[5em] font-outfit">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <header className="flex gap-2 flex-col">
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="font-light">Enter the details of the student</p>
        </header>
        <form onSubmit={handleSubmit}>
          <article>
            <div className="w-full mt-[2em]">
            <Dropdown
            label="Email"
            items={emailItems}
            selectedItem={email ? { name: email } : null}
            onSelectItem={handleSelectEmail}
            asterisk
            searchVisible
            loading={emailLoading}
            placeholder='Select an Email'
          />
            </div>
          </article>
          {error && <p className="text-red-500 mt-2">{error}</p>}
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

export default FindStudentByEmail;
