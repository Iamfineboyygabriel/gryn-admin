import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import notApproved from "../../../../../../../../assets/svg/not-approve.svg"
import approve from "../../../../../../../../assets/svg/Approved.svg";
import { button } from "../../../../../../../../shared/buttons/Button";
import {  useStaffDetails } from '../../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import { Dropdown, DropdownItem } from '../../../../../../../../shared/dropDown/DropDown';
import { UpdatePagePermission, getUserPermittedPages } from '../../../../../../../../shared/redux/shared/slices/shareApplication.slices';
import ReactLoading from "react-loading";
import { Alert } from '@mui/material';
import { useStaffEmails } from '../../../../../../../../shared/redux/hooks/admin/getAdminProfile';

enum Features {
  DASHBOARD = 'DASHBOARD',
  APPLICATION = 'APPLICATION',
  VISA_APPLICATION = 'VISA_APPLICATION',
  VIEW_APPLICATION = 'VIEW_APPLICATION',
  ALL_USERS = 'ALL_USERS',
  ALL_STAFFS = 'ALL_STAFFS',
  PAYMENTS = 'PAYMENTS',
  REPORTS = 'REPORTS',
  MESSAGINGS = 'MESSAGINGS',
  SETTINGS = 'SETTINGS'
}

interface Privilege {
  name: string;
  active: boolean;
}

interface FeaturePrivileges {
  sn: number;
  features: Features;
  privileges: Privilege[];
  completed: boolean;
}

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded"></div></td>
    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
    <td className="py-4 px-6">
      <div className="flex gap-2">
        {[1, 2, 3]?.map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </td>
    <td className="py-4 px-6"><div className="h-6 w-11 bg-gray-200 rounded-full"></div></td>
  </tr>
);

const PrivilegeItem: React.FC<FeaturePrivileges & { 
  onToggle: (feature: Features) => void,
  onPrivilegeToggle: (feature: Features, privilegeName: string) => void 
}> = ({ sn, features, privileges, completed, onToggle, onPrivilegeToggle }) => (
  <tr className="border-b border-gray-200">
    <td className="py-5 px-6 text-sm">{sn}</td>
    <td className="py-5 px-6 text-sm whitespace-nowrap font-medium">{features}</td>
    <td className="py-5 px-6">
      <div className="flex flex-wrap gap-2">
        {privileges.map((privilege, index) => (
          <span 
            key={index} 
            className={`flex px-[8px] rounded-md font-normal py-[6px] items-center border gap-2 cursor-pointer ${
              privilege.active 
                ? 'bg-[#F3FBF5] border-approve text-approve' 
                : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => onPrivilegeToggle(features, privilege.name)}
          >
            <img src={privilege.active ? approve : notApproved} alt="" />
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
          checked={completed}
          onChange={() => onToggle(features)}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700"></div>
      </label>
    </td>
  </tr>
);

const Privileges: React.FC = () => {
  const dispatch = useDispatch();  
  const { staffEmail, loading: emailLoading } = useStaffEmails();
  const [email, setEmail] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { staffDetail } = useStaffDetails(selectedEmail || "");
  const staffId: any = staffDetail?.data?.profile?.userId;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [privilegesLoading, setPrivilegesLoading] = useState(false);
  const [hasNoPrivileges, setHasNoPrivileges] = useState(false);
   
  const [privilegesData, setPrivilegesData] = useState<FeaturePrivileges[]>([
    {
      sn: 1,
      features: Features.DASHBOARD,
      privileges: [{ name: 'Overview', active: false }],
      completed: false
    },
    {
      sn: 2,
      features: Features.APPLICATION,
      privileges: [
        { name: 'Direct Application', active: false },
        { name: 'Update Application', active: false },
        { name: 'New Application', active: false },
        { name: 'Submit Response', active: false },
      ],
      completed: false
    },
    {
      sn: 3,
      features: Features.VISA_APPLICATION,
      privileges: [
        { name: 'New Visa Application', active: false },
        { name: 'Update Visa Application', active: false },
        { name: 'Submit Response', active: false }
      ],
      completed: false
    },
    {
      sn: 4,
      features: Features.ALL_USERS,
      privileges: [
        { name: 'Manage Students', active: false },
        { name: 'Manage Agents', active: false },
        { name: 'Pending Agents', active: false },
        { name: 'Enquires', active: false },
        { name: 'Assign Students', active: false },
        { name: 'Update Student', active: false },
        { name: 'New Student', active: false },
        { name: 'Assign Agents', active: false },
        { name: 'Update Agents', active: false },
        { name: 'New Agents', active: false },
        { name: 'Approve/Reject Agents', active: false },
        { name: 'Submit Response', active: false },
      ],
      completed: false
    },
    {
      sn: 5,
      features: Features.ALL_STAFFS,
      privileges: [
        { name: 'Update Staff', active: false },
        { name: 'New Staff', active: false },
        { name: 'View Details', active: false },
      ],
      completed: false
    },
    {
      sn: 6,
      features: Features.PAYMENTS,
      privileges: [
        { name: 'New Payments', active: false },
        { name: 'Invoice', active: false },
        { name: 'Drafts', active: false },
        { name: 'View Details', active: false },
      ],
      completed: false
    },
    {
      sn: 7,
      features: Features.REPORTS,
      privileges: [
        { name: 'Overview', active: false },
      ],
      completed: false
    },
    {
      sn: 8,
      features: Features.MESSAGINGS,
      privileges: [
        { name: 'Send/Inbox', active: false },
      ],
      completed: false
    },
    {
      sn: 9,
      features: Features.SETTINGS,
      privileges: [
        { name: 'Overview', active: false },
        { name: 'Edit Profile', active: false },
        { name: 'Change Password', active: false },
      ],
      completed: false
    },
  ]);

  const emailItems: DropdownItem[] = useMemo(() => {
    if (Array?.isArray(staffEmail)) {
      return staffEmail?.map((item: any) => ({ name: item.email }));
    }
    return [];
  }, [staffEmail]);

  const handleSelectEmail = useCallback((item: DropdownItem) => {
    setEmail(item?.name || null);
    setSelectedEmail(item?.name || null);
    setError("");
    setSuccess("");
    setHasNoPrivileges(false);
  }, []);

  useEffect(() => {
    if (staffId) {
      setPrivilegesLoading(true);
      setError("");
      setSuccess("");
      setHasNoPrivileges(false);
      dispatch(getUserPermittedPages({ id: staffId }) as any)
        .then((response: any) => {
          if (response?.payload && response?.payload?.pages) {
            if (response.payload.pages.length === 0) {
              setHasNoPrivileges(true);
              return;
            }
            const updatedPrivilegesData = privilegesData?.map(feature => {
              const permittedFeature = response?.payload?.pages?.find((p: any) => p?.feature === feature?.features);
              if (permittedFeature) {
                const updatedPrivileges = feature?.privileges?.map(privilege => ({
                  ...privilege,
                  active: permittedFeature?.pages?.includes(privilege?.name)
                }));
                return {
                  ...feature,
                  privileges: updatedPrivileges,
                  completed: updatedPrivileges?.some(p => p?.active)
                };
              }
              return feature;
            });
            setPrivilegesData(updatedPrivilegesData);
          } else {
            setHasNoPrivileges(true);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user permitted pages:", error);
          setError("Failed to fetch user privileges. Please try again.");
        })
        .finally(() => {
          setPrivilegesLoading(false);
        });
    }
  }, [staffId, dispatch]);

  const handleToggle = useCallback((feature: Features) => {
    setPrivilegesData(prev => 
      prev.map(item => {
        if (item.features === feature) {
          const newCompleted = !item?.completed;
          return {
            ...item,
            completed: newCompleted,
            privileges: item?.privileges?.map(p => ({
              ...p,
              active: newCompleted
            }))
          };
        }
        return item;
      })
    );
  }, []);

  const handlePrivilegeToggle = useCallback((feature: Features, privilegeName: string) => {
    setPrivilegesData(prev => 
      prev.map(item => {
        if (item.features === feature) {
          const updatedPrivileges = item.privileges.map(p => 
            p.name === privilegeName ? { ...p, active: !p.active } : p
          );
          return {
            ...item,
            privileges: updatedPrivileges,
            completed: updatedPrivileges.some(p => p.active)
          };
        }
        return item;
      })
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!email) {
      setError('Please select a staff email');
      return;
    }
  
    const body = {
      pages: privilegesData
        .filter(item => item?.completed && item?.privileges?.some(p => p.active))
        .map(item => ({
          feature: item.features,
          pages: item.privileges?.filter(p => p.active)?.map(p => p.name)
        }))
    };
  
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await dispatch(UpdatePagePermission({ body, email }) as any);
      
      if (response?.error) {
        throw new Error(response.error.message || 'Failed to update privileges');
      }
      
      setSuccess('Privileges updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update privileges. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, privilegesData, dispatch]);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Privileges</h1>
      <div className="overflow-hidden">
        <div className='w-[250px] mt-[1em]'>
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
        {error && (
          <Alert severity="error" className="mt-4 mb-4">{error}</Alert>
        )}
        {success && (
          <Alert severity="success" className="mt-4 mb-4">{success}</Alert>
        )}
        {hasNoPrivileges && selectedEmail && (
          <Alert severity="info" className="mt-4 mb-4">
            This user currently has no privileges assigned.
          </Alert>
        )}
        <table className="w-full mt-[2em]">
          <thead>
            <tr className='border-gray-200 border-border'>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privileges</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
            </tr>
          </thead>
          <tbody>
            {privilegesLoading ? (
              [...Array(5)].map((_, index) => <SkeletonRow key={index} />)
            ) : (
              privilegesData.map((item) => (
                <PrivilegeItem 
                  key={item.sn} 
                  {...item} 
                  onToggle={handleToggle}
                  onPrivilegeToggle={handlePrivilegeToggle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <button.PrimaryButton
        disabled={loading || privilegesLoading}
        className="m-auto mt-[5em] w-[35%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
        onClick={handleSave}
      >
         {loading ? (
          <ReactLoading
            color="#FFFFFF"
            width={25}
            height={25}
            type="spin"
          />
         ) : (
          "Save and Continue"
         )}
      </button.PrimaryButton>
    </div>
  );
};

export default Privileges;