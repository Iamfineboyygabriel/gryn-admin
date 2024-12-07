import React, { useState, useEffect, useMemo } from "react";
import ManageStudents from "../manageStudents/main/ManageStudents";
import ManageAgents from "../manageAgents/main/ManageAgents";
import PendingAgents from "../pendingAgents/main/PendingAgents";
import Enquiries from "../enquiries/main/AllEnquiries";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";
import { usePermissions } from "../../../../../../shared/redux/hooks/admin/usePermission";
import { button } from "../../../../../../shared/buttons/Button";

interface TabProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ isActive, label, onClick }) => (
  <div
    className={`cursor-pointer rounded-lg px-4 py-2.5 font-medium transition-colors
      ${
        isActive
          ? "bg-purple-white text-primary-700"
          : "bg-gray-100 text-grey-primary hover:bg-gray-200"
      }`}
    onClick={onClick}
  >
    <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
      {label}
    </button.PrimaryButton>
  </div>
);

const AllUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { hasPermission } = usePermissions();

  const tabs = useMemo(
    () => [
      {
        key: "manageStudents",
        label: "Manage Students",
        component: <ManageStudents />,
        feature: "ALL_USERS",
      },
      {
        key: "manageAgents",
        label: "Manage Agents",
        component: <ManageAgents />,
        feature: "ALL_USERS",
      },
      {
        key: "pendingAgents",
        label: "Pending Agents",
        component: <PendingAgents />,
        feature: "ALL_USERS",
      },
      {
        key: "enquiries",
        label: "Enquires",
        component: <Enquiries />,
        feature: "ALL_USERS",
      },
    ],
    []
  );

  const availableTabs = useMemo(
    () => tabs?.filter((tab) => hasPermission(tab?.feature, tab?.label)),
    [tabs, hasPermission]
  );

  useEffect(() => {
    if (availableTabs?.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]?.key);
    }
  }, [availableTabs, activeTab]);

  const activeComponent = useMemo(
    () => availableTabs?.find((tab) => tab?.key === activeTab)?.component,
    [availableTabs, activeTab]
  );

  return (
    <main className="font-outfit">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </header>

      <div className="h-auto w-full overflow-auto rounded-lg bg-white px-8 py-3 pb-40">
        <nav className="mb-3">
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap border-b-2 border-gray-100 py-4">
            {availableTabs?.map((tab) => (
              <PrivateElement
                key={tab?.key}
                feature={tab?.feature}
                page={tab?.label}
              >
                <Tab
                  isActive={activeTab === tab?.key}
                  label={tab?.label}
                  onClick={() => setActiveTab(tab?.key)}
                />
              </PrivateElement>
            ))}
          </div>
        </nav>

        <section className="mt-4">{activeComponent}</section>
      </div>
    </main>
  );
};

export default AllUsers;
