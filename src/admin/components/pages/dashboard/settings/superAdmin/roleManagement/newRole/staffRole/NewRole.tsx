import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { button } from "../../../../../../../../../shared/buttons/Button";
import { useStaffEmails } from '../../../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import { Dropdown, DropdownItem } from '../../../../../../../../../shared/dropDown/DropDown';
import { RootState } from '../../../../../../../../../shared/redux/store';
import {toast} from 'react-toastify'
import { updateRole } from '../../../../../../../../../shared/redux/shared/slices/shareApplication.slices';

interface RoleChoice {
  name: string;
}

interface DesignationChoice {
  name: string;
}

const NewRole: React.FC = () => {
  const dispatch = useDispatch();
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);

  const loading = useSelector((state: RootState) => state.shareApplication.loading);

  const type: RoleChoice[] = [{ name: "STAFF" }, { name: "ADMIN" }];
  const designationType: DesignationChoice[] = [{ name: "CUSTOMER_RELATIONS" }, {name: "STUDENT_RELATION_MANAGER"}, {name: "INTERNATIONAL_RELATIONAL_MANAGER"}, {name: "OFFICE_ADMIN"},{name: "EXCUTIVE_ADMIN"}];

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(staffEmail)) {
      return staffEmail?.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [staffEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem) => {
    setEmail(item?.name || null);
    setError(null);
  }, []);

  const handleSelectRole = useCallback((item: DropdownItem) => {
    setRole(item?.name || null);
  }, []);

  const handleSelectDesignation = useCallback((item: DropdownItem) => {
    setDesignation(item?.name || null);
  }, []);

  const resetForm = useCallback(() => {
    setEmail(null);
    setRole(null);
    setDesignation(null);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role || !designation) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await dispatch(updateRole({ email, role, designation }) as any);
      toast.success("role assigned successfully")
      resetForm();
    } catch (error: any) {
      setError(error || "An error occurred while updating the role. Please try again.");
    }
  };

  return (
    <main className="font-outfit">
      <header>
        <h1 className="text-2xl mt-[1.5em] font-semibold">Role Details</h1>
      </header>
      <form className="mt-[1.5em] w-[40%] max-w-4xl" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-[2em]">
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

          <Dropdown
            label="Role"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={type}
            selectedItem={role ? { name: role } : null}
            onSelectItem={handleSelectRole}
            asterisk
            placeholder="Select Role"
          />

          <Dropdown
            label="Designation"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={designationType}
            selectedItem={designation ? { name: designation } : null}
            onSelectItem={handleSelectDesignation}
            asterisk
            placeholder="Select Designation"
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="mt-11">
            <button.PrimaryButton
              className="m-auto w-[300%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
                'Save & Continue'
              )}
            </button.PrimaryButton>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewRole;