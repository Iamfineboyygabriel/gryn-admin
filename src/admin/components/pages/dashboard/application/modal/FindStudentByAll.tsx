import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../shared/redux/store';
import { findStudentByEmailUniversityDegree } from '../../../../../../shared/redux/shared/slices/shareApplication.slices';
import { useAllApplication } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';
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

const FindStudentByAll: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { userTopUniversities, loading: universityLoading } = useTopUniversities();
  const { applications, loading: emailLoading, updateSearchTerm, fetchApplications } = useAllApplication();

  const [university, setUniversity] = useState<string | null>(null);
  const [degree, setDegree] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const itemsPerDropDown = 10;
  const userToken = sessionStorage.getItem("userData");

  const type: Degree[] = [{ name: "BACHELOR" }, { name: "MASTERS" }, { name: "DOCTORATE" }];

  const dropdownItems: DropdownItem[] = useMemo(() => 
    (userTopUniversities?.data || []).map((uni: University) => ({ name: uni.name })),
    [userTopUniversities]
  );

  const emailItems: DropdownItem[] = useMemo(() => 
    (applications || []).map((app: any) => ({ name: app.email })),
    [applications]
  );

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

  const handleEmailSearch = useCallback((term: string) => {
    if (!isInitialLoad) {
      updateSearchTerm(term);
      fetchApplications(1, itemsPerDropDown);
    }
  }, [updateSearchTerm, fetchApplications, itemsPerDropDown, isInitialLoad]);

  useEffect(() => {
    if (isEmailDropdownOpen && isInitialLoad) {
      fetchApplications(1, itemsPerDropDown);
      setIsInitialLoad(false);
    }
  }, [isEmailDropdownOpen, isInitialLoad, fetchApplications, itemsPerDropDown]);

  const handleEmailDropdownToggle = useCallback((isOpen: boolean) => {
    setIsEmailDropdownOpen(isOpen);
    if (isOpen && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

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

      navigate("/admin/dashboard/application/update_application", { state: { studentData } });
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching student data");
    } finally {
      setLoading(false);
    }
  }, [email, university, degree, userToken, dispatch, navigate]);

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
            onChange={handleEmailSearch}
            useEndpointSearch
            onDropdownToggle={handleEmailDropdownToggle}
          />

          <Dropdown
            label="University"
            items={dropdownItems}
            selectedItem={university ? { name: university } : null}
            onSelectItem={handleSelectItem}
            asterisk
            searchVisible
            loading={universityLoading}
          />
          
          <Dropdown
            label="Degree"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={type}
            selectedItem={degree ? { name: degree } : null}
            onSelectItem={handleSelectDegree}
            asterisk
          />

          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

          <button.PrimaryButton
            type="submit"
            className="m-auto mt-[1.2em] flex w-[56%] items-center justify-center gap-2 rounded-full bg-linear-gradient py-[8px] text-center text-lg font-medium text-white disabled:cursor-not-allowed"
            disabled={loading || !isFormComplete}
          >
            {loading ? (
              <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
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