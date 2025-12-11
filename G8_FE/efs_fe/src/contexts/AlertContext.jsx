import { createContext, useContext, useState } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = (message, severity = 'info') => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, message, severity }]);
        
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 4000);
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Stack 
                spacing={2} 
                sx={{ 
                    position: 'fixed', 
                    top: 20, 
                    right: 20, 
                    zIndex: 9999,
                    maxWidth: 400 
                }}
            >
                {alerts.map((alert) => (
                    <Snackbar
                        key={alert.id}
                        open={true}
                        autoHideDuration={4000}
                        onClose={() => removeAlert(alert.id)}
                    >
                        <Alert 
                            variant="filled" 
                            severity={alert.severity}
                            onClose={() => removeAlert(alert.id)}
                        >
                            {alert.message}
                        </Alert>
                    </Snackbar>
                ))}
            </Stack>
        </AlertContext.Provider>
    );
};