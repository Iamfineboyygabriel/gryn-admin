import React from 'react';
import { usePermissions } from './usePermission';

interface PrivateRouteProps {
  element: React.ReactElement;
  feature: string;
  page: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  element,
  feature,
  page,
}) => {
  const { hasPermission } = usePermissions();

  const isAllowed = hasPermission(feature, page);

  if (!isAllowed) {
    console.log(`User does NOT have permission for feature: ${feature}, page: ${page}`);
  } else {
    console.log(`User has permission for feature: ${feature}, page: ${page}`);
  }

  return element;
};
