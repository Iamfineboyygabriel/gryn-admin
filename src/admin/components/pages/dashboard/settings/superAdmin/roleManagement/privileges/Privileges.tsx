import React from 'react';
import notApproved from "../../../../../../../../assets/svg/not-approve.svg"
import approve from "../../../../../../../../assets/svg/Approved.svg";
import { button } from "../../../../../../../../shared/buttons/Button";

interface Privilege {
  name: string;
  active: boolean;
}

interface FeaturePrivileges {
  sn: number;
  features: string;
  privileges: Privilege[];
  assigned: boolean;
}

const PrivilegeItem: React.FC<FeaturePrivileges> = ({ sn, features, privileges, assigned }) => (
  <tr className="border-b border-gray-200">
    <td className="py-5 px-6 text-sm">{sn}</td>
    <td className="py-5 px-6 text-sm whitespace-nowrap font-medium">{features}</td>
    <td className="py-5 px-6">
      <div className="flex flex-wrap gap-2">
        {privileges.map((privilege, index) => (
          <span 
            key={index} 
            className={`flex px-[8px] rounded-md font-normal py-[6px] items-center border gap-2  ${
              privilege.active 
                ? 'bg-[#F3FBF5] border-approve text-approve' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <img src={notApproved} alt="" />
            <p className='text-xs'>
            {privilege.name}
            </p>
          </span>
        ))}
      </div>
    </td>
    <td className="py-4 px-6">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          // checked={assigned} 
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700"></div>
      </label>
    </td>
  </tr>
);

const Privileges: React.FC = () => {
  const privilegesData: FeaturePrivileges[] = [
    {
      sn: 1,
      features: 'Dashboard',
      privileges: [{ name: 'Overview', active: true }],
      assigned: true
    },
    {
      sn: 2,
      features: 'Application',
      privileges: [
        { name: 'Direct Application', active: true },
        { name: 'Update Application', active: true },
        { name: 'New Application', active: true },
        { name: 'Submit Response', active: false }
      ],
      assigned: false
    },
    {
      sn: 3,
      features: 'Visa Application',
      privileges: [
        { name: 'New Visa Application', active: true },
        { name: 'Update Visa Application', active: true },
        { name: 'Submit Response', active: false }
      ],
      assigned: false
    },
    {
      sn: 4,
      features: 'All Users',
      privileges: [
        { name: 'Manage Students', active: true },
        { name: 'Manage Agents', active: true },
        { name: 'Pendg Agents', active: true },
        { name: 'Enquires', active: false },
        { name: 'Assign Students', active: false },
        { name: 'Update Student', active: true },
        { name: 'New Student', active: true },
        { name: 'Assign Agents', active: false },
        { name: 'Update Agents', active: false },
        { name: 'New Agents', active: false },
        { name: 'Approve/Reject Agents', active: false },
        { name: 'Submit Response', active: true }
      ],
      assigned: false
    },
    {
      sn: 5,
      features: 'All Staff',
      privileges: [
        { name: 'Update Staff', active: true },
        { name: 'New Staff', active: true },
        { name: 'View Details', active: false },
      ],
      assigned: false
    },
    {
      sn: 6,
      features: 'Payments',
      privileges: [
        { name: 'New Payments', active: true },
        { name: 'Invoice', active: true },
        { name: 'Drafts', active: false },
        { name: 'View Details', active: false },
      ],
      assigned: false
    },
    {
      sn: 7,
      features: 'Reports',
      privileges: [
        { name: 'Overview', active: true },
      ],
      assigned: false
    },
    {
      sn: 8,
      features: 'Messaging',
      privileges: [
        { name: 'Send/Inbox', active: true },
      ],
      assigned: false
    },
    {
      sn: 9,
      features: 'Settings',
      privileges: [
        { name: 'Edit Profile', active: true },
        { name: 'Change Password', active: true },
        { name: 'Admin Management', active: false },
        { name: 'Role Management', active: false },
        { name: 'Update Admin', active: false },
        { name: 'New Admin', active: false },
        { name: 'Update Role', active: false },
        { name: 'New Role', active: false },
      ],
      assigned: false
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Privileges</h1>
      <div className= "overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className='border-gray-200 border-border'>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privileges</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {privilegesData.map((item) => (
              <PrivilegeItem key={item.sn} {...item} />
            ))}
          </tbody>
        </table>
      </div>
      <button.PrimaryButton
        className="m-auto mt-[5em] w-[35%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
      >
        Save & Continue
      </button.PrimaryButton>
    </div>
  );
};

export default Privileges;