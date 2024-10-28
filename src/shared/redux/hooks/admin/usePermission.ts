import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const user = useSelector((state: any) => state.shared.user);

  const hasPermission = (feature: string, page: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.page.some((p:any) => p?.feature === feature && p?.pages?.includes(page));
  };
  return { hasPermission };
};
