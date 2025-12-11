import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, CircularProgress } from '@mui/material';
import { useSession } from '../contexts/SessionContext';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';

export const Layout = ({ children }) => {
    const { user } = useSession();

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
            <Box sx={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1200 }}>
                <Sidebar />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, ml: '280px' }}>
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h5">🏠 Welcome {user.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ThemeToggle />
                            <ProfileDropdown user={user} />
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 4, flexGrow: 1, overflow: 'auto' }}>
                    {children || <Outlet />}
                </Box>
            </Box>
        </Box>
    );
};