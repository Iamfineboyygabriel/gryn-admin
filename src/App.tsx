import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StaffLanding from "./shared/landing/StaffLogin";
import AdminLogin from "./shared/landing/AdminLogin";
import ForgotPassword from "./staff/components/pages/auth/ForgotPassword";
import RecoveryMail from "./staff/components/pages/auth/RecoveryMessage";
import ResetPassword from "./staff/components/pages/auth/ResetPassword";
import StaffRoutes from "./staff/components/dashboard/routes/DashboardRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StaffLanding />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/forgot_Password" element={<ForgotPassword />} />
        <Route path="/recovery_mail" element={<RecoveryMail />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/staff/dashboard/*" element={<StaffRoutes />} />
     </Routes>
    </Router>
  );
}

export default App;
