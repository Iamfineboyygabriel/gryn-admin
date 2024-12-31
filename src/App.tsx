import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StaffLanding from "./shared/landing/StaffLogin";
import AdminLogin from "./shared/landing/AdminLogin";
import ForgotPassword from "./staff/components/pages/auth/ForgotPassword";
import RecoveryMail from "./staff/components/pages/auth/RecoveryMessage";
import ResetPassword from "./staff/components/pages/auth/ResetPassword";
import StaffRoutes from "./staff/components/dashboard/routes/DashboardRoutes";
import AdminRoutes from "./admin/components/dashboard/routes/DashboardRoutes";
import DashboardGateway from "./shared/utils/DashboardGateWay";
import PasswordSuccessful from "./staff/components/pages/auth/PasswordSuccessful";
import Landing from "./shared/home/Landing";
import VerifyAccount from "./shared/home/verifyOTP/VerifyAccount";
import ProtectedRoute from "./shared/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/staff_login" element={<StaffLanding />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/verify_account" element={<VerifyAccount />} />
        <Route path="/forgot_Password" element={<ForgotPassword />} />
        <Route path="/recovery_mail" element={<RecoveryMail />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/password_changed_Successfully"
          element={<PasswordSuccessful />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/staff/dashboard/*"
            element={
              <DashboardGateway>
                <StaffRoutes />
              </DashboardGateway>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin/dashboard/*"
            element={
              <DashboardGateway>
                <AdminRoutes />
              </DashboardGateway>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
