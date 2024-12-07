import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../shared/redux/store';
import { findStudentByEmailUniversityDegree } from '../../../../../../shared/redux/shared/slices/shareApplication.slices';
import {  useStudentEmails } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';
import { useTopUniversities } from '../../../../../../shared/redux/hooks/shared/getUserProfile';
import { Dropdown, DropdownItem } from '../../../../../../shared/dropDown/DropDown';
import { button } from "../../../../../../shared/buttons/Button";
import ReactLoading from "react-loading";

interface University {
  name: string;
}

interface Degree {
  name: string;
}

interface StudentData {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  dateOfBirth: string;
  address: string;
  localGovtArea: string;
  state: string;
  country: string;
  internationalPassportNumber: string;
  status: string;
  userId: string;
  agentId: string | null;
  staffId: string | null;
  isAssignedToStaff: boolean;
  isAssignedToAgent: boolean;
  createdAt: string;
  updatedAt: string;
  payment: any;
}

interface FindStudentByAllProps {
  redirectTo?: string;  
}

const FindStudentByAll: React.FC<FindStudentByAllProps> = ({ redirectTo = "/admin/dashboard/application/update_application" }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { userTopUniversities, loading: universityLoading } = useTopUniversities();
  const { studentsEmail, loading: emailLoading } = useStudentEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [university, setUniversity] = useState<string | null>(null);
  const [degree, setDegree] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userToken = sessionStorage.getItem("userData");

  const type: Degree[] = [{ name: "BACHELOR" }, {name:"INTERNATIONAL_YEAR_ONE"}, {name:"PRE_MASTERS"}, {name:"UNDERGRADUATE"}, { name: "MASTERS" }, { name: "DOCTORATE" }];

  const dropdownItems: DropdownItem[] = useMemo(() => 
    (userTopUniversities?.data || []).map((uni: University) => ({ name: uni.name })),
    [userTopUniversities]
  );

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array.isArray(studentsEmail)) {
      return studentsEmail.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [studentsEmail]);

  const handleSelectItem = useCallback((item: DropdownItem) => {
    setUniversity(item?.name || null);
    setError(null);
  }, []);

  const handleSelectDegree = useCallback((item: DropdownItem) => {
    setDegree(item?.name || null);
    setError(null);
  }, []);

  const handleSelectEmail = useCallback((item: DropdownItem) => {
    setEmail(item?.name || null);
    setError(null);
  }, []);

  const getStudent = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !university || !degree) {
      setError("Please fill in all fields");
      return;
    }

    if (!userToken) {
      setError("User token not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(findStudentByEmailUniversityDegree({ email, university, degree })).unwrap();
      const studentData: StudentData = response?.data;

      if (!studentData) {
        throw new Error("Student not found");
      }

      navigate(redirectTo, { state: { studentData } });
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching student data");
    } finally {
      setLoading(false);
    }
  }, [email, university, degree, userToken, dispatch, navigate, redirectTo]);

  const isFormComplete = email && university && degree;

  return (
    <main className="px-[5em] font-outfit" data-aos="zoom-in">
      <div className="m-auto w-[24em] items-center py-[1em] text-center">
        <header className="flex flex-col gap-[1.5em]">
          <h1 className="text-3xl font-semibold">Application</h1>
          <div className="text-sm font-light tracking-wide text-grey">
            <p>Enter the details of the application to update</p>
          </div>
        </header>

        <form onSubmit={getStudent} className="mt-[5px] flex flex-col items-center justify-center gap-[1em] text-center">
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

          <Dropdown
            label="University"
            items={dropdownItems}
            selectedItem={university ? { name: university } : null}
            onSelectItem={handleSelectItem}
            asterisk
            searchVisible
            loading={universityLoading}
            placeholder='Select a University'
          />
          
          <Dropdown
            label="Degree"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={type}
            selectedItem={degree ? { name: degree } : null}
            onSelectItem={handleSelectDegree}
            asterisk
            placeholder='Select a Degree'
          />

          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

          <button.PrimaryButton
            type="submit"
            className="m-auto mt-[1.2em] flex w-[56%] items-center justify-center gap-2 rounded-full bg-linear-gradient py-[8px] text-center text-lg font-medium text-white disabled:cursor-not-allowed"
            disabled={loading || !isFormComplete}
          >
            {loading ? (
              <div className='mr-auto'>
              <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
              </div>
            ) : (
              "Continue"
            )}
          </button.PrimaryButton>
        </form>
      </div>
    </main>
  );
};

export default FindStudentByAll;