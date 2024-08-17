import { ReactNode } from "react";
import Header from "../../dashboard/header/Header";
import Sidebar from "../sidebar/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="h-auto flex-1 overflow-y-auto bg-gray-100 px-[1.3em] py-[1.5em] font-outfit lg:px-[1.5em] dark:bg-gray-700">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
