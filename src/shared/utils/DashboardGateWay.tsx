import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/auth';
import { useSelector } from 'react-redux';

interface DashboardGatewayProps {
  children: React.ReactNode;
}

const DashboardGateway: React.FC<DashboardGatewayProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.shared.user);

  useEffect(() => {
    const checkAccess = () => {
      setIsLoading(true);

      if (!user) {
        console.error('User not available');
        navigate('/admin_login');
        return;
      }

      if (user.role === 'SUPER_ADMIN') {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      const hasAnyPermission = user.page.some((p: any) => 
        p.pages && p.pages.length > 0
      );

      if (!hasAnyPermission) {
        setShowModal(true);
      } else {
        setHasAccess(true);
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [user, navigate]);

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

  if (!hasAccess) {
    return null; 
  }

  return <>{children}</>;
};

export default DashboardGateway;