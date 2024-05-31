import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute: React.FC = () => {
    const { user } = useContext(UserContext)!; // Utilisez le contexte

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
