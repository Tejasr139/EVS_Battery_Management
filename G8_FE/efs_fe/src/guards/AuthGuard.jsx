import { useSession } from '../contexts/SessionContext';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
    const { isAuthenticated } = useSession();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};