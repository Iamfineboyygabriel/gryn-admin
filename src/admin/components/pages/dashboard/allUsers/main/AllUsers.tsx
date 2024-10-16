import React, { useState, useEffect } from "react";
import { button } from "../../../../../../shared/buttons/Button";
import ManageStudents from "../manageStudents/main/ManageStudents";
import ManageAgents from "../manageAgents/main/ManageAgents";
import PendingAgents from "../pendingAgents/main/PendingAgents";
import Enquiries from "../enquiries/main/AllEnquiries";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";

type LinkKey = "manageStudents" | "manageAgents" | "pendingAgents" | "enquiries";

interface Link {
  key: LinkKey;
  label: string;
  component: React.ReactNode;
}

const checkPermission = (feature: string, page: string): boolean => {
  const permissions:any = {
    "ALL_USERS": {
      "Manage Students": false,
      "Manage Agents": false,
      "Pending Agents": true,
      "Enquiries": false
    }
  };
  return permissions[feature]?.[page] ?? false;
};

const AllUsers: React.FC = () => {
  const [activeLink, setActiveLink] = useState<LinkKey | null>(null);
  const [availableLinks, setAvailableLinks] = useState<Link[]>([]);

  const links: Link[] = [
    { key: "manageStudents", label: "Manage Students", component: <ManageStudents /> },
    { key: "manageAgents", label: "Manage Agents", component: <ManageAgents /> },
    { key: "pendingAgents", label: "Pending Agents", component: <PendingAgents /> },
    { key: "enquiries", label: "Enquiries", component: <Enquiries /> }
  ];

  useEffect(() => {
    const permittedLinks = links.filter(link => 
      checkPermission("ALL_USERS", link.label)
    );
    setAvailableLinks(permittedLinks);

    if (permittedLinks?.length > 0 && !activeLink) {
      setActiveLink(permittedLinks[0].key);
    }
  }, []);

  const renderContent = () => {
    const currentLink = availableLinks.find(link => link.key === activeLink);
    return currentLink ? currentLink.component : null;
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
              {availableLinks.map(link => (
                <PrivateElement key={link.key} feature="ALL_USERS" page={link.label}>
                  <div
                    className={`${
                      activeLink === link.key
                        ? "bg-purple-white text-primary-700"
                        : "bg-gray-100 text-grey-primary"
                    } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                    onClick={() => setActiveLink(link.key)}
                  >
                    <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                      {link.label}
                    </button.PrimaryButton>
                  </div>
                </PrivateElement>
              ))}
            </div>
          </nav>
          <section className="mt-3">
            {renderContent()}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AllUsers;