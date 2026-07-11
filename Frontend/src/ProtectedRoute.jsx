import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/menu" replace />;
  }

 
  return children;
};

export default ProtectedRoute;