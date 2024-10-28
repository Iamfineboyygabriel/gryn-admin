import React from 'react';
import { usePermissions } from './usePermission';

interface PrivateElementProps {
  children: React.ReactNode;
  feature: string;
  page: string;
}

export const PrivateElement: React.FC<PrivateElementProps> = ({ 
  children, 
  feature, 
  page 
}) => {
  const { hasPermission } = usePermissions();

  const isAllowed = hasPermission(feature, page);

  if (!isAllowed) {
    return null; 
  }

  return <>{children}</>; 
};
