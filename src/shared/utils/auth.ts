import { logOutUser } from "../redux/shared/services/shareLanding.services";

export const handleLogout = async (navigate: any) => {
  try {
    // await logOutUser();
    
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  }
};