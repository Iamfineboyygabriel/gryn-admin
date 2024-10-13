import { adminSideBarLinks } from "../../../../data/data";
import { usePermissions } from "./usePermission";

export const useFilteredSidebarLinks = () => {
  const { hasPermission } = usePermissions();

  const filteredLinks = adminSideBarLinks.filter(link => {
    const feature = link.text.toUpperCase(); 
    const page = link.text; 
    return hasPermission(feature, page);
  });

  return filteredLinks;
};
