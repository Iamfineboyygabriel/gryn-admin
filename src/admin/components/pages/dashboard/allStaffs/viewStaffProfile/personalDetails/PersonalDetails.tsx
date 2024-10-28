import React, { useState, useEffect } from 'react'
import { useStaffDetails } from '../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import user from "../../../../../../../assets/png/avatar.png";
import { toast } from "react-toastify";
import { updateStaff } from '../../../../../../../shared/redux/shared/services/shareApplication.services';
import ReactLoading from "react-loading";
import { button } from "../../../../../../../shared/buttons/Button";

const SkeletonField = () => (
  <div className="w-full animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonAvatar = () => (
  <div className="animate-pulse flex items-center gap-[1em]">
    <div className="rounded-full bg-gray-200 h-24 w-24"></div>
    <div className="flex flex-col">
      <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const PersonalDetails: React.FC<{ staffEmail: any }> = ({
  staffEmail,
}) => {
  const { staffDetail, loading } = useStaffDetails(staffEmail);
  const staffId:any = staffDetail?.data?.profile?.userId;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("")
  const [designation, setDesignation] = useState("")
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (staffDetail?.data?.profile) {
      setFirstName(staffDetail.data.profile.firstName || "");
      setLastName(staffDetail.data.profile.lastName || "");
      setMiddleName(staffDetail.data.profile.middleName || "");
      setEmail(staffDetail.data.profile.email || "");
      setGender(staffDetail.data.profile.gender || "");
      setDesignation(staffDetail.data.designation || "STAFF");
    }
  }, [staffDetail]);

  const updateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setUpdateLoading(true);
    try {
      const body = {
        firstName,
        lastName,
        middleName,
        gender,
      };
      const response = await updateStaff(staffId, body);
      toast.success(response?.message);
      setIsEditing(false);
    } catch (error:any) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <main>
      <header className='mt-[1em]'>
        <h1 className="text-xl font-semibold">
          Personal Details
        </h1>
      </header>
      {loading ? (
        <SkeletonAvatar />
      ) : (
        <div className="mt-[1em] flex items-center gap-[1em]">
          <div>
            <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-200">
              <img
                src={staffDetail?.data?.profile?.avatar?.publicURL || user}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium dark:text-white">
              {firstName} {lastName}
            </h1>
            <p className="mt-[1.5em] text-xs font-semibold tracking-wide text-completed">
              {staffDetail?.data?.role || ""}
            </p>
          </div>
        </div>
      )}
      <form onSubmit={updateDetails} className="mt-[1.5em] grid w-full max-w-[80%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
        {loading ? (
          <>
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
            <SkeletonField />
          </>
        ) : (
          <>
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                First Name
              </label>
              <div className="relative flex text-center">
                <input
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!isEditing}
                  disabled={loading}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="lastName"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                Last Name
              </label>
              <div className="relative flex text-center">
                <input
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!isEditing}
                  disabled={loading}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="middleName"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                Middle Name
              </label>
              <div className="relative flex text-center">
                <input
                  name="middleName"
                  id="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  readOnly={!isEditing}
                  disabled={loading}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                Email Address
              </label>
              <div className="relative flex text-center">
                <input
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  disabled={true}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="gender"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                Gender
              </label>
              <div className="relative flex text-center">
                <input
                  name="gender"
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  readOnly={!isEditing}
                  disabled={loading}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="designation"
                className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
              >
                Designation
              </label>
              <div className="relative flex text-center">
                <input
                  name="designation"
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  readOnly
                  disabled={true}
                  className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none dark:border-gray-700 dark:text-white dark:bg-gray-700"
                />
              </div>
            </div>
          </>
        )}
        <div className="mr-auto mt-4">
          <button.PrimaryButton
            className="m-auto mt-[1.5em] px-[1.5em] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            type="submit"
            disabled={loading}
          >
            {updateLoading ? (
              <ReactLoading
                color="#FFFFFF"
                width={25}
                height={25}
                type="spin"
              />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Update Profile"
            )}
          </button.PrimaryButton>
        </div>
      </form>
    </main>
  )
}

export default PersonalDetails;