import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DasboardLayout";
import Home from "../../pages/dashboard/home/main/Home";
import Application from "../../pages/dashboard/application/main/Application";
import ViewApplicationDetails from "../../pages/dashboard/application/allApplication/viewApplicationDetails/main/ViewDetails";
import ViewDirectApplicationDetails from "../../pages/dashboard/application/allApplication/directApplication/viewApplicationDetails/main/ViewDetails";
import NewApplication from "../../pages/dashboard/application/newApplication/main/NewApplication";
import Settings from "../../pages/dashboard/settings/Settings";
import Messaging from "../../pages/dashboard/messaging/Message";
import Visa from "../../pages/dashboard/visa/main/Visa";
import NewVisaApplication from "../../pages/dashboard/visa/newVisa/main/NewApplication";
import AllUsers from "../../pages/dashboard/allUsers/main/AllUsers";
import CreateStudent from "../../pages/dashboard/allUsers/manageStudents/createStudent/CreateStudent";
import UpdateStudent from "../../pages/dashboard/allUsers/manageStudents/updateStudent/UpdateStudent";
import CreateAgent from "../../pages/dashboard/allUsers/manageAgents/createAgent/CreateAgent";
import UpdateApplication from "../../pages/dashboard/application/updateApplication/main/UpdateApplication";
import ApprovePendingAgent from "../../pages/dashboard/allUsers/pendingAgents/approvePendingAgent/main/ApprovePendingAgent";
import UpdateAgent from "../../../../shared/updateAgent/main/UpdateAgent";
import AssignAgent from "../../pages/dashboard/allUsers/manageAgents/assignAgent/main/AssignAgent";
import AllStudentApplications from "../../pages/dashboard/allUsers/manageStudents/allStudentApplications/AllStudentApplications";
import ViewApplication from "../../pages/dashboard/allUsers/manageStudents/allStudentApplications/ViewApplication";
import ViewVisaApplication from "../../../components/pages/dashboard/visa/viewVisaApplication/main/ViewApplication";
import Report from "../../pages/dashboard/Reports/main/Report";
import { useCurrentUser } from "../../../../shared/redux/hooks/shared/getUserProfile";
import Budgets from "../../pages/dashboard/Reports/budgets/main/Budgets";
import NewBudgets from "../../pages/dashboard/Reports/budgets/newBudgets/NewBudgets";
import SeeAllApplication from "../../pages/dashboard/Reports/seeAll/SeeAllApplication";
import SeeAllPendingApplication from "../../pages/dashboard/Reports/seeAll/SeeAllPendingApplication";
import SeeAllAgents from "../../pages/dashboard/Reports/seeAll/SeeAllAgents";
import AddNewSchool from "../../pages/dashboard/application/addNewSchool/AddNewSchool";
import AgentDetails from "../../pages/dashboard/allUsers/manageAgents/agentDetails/main/AgentDetails";
import AllStaff from "../../pages/dashboard/allStaffs/main/AllStaff";
import Notification from "../../pages/dashboard/notification/main/Notification";
import CreateNews from "../../pages/dashboard/notification/news/createNews/CreateNews";
import SeeAllStudents from "../../pages/dashboard/Reports/seeAll/SeeAllStudents";
import ViewStaffProfile from "../../pages/dashboard/allStaffs/viewStaffProfile/main/ViewStaffProfile";
import NewInvoice from "../../pages/dashboard/allStaffs/viewStaffProfile/invoices/NewInvoice";
import SeeAllStaffs from "../../pages/dashboard/Reports/seeAll/SeeAllStaffs";
import SeeAllPendingAgents from "../../pages/dashboard/Reports/seeAll/SeeAllPendingAgents";
import Payment from "../../pages/dashboard/payment/main/Payment";
import CreateStaff from "../../pages/dashboard/allStaffs/createStaff/CreateStaff";
import NewCommission from "../../pages/dashboard/allUsers/manageAgents/agentCommission/NewCommission";
import NewAdmin from "../../pages/dashboard/settings/superAdmin/adminManagement/newAdmin/NewAdmin";
import RoleDetails from "../../pages/dashboard/settings/superAdmin/roleManagement/newRole/main/RoleDetails";
import NewPayment from "../../pages/dashboard/payment/newPayment/NewPayment";
import NewSalary from "../../pages/dashboard/allStaffs/viewStaffProfile/salary/newSalary/NewSalary";
import { PrivateRoute } from "../../../../shared/redux/hooks/admin/PrivateRoute";
import SeeAllTopAgents from "../../pages/dashboard/Reports/seeAll/SeeAllTopAgents";
import SeeAllTransaction from "../../pages/dashboard/Reports/transaction/SeeAllTransaction";
import Instagram from "../../pages/dashboard/Reports/seeAll/enquiries/Instagram";
import ViewDetails from "../../pages/dashboard/Reports/seeAll/enquiries/ViewDetails";

const ProtectedSuperAdminRoute = ({ children }: any) => {
  const { userDetails } = useCurrentUser();
  const isSuperAdmin = userDetails?.data.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return <Navigate to="/admin/dashboard/home" replace />;
  }

  return children;
};

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
        <Route path="application" element={<Application />} />

        <Route
          path="/application/all_application/view_application"
          element={<ViewApplicationDetails />}
        />
        <Route
          path="/application/direct_application/view_application"
          element={<ViewDirectApplicationDetails />}
        />
        <Route
          path="/application/new_application"
          element={<NewApplication />}
        />

        <Route
          path="/application/update_application"
          element={<UpdateApplication />}
        />

        <Route path="/application/new_school" element={<AddNewSchool />} />

        <Route path="/visa" element={<Visa />} />
        <Route path="/visa/new_application" element={<NewVisaApplication />} />
        <Route
          path="/visa/view_visa_application"
          element={<ViewVisaApplication />}
        />

        <Route path="all_users" element={<AllUsers />} />
        <Route path="/all_users/create_student" element={<CreateStudent />} />
        <Route path="/all_users/update_student" element={<UpdateStudent />} />

        <Route
          path="/all_users/student_applications"
          element={<AllStudentApplications />}
        />
        <Route path="/all_users/agent_details" element={<AgentDetails />} />
        <Route
          path="/all_users/agent_details/new_commission"
          element={<NewCommission />}
        />
        <Route
          path="/all_users/view_application"
          element={<ViewApplication />}
        />

        <Route path="/all_users/create_agent" element={<CreateAgent />} />
        <Route path="/all_users/update_agent" element={<UpdateAgent />} />
        <Route path="/all_users/assign_agent" element={<AssignAgent />} />

        <Route
          path="/all_users/approve_agents/:email"
          element={<ApprovePendingAgent />}
        />

        <Route path="all_staffs" element={<AllStaff />} />
        <Route path="/all_staffs/view_profile" element={<ViewStaffProfile />} />
        <Route path="/all_staffs/create_staff" element={<CreateStaff />} />
        <Route path="/all_staffs/new-salary" element={<NewSalary />} />
        <Route
          path="/all_staffs/view_profile/:staffEmail/new_invoice"
          element={<NewInvoice />}
        />

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
        <Route path="/reports/budgets" element={<Budgets />} />
        <Route path="/reports/new_budgets" element={<NewBudgets />} />
        <Route
          path="/reports/all_application"
          element={<SeeAllApplication />}
        />
        <Route path="/reports/all_top_agents" element={<SeeAllTopAgents />} />
        <Route
          path="/reports/all_transaction"
          element={<SeeAllTransaction />}
        />
        <Route
          path="/reports/all_pending_applications"
          element={<SeeAllPendingApplication />}
        />
        <Route path="/reports/all_agents" element={<SeeAllAgents />} />
        <Route path="/reports/all_students" element={<SeeAllStudents />} />
        <Route path="/reports/all_staffs" element={<SeeAllStaffs />} />
        <Route
          path="/reports/all_pending_agents"
          element={<SeeAllPendingAgents />}
        />
        <Route path="/reports/instagram" element={<Instagram />} />
        <Route path="/reports/view_details" element={<ViewDetails />} />

        <Route path="payments" element={<Payment />} />
        <Route path="/payments/new_payments" element={<NewPayment />} />

        <Route path="settings" element={<Settings />} />
        <Route path="messages" element={<Messaging />} />

        <Route path="notifications" element={<Notification />} />
        <Route path="/news/create_news" element={<CreateNews />} />

        <Route
          path="settings/admin_management/*"
          element={
            <ProtectedSuperAdminRoute>
              <Routes>
                <Route path="new_Admin" element={<NewAdmin />} />
              </Routes>
            </ProtectedSuperAdminRoute>
          }
        />

        <Route
          path="settings/role_management/*"
          element={
            <ProtectedSuperAdminRoute>
              <Routes>
                <Route path="new_role" element={<RoleDetails />} />
              </Routes>
            </ProtectedSuperAdminRoute>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
