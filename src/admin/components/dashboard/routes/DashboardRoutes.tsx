// import { Routes, Route } from "react-router-dom";
// import DashboardLayout from "../layout/DasboardLayout";
// import Home from "../../pages/dashboard/home/main/Home";
// import Application from "../../pages/dashboard/application/main/Application";
// import ViewApplicationDetails from "../../pages/dashboard/application/allApplication/viewApplicationDetails/main/ViewDetails";
// import NewApplication from "../../pages/dashboard/application/newApplication/main/NewApplication";
// import Settings from "../../pages/dashboard/settings/Settings";
// import Visa from "../../pages/dashboard/visa/main/Visa";
// import NewVisaApplication from "../../pages/dashboard/visa/newVisa/main/NewApplication";
// import AllUsers from "../../pages/dashboard/allUsers/main/AllUsers";
// import CreateStudent from "../../pages/dashboard/allUsers/manageStudents/createStudent/CreateStudent";
// import UpdateStudent from "../../pages/dashboard/allUsers/manageStudents/updateStudent/UpdateStudent";
// import CreateAgent from "../../pages/dashboard/allUsers/manageAgents/createAgent/CreateAgent";
// import UpdateApplication from "../../pages/dashboard/application/updateApplication/main/UpdateApplication";
// import ApprovePendingAgent from "../../pages/dashboard/allUsers/pendingAgents/approvePendingAgent/main/ApprovePendingAgent";
// import UpdateAgent from "../../../../shared/updateAgent/main/UpdateAgent";
// import AssignAgent from "../../pages/dashboard/allUsers/manageAgents/assignAgent/main/AssignAgent";
// import AllStudentApplications from "../../pages/dashboard/allUsers/manageStudents/allStudentApplications/AllStudentApplications";
// import ViewApplication from "../../pages/dashboard/allUsers/manageStudents/allStudentApplications/ViewApplication";
// import ViewVisaApplication from "../../../components/pages/dashboard/visa/viewVisaApplication/main/ViewApplication";
// import Report from "../../pages/dashboard/Reports/main/Report"

// const DashboardRoutes = () => {
//   return (
//     <DashboardLayout>
//       <Routes>
//         <Route path="home" element={<Home />} />
//         <Route path="application" element={<Application />} />
//         <Route
//           path="/application/all_application/view_application/:applicationId"
//           element={<ViewApplicationDetails />}
//         />
//         <Route
//           path="/application/new_application"
//           element={<NewApplication />}
//         />

//          <Route
//           path="/application/update_application"
//           element={<UpdateApplication />}
//         />

        
//         <Route path="/visa" element={<Visa />} />
//         <Route path="/visa/new_application" element={<NewVisaApplication />} />
//         <Route path="/visa/view_visa_application/:applicationId" element={<ViewVisaApplication />} />

//         <Route path="all_users" element={<AllUsers />} />
//         <Route
//           path="/all_users/create_student"
//           element={<CreateStudent />}
//         />
//          <Route
//           path="/all_users/update_student"
//           element={<UpdateStudent />}
//         />

//           <Route
//           path="/all_users/student_applications/:studentId"
//           element={<AllStudentApplications />}
//         />
//           <Route
//           path="/all_users/view_application/:applicationId"
//           element={<ViewApplication />}
//         />

//          <Route
//           path="/all_users/create_agent"
//           element={<CreateAgent />}
//         />
//           <Route
//           path="/all_users/update_agent"
//           element={<UpdateAgent />}
//         />
//           <Route
//           path="/all_users/assign_agent"
//           element={<AssignAgent />}
//         />
      
//          <Route
//           path="/all_users/approve_agents/:email"
//           element={<ApprovePendingAgent />}
//         />
//           <Route path="reports" element={<Report />} />
//        <Route path="settings" element={<Settings />} />
//       </Routes>
//     </DashboardLayout>
//   );
// };

// export default DashboardRoutes;


import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DasboardLayout";
import Home from "../../pages/dashboard/home/main/Home";
import Application from "../../pages/dashboard/application/main/Application";
import ViewApplicationDetails from "../../pages/dashboard/application/allApplication/viewApplicationDetails/main/ViewDetails";
import NewApplication from "../../pages/dashboard/application/newApplication/main/NewApplication";
import Settings from "../../pages/dashboard/settings/Settings";
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
import Report from "../../pages/dashboard/Reports/main/Report"
import { useCurrentUser } from "../../../../shared/redux/hooks/shared/getUserProfile";
import Budgets from "../../pages/dashboard/Reports/budgets/main/Budgets";
import NewBudgets from "../../pages/dashboard/Reports/budgets/newBudgets/NewBudgets";

const ProtectedSuperAdminRoute = ({ children }:any) => {
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
        <Route path="home" element={<Home />} />
        <Route path="application" element={<Application />} />
        <Route
          path="/application/all_application/view_application/:applicationId"
          element={<ViewApplicationDetails />}
        />
        <Route
          path="/application/new_application"
          element={<NewApplication />}
        />

         <Route
          path="/application/update_application"
          element={<UpdateApplication />}
        />

        
        <Route path="/visa" element={<Visa />} />
        <Route path="/visa/new_application" element={<NewVisaApplication />} />
        <Route path="/visa/view_visa_application/:applicationId" element={<ViewVisaApplication />} />

        <Route path="all_users" element={<AllUsers />} />
        <Route
          path="/all_users/create_student"
          element={<CreateStudent />}
        />
         <Route
          path="/all_users/update_student"
          element={<UpdateStudent />}
        />

          <Route
          path="/all_users/student_applications/:studentId"
          element={<AllStudentApplications />}
        />
          <Route
          path="/all_users/view_application/:applicationId"
          element={<ViewApplication />}
        />

         <Route
          path="/all_users/create_agent"
          element={<CreateAgent />}
        />
          <Route
          path="/all_users/update_agent"
          element={<UpdateAgent />}
        />
          <Route
          path="/all_users/assign_agent"
          element={<AssignAgent />}
        />
      
         <Route
          path="/all_users/approve_agents/:email"
          element={<ApprovePendingAgent />}
        />
          <Route path="reports" element={<Report />} />
          <Route path="/reports/budgets" element={<Budgets />} />
          <Route path="/reports/new_budgets" element={<NewBudgets />} />
          <Route path="settings" element={<Settings />} />

       <Route path="settings/admin_management/*" element={
          <ProtectedSuperAdminRoute>
            <Routes>
              {/* <Route path="create_admin" element={<CreateAdmin />} /> */}
            </Routes>
          </ProtectedSuperAdminRoute>
        } />

        <Route path="settings/role_management/*" element={
          <ProtectedSuperAdminRoute>
            <Routes>
              {/* <Route path="view_role/:roleId" element={<ViewRole />} /> */}
            </Routes>
          </ProtectedSuperAdminRoute>
        } />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
