import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const checkAuthentication = () => {
    const user = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    
    console.log('Auth check - user:', user);
    console.log('Auth check - token:', authToken);
    
    // Both user and authToken must exist
    if (!user || !authToken) {
      console.log('Missing user or token');
      return false;
    }
    
    try {
      const userData = JSON.parse(user);
      // Validate user data structure and authToken format
      if (!userData.email || !userData.name || !authToken.startsWith('authenticated_')) {
        console.log('Invalid user data or token format');
        return false;
      }
      console.log('Authentication valid');
      return true;
    } catch (error) {
      console.log('JSON parse error:', error);
      // Invalid JSON in localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      return false;
    }
  };
  
  const isAuthenticated = checkAuthentication();
  console.log('Final auth result:', isAuthenticated);
  
  if (!isAuthenticated) {
    // Clear any invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;