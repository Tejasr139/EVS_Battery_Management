import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthGuard } from '../guards/AuthGuard';
import { GuestGuard } from '../guards/GuestGuard';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/dashboard/HomeScreen';
import { BatteryDetailsScreen } from '../screens/battery/BatteryDetailsScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { BatteryDataScreen } from '../screens/battery/BatteryDataScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { SystemSettingsScreen } from '../screens/admin/SystemSettingsScreen';
import { SystemLogsScreen } from '../screens/admin/SystemLogsScreen';
import { Layout } from '../components/Layout';

export const AppRouter = () => (
    <Routes>
        <Route path="/login" element={
            <GuestGuard>
                <LoginScreen />
            </GuestGuard>
        } />
        
        <Route path="/register" element={
            <GuestGuard>
                <RegisterScreen />
            </GuestGuard>
        } />
        
        <Route element={
            <AuthGuard>
                <Layout>
                    <Outlet />
                </Layout>
            </AuthGuard>
        }>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/battery/:batteryId" element={<BatteryDetailsScreen />} />
            <Route path="/analytics" element={<AnalyticsScreen />} />
            <Route path="/battery-data" element={<BatteryDataScreen />} />
            <Route path="/admin/users" element={<UserManagementScreen />} />
            <Route path="/admin/settings" element={<SystemSettingsScreen />} />
            <Route path="/admin/logs" element={<SystemLogsScreen />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
);