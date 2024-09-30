import React, { useState } from 'react'
import { useStaffDetails } from '../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import user from "../../../../../../../assets/png/avatar.png";

const PersonalDetails: React.FC<{ staffEmail: any }> = ({
  staffEmail,
  }) => {
  const { staffDetail, loading } = useStaffDetails(staffEmail);
  const [firstName, setFirstName] = useState(staffDetail?.data?.profile?.firstName || "");
  const [lastName, setLastName] = useState(staffDetail?.data?.profile?.firstName || "");
  const [middleName, setMiddleName] = useState(staffDetail?.data?.profile?.middleName || "");
  const [email, setEmail] = useState(staffDetail?.data?.profile?.email || "")

    // console.log("stt",staffDetail)
  return (
    <main>
       <header className='mt-[1em]'>
        <h1 className="text-xl font-semibold">
          Personal Details
        </h1>
      </header>
       <div className="mt-[1em] flex items-center gap-[1em]">
        <div>
            <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-200">
            <img
              src={staffDetail?.data?.profile?.publicURL || user}
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
     <div className="mt-[1.5em] grid w-full max-w-[80%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
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
                readOnly
                disabled={loading}
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
              />
            </div>
         </div>

        <div className="w-full">
            <label
              htmlFor="firstName"
              className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
            >
              Last Name
            </label>
            <div className="relative flex text-center">
              <input
                name="firstName"
                id="firstName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                readOnly
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
                readOnly
                // readOnly={!editMode || loading}
                disabled={loading}
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
                onChange={(e) => setLastName(e.target.value)}
                readOnly
                // readOnly={!editMode || loading}
                disabled={loading}
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
              />
            </div>
        </div>
    </div>
    </main>

  )
}

export default PersonalDetails;