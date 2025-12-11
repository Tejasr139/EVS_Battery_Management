import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SessionProvider } from './contexts/SessionContext';
import { AlertProvider } from './contexts/AlertContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppRouter } from './routing/AppRouter';

export const App = () => (
    <LanguageProvider>
        <AlertProvider>
            <ThemeProvider>
                <Router>
                    <SessionProvider>
                        <AppRouter />
                    </SessionProvider>
                </Router>
            </ThemeProvider>
        </AlertProvider>
    </LanguageProvider>
);

export default App
