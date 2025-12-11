import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkAuth = () => {
        const savedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (savedUser && authToken) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
            return true;
        } else {
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    };

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', 'authenticated_' + Date.now());
        localStorage.setItem('sessionEvent', Date.now().toString());
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.setItem('sessionEvent', Date.now().toString());
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    useEffect(() => {
        checkAuth();

        const handleStorageChange = (e) => {
            if (e.key === 'sessionEvent' || e.key === 'user' || e.key === 'authToken') {
                const isAuth = checkAuth();
                if (!isAuth && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    navigate('/login');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    return (
        <SessionContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
            {children}
        </SessionContext.Provider>
    );
};