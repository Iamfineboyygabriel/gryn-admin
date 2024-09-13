import { Routes, Route } from "react-router-dom";
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
import UpdateAgent from "../../pages/dashboard/allUsers/manageAgents/updateAgent/UpdateAgent";

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

        <Route path="/visa" element={<Visa />} />
        <Route path="/visa/new_application" element={<NewVisaApplication />} />

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
          path="/all_users/create_agent"
          element={<CreateAgent />}
        />
          <Route
          path="/all_users/update_agent"
          element={<UpdateAgent />}
        />
        
       <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
