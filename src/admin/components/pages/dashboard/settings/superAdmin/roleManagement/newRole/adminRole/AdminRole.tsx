import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactLoading from "react-loading";
import { button } from "../../../../../../../../../shared/buttons/Button";
import { useAdminsEmails } from "../../../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../../../../shared/dropDown/DropDown";
import { RootState } from "../../../../../../../../../shared/redux/store";
import { toast } from "react-toastify";
import { updateRole } from "../../../../../../../../../shared/redux/shared/slices/shareApplication.slices";

interface RoleChoice {
  name: string;
}

interface DesignationChoice {
  name: string;
}

const AdminRole: React.FC = () => {
  const dispatch = useDispatch();
  const { adminsEmail, loading: emailLoading } = useAdminsEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);

  const loading = useSelector(
    (state: RootState) => state.shareApplication.loading
  );

  const type: RoleChoice[] = [
    { name: "STAFF" },
    { name: "ADMIN" },
    { name: "SUPER_ADMIN" },
  ];

  const designationType: DesignationChoice[] = [
    { name: "CHIEF_EXECUTIVE_OFFICER" },
    { name: "BOARD_MEMBER" },
    { name: "CHIEF_OPERATIONS_OFFICER" },
    { name: "MANAGEMENT_CONSULTANT" },
    { name: "HEAD_HR" },
    { name: "HEAD_ACCOUNT" },
    { name: "OPERATION_MANAGER" },
    { name: "BRANCH_MANAGER" },
    { name: "RECRUITMENT_MANAGER" },
    { name: "DEPUTY_RECRUITMENT_MANAGER" },
    { name: "HR_MANAGER" },
    { name: "ACCOUNTANT" },
    { name: "CHIEF_FINANCIAL_OFFICER" },
    { name: "SENIOR_ASSOCIATE" },
    { name: "ADMINISTRATIVE_EXECUTIVE" },
    { name: "JUNIOR_ASSOCIATE" },
    { name: "ADMIN_OFFICER" },
    { name: "ADMISSION_OFFICER" },
    { name: "OFFICE_ASSISTANT" },
    { name: "SENIOR_ADMISSION_OFFICER" },
    { name: "ADMISSION_OFFICER_I" },
    { name: "  PROJECT_TEAM_MEMBER" },
  ];

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(adminsEmail)) {
      return adminsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [adminsEmail]);

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

  const result = await dispatch(updateRole({ email, role, designation }));
  
  if (result.error) {
    const errorMessage = result.payload?.message || result.error.message || "An error occurred";
    toast.error(errorMessage);
    setError(errorMessage);
  } else {
    toast.success("Role assigned successfully");
    resetForm();
  }
};

  return (
    <main className="font-outfit">
      <header>
        <h1 className="text-2xl mt-[1.5em] font-semibold">Role Details</h1>
      </header>
      <form
        className="mt-[1.5em] w-full lg:w-[40%] lg:max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-[2em]">
          <Dropdown
            label="admin Email"
            items={emailItems}
            selectedItem={email ? { name: email } : null}
            onSelectItem={handleSelectEmail}
            asterisk
            searchVisible
            loading={emailLoading}
            placeholder="Select Admin Email"
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
                "Save & Continue"
              )}
            </button.PrimaryButton>
          </div>
        </div>
      </form>
    </main>
  );
};

export default AdminRole;
