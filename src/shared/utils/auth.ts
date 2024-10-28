export const handleLogout = (navigate: any) => {
  sessionStorage.clear();
  localStorage.clear();
  navigate("/");
};
