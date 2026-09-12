import { Navigate } from 'react-router-dom';
import { Signup } from './pages/signup';
import { Signin } from './pages/signin';
import { useAuth } from '../../authcontext';

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/signup" replace />;

  return children;
};