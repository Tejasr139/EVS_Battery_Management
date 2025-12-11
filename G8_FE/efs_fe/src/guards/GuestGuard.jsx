import { useSession } from '../contexts/SessionContext';
import { Navigate } from 'react-router-dom';

export const GuestGuard = ({ children }) => {
    const { isAuthenticated } = useSession();
    
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }
    
    return children;
};