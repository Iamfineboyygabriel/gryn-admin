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
import Visa from "../../pages/dashboard/visa/main/Visa";
import NewVisaApplication from "../../pages/dashboard/visa/newVisa/main/NewApplication";
import GenerateInvoice from "../../pages/dashboard/payment/allInvoices/generateInvoice/GenerateInvoice";
import UpdateApplication from "../../pages/dashboard/application/manageApplication/updateApplication/main/UpdateApplication";
import ViewVisaApplication from "../../pages/dashboard/visa/viewVisaApplication/main/ViewApplication";
import UpdateStudent from "../../pages/dashboard/application/manageStudents/allStudents/updateStudent/UpdateStudent";
import NewBudgets from "../../pages/dashboard/payment/newBudgets/NewBudgets";
import UseDraftInformation from "../../pages/dashboard/payment/drafts/useDraftInformation/UseDraftInformation";
import AddNewSchool from "../../pages/dashboard/application/addNewSchool/AddNewSchool";
import NewAgent from "../../pages/dashboard/application/manageAgents/newAgent/NewAgent";
import NewPayment from "../../pages/dashboard/payment/allPayment/newPayment/NewPayment";
import SeeAllStudents from "../../pages/dashboard/reports copy/seeAll/SeeAllStudents";
import SeeAllApplication from "../../pages/dashboard/reports copy/seeAll/SeeAllApplication";
import SeeAllPendingApplication from "../../pages/dashboard/reports copy/seeAll/SeeAllPendingApplication";
import SeeAllAgents from "../../pages/dashboard/reports copy/seeAll/SeeAllAgents";
import { PrivateRoute } from "../../../../shared/redux/hooks/admin/PrivateRoute";
import Notification from "../../pages/dashboard/notification/main/Notification";
import UpdatePayment from "../../pages/dashboard/payment/allPayment/updatePayment/UpdatePayment";
import ViewInvoice from "../../pages/dashboard/payment/allInvoices/viewInvoice/ViewInvoice";
import ViewDetails from "../../pages/dashboard/application/enquiries/ViewDetails";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path="home"
          element={
            <PrivateRoute
              element={<Home />}
              feature="DASHBOARD"
              page="Overview"
            />
          }
        />
        <Route path="notifications" element={<Notification />} />
        <Route path="application" element={<Application />} />

        <Route path="payments" element={<Payment />} />
        <Route
          path="reports"
          element={
            <PrivateRoute
              element={<Report />}
              feature="REPORTS"
              page="Overview"
            />
          }
        />
        <Route path="reports/all_students" element={<SeeAllStudents />} />
        <Route path="reports/all_application" element={<SeeAllApplication />} />
        <Route
          path="reports/all_pending_applications"
          element={<SeeAllPendingApplication />}
        />
        <Route path="reports/all_agents" element={<SeeAllAgents />} />
        <Route path="messages" element={<Messaging />} />
        <Route path="settings" element={<Settings />} />
        <Route
          path="/application/manage_application/view_application"
          element={<ViewApplication />}
        />

        <Route
          path="/application/manage_application/new_school"
          element={<AddNewSchool />}
        />
        <Route
          path="/application/manage_application/update_application"
          element={<UpdateApplication />}
        />

        <Route
          path="/application/manage_student/new_student"
          element={<NewStudent />}
        />

        <Route
          path="/application/manage_student/update_student"
          element={<UpdateStudent />}
        />
        <Route
          path="/application/manage_student/application_details/:studentId"
          element={<ApplicationDetails />}
        />
        <Route
          path="/application/manage_student/view_Application/:applicationId"
          element={<ViewStudentApplication />}
        />

        <Route
          path="/application/manage_agent/agent_details"
          element={<AgentDetails />}
        />
        <Route path="/application/create_agent" element={<NewAgent />} />
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
        <Route
          path="/application/enquiries/view_details"
          element={<ViewDetails />}
        />

        <Route path="/visa" element={<Visa />} />
        <Route path="/visa/new_application" element={<NewVisaApplication />} />
        <Route
          path="/visa/view_visa_application"
          element={<ViewVisaApplication />}
        />

        <Route path="/payments/new_payment" element={<NewPayment />} />
        <Route path="/payments/update_payment" element={<UpdatePayment />} />
        <Route
          path="/payments/generate_invoice"
          element={<GenerateInvoice />}
        />
        <Route path="/payments/view_invoice" element={<ViewInvoice />} />
        <Route
          path="/payments/use_draft_information"
          element={<UseDraftInformation />}
        />
        <Route path="/payments/new_budget" element={<NewBudgets />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
