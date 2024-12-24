import { ReactNode } from "react";
import Header from "../../dashboard/header/Header";
import Sidebar from "../sidebar/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="h-auto flex-1 overflow-y-auto bg-gray-100 px-[1.3em] py-[1.5em] font-outfit dark:bg-gray-700 md:min-w-[700px] lg:px-[1.5em]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
