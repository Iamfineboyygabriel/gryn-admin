import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { button } from "../../../../../../shared/buttons/Button";
import ReactLoading from "react-loading";
import { findStaffByEmail } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useStaffEmails } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../shared/dropDown/DropDown";
import { AppDispatch } from "../../../../../../shared/redux/store";

interface UpdateStaffByEmailProps {
  onClose: () => void;
}

interface StaffEmail {
  email: string;
}

const UpdateStaff: React.FC<UpdateStaffByEmailProps> = ({ onClose }) => {
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string>("");

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array?.isArray(staffEmail)) {
      return staffEmail.map((item: StaffEmail) => ({ name: item?.email }));
    }
    return [];
  }, [staffEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem | null) => {
    setEmail(item?.name || "");
  }, []);

  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(findStaffByEmail(email) as any);
      const staffEmail = response.payload.email;
      navigate("/admin/dashboard/all_staffs/view_profile", {
        state: { staffEmail: staffEmail },
      });
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
    </main>
  );
};

export default UpdateStaff;
