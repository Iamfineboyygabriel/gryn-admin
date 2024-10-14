// import React from 'react';
// import { usePermissions } from './usePermission';

// interface PrivateRouteProps {
//   element: React.ReactElement;
//   feature: string;
//   page: string;
// }

// export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
//   element,
//   feature,
//   page,
// }) => {
//   const { hasPermission } = usePermissions();

//   const isAllowed = hasPermission(feature, page);

//   if (!isAllowed) {
//     console.log(`User does NOT have permission for feature: ${feature}, page: ${page}`);
//   } else {
//     console.log(`User has permission for feature: ${feature}, page: ${page}`);
//   }

//   return element;
// };

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  
  const location = useLocation();

  const isAllowed = hasPermission(feature, page);

  if (!isAllowed) {
    return <Navigate to="/admin_login" state={{ from: location }} replace />;
  }

  return element;
};
