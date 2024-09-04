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
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
