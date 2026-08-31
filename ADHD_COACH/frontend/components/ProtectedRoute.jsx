import { Navigate } from 'react-router-dom';

import { useAuth } from '../../authcontext';

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/" replace />;

  return children;
};