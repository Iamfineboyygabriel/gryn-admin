import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/auth';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust this import based on your actual store setup
import { usePermissions } from '../redux/hooks/admin/usePermission';
import { findFirstAccessibleRoute, findFirstAccessibleRouteStaff } from './findFirstAccessibleRoute';
import { useCurrentUser } from '../redux/hooks/shared/getUserProfile';

interface DashboardGatewayProps {
  children: React.ReactNode;
}

const DashboardGateway: React.FC<DashboardGatewayProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const {userDetails} = useCurrentUser()
  const userRole = userDetails.data.role;

  useEffect(() => {
    const checkAccess = () => {
      let accessibleRoute: string | null;
      
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        accessibleRoute = findFirstAccessibleRoute(hasPermission);
      } else if (userRole === 'STAFF') {
        accessibleRoute = findFirstAccessibleRouteStaff(hasPermission);
      } else {
        console.error('Unexpected user role:', userRole);
        setShowModal(true);
        return;
      }

      if (!accessibleRoute) {
        setShowModal(true);
      } else if (accessibleRoute !== window.location.pathname) {
        navigate(accessibleRoute);
      }
    };

    checkAccess();
  }, [hasPermission, userRole, navigate]);

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">No Accessible Pages</h2>
        <p className="mb-4">You don't have permission to access any pages. You will be logged out.</p>
        <button
          onClick={() => {
            setShowModal(false);
            handleLogout(navigate);
          }}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
        >
          OK
        </button>
      </div>
    </div>
  );

  if (showModal) {
    return <Modal />;
  }

  return <>{children}</>;
};

export default DashboardGateway;