import { useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Grid, TextField, Button, Switch, FormControlLabel, Divider } from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import { useAlert } from '../../contexts/AlertContext';

export const SystemSettingsScreen = () => {
    const [settings, setSettings] = useState({
        systemName: 'EFS Battery Management System',
        refreshInterval: 5000,
        maxBatteries: 100,
        alertThreshold: 20,
        enableNotifications: true,
        enableAutoRefresh: true,
        enableDarkMode: false,
        maintenanceMode: false
    });

    const { showAlert } = useAlert();

    const handleSave = () => {
        // Save settings logic here
        showAlert('Settings saved successfully', 'success');
    };

    const handleReset = () => {
        setSettings({
            systemName: 'EFS Battery Management System',
            refreshInterval: 5000,
            maxBatteries: 100,
            alertThreshold: 20,
            enableNotifications: true,
            enableAutoRefresh: true,
            enableDarkMode: false,
            maintenanceMode: false
        });
        showAlert('Settings reset to defaults', 'info');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>System Settings</Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="General Settings" />
                        <CardContent>
                            <TextField
                                fullWidth
                                label="System Name"
                                value={settings.systemName}
                                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Refresh Interval (ms)"
                                type="number"
                                value={settings.refreshInterval}
                                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Max Batteries"
                                type="number"
                                value={settings.maxBatteries}
                                onChange={(e) => setSettings({ ...settings, maxBatteries: parseInt(e.target.value) })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Alert Threshold (%)"
                                type="number"
                                value={settings.alertThreshold}
                                onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="System Preferences" />
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.enableNotifications}
                                        onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                                    />
                                }
                                label="Enable Notifications"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.enableAutoRefresh}
                                        onChange={(e) => setSettings({ ...settings, enableAutoRefresh: e.target.checked })}
                                    />
                                }
                                label="Enable Auto Refresh"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.enableDarkMode}
                                        onChange={(e) => setSettings({ ...settings, enableDarkMode: e.target.checked })}
                                    />
                                }
                                label="Enable Dark Mode"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <Divider sx={{ my: 2 }} />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                        color="warning"
                                    />
                                }
                                label="Maintenance Mode"
                                sx={{ mb: 2, display: 'block' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                    Save Settings
                </Button>
                <Button variant="outlined" startIcon={<Refresh />} onClick={handleReset}>
                    Reset to Defaults
                </Button>
            </Box>
        </Box>
    );
};