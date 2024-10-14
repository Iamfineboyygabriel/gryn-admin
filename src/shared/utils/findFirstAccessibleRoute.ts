import { adminSideBarLinks, staffSidebarLinks } from "../../data/data";

type PermissionCheck = (feature: string, page: string) => boolean;

export const findFirstAccessibleRoute = (hasPermission: PermissionCheck): string | null => {
  for (const link of adminSideBarLinks) {
    if (!link.feature || !link.page || hasPermission(link.feature, link.page)) {
      return link.to;
    }
  }
  return null;
};

export const findFirstAccessibleRouteStaff = (hasPermission: PermissionCheck): string | null => {
    for (const link of staffSidebarLinks) {
      if (!link.feature || !link.page || hasPermission(link.feature, link.page)) {
        return link.to;
      }
    }
    return null;
  };