import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DasboardLayout";
import Home from "../../pages/dashboard/home/Home";
import Application from "../../pages/dashboard/application/Application";
import Payment from "../../pages/dashboard/payment/main/Payments";
import Messaging from "../../pages/dashboard/messaging/Message";
import Settings from "../../pages/dashboard/settings/Settings";
import Report from "../../pages/dashboard/reports copy/main/Report";
import ViewApplication from "../../pages/dashboard/application/manageApplication/view/main/ApplicationDetails";
import NewStudent from "../../pages/dashboard/application/manageStudents/newStudent/NewStudent";
import ApplicationDetails from "../../pages/dashboard/application/manageStudents/applicationDetail/main/ApplicationDetails";
import ViewStudentApplication from "../../../../staff/components/pages/dashboard/application/manageStudents/applicationDetail/view/main/ViewApplication";
import AgentDetails from "../../pages/dashboard/application/manageAgents/agentDetails/main/AgentDetails";
import ViewAgentStudentApplication from "../../pages/dashboard/application/manageAgents/agentDetails/manageStudents/view/main/ViewApplication";
import NewApplication from "../../pages/dashboard/application/manageApplication/newApplication/main/NewApplication";
import UpdateApplication from "../../pages/dashboard/application/manageApplication/update/newApplication/main/NewApplication";
import Visa from "../../pages/dashboard/visa/main/Visa";
import NewVisaApplication from "../../pages/dashboard/visa/newVisa/main/NewApplication";
import GenerateInvoice from "../../pages/dashboard/payment/allInvoices/generateInvoice/GenerateInvoice";
const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="application" element={<Application />} />
        <Route path="payments" element={<Payment />} />
        <Route path="reports" element={<Report />} />
        <Route path="messages" element={<Messaging />} />
        <Route path="settings" element={<Settings />} />
        <Route
          path="/application/manage_application/view_application"
          element={<ViewApplication />}
        />

        <Route
          path="/application/manage_student/new_student"
          element={<NewStudent />}
        />
        <Route
          path="/application/manage_student/application_details"
          element={<ApplicationDetails />}
        />
        <Route
          path="/application/manage_student/view_Application"
          element={<ViewStudentApplication />}
        />

        <Route
          path="/application/manage_agent/agent_details"
          element={<AgentDetails />}
        />
        <Route
          path="/application/manage_agent/manage_student/view_application"
          element={<ViewAgentStudentApplication />}
        />
        <Route
          path="/application/manage_application/new_application"
          element={<NewApplication />}
        />
        <Route
          path="/application/manage_application/update_application"
          element={<UpdateApplication />}
        />
        <Route path="/visa" element={<Visa />} />
        <Route path="/visa/new_application" element={<NewVisaApplication />} />

        <Route path="/payments/generate_invoice" element={<GenerateInvoice />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
