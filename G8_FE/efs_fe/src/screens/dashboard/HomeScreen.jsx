import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Chip } from '@mui/material';
import { Battery20, Battery30, Battery50, Battery60, Battery80, Battery90, BatteryFull } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

const BatteryCard = ({ battery, onClick, t }) => {
    const getStatusColor = (soc) => {
        if (soc >= 80) return 'success';
        if (soc >= 40) return 'warning';
        return 'error';
    };

    const getStatusText = (soc) => {
        if (soc >= 80) return t('dashboard.excellent');
        if (soc >= 40) return t('dashboard.good');
        return t('dashboard.low');
    };

    const getBatteryIcon = (soc) => {
        if (soc >= 90) return <BatteryFull />;
        if (soc >= 80) return <Battery90 />;
        if (soc >= 60) return <Battery80 />;
        if (soc >= 50) return <Battery60 />;
        if (soc >= 30) return <Battery50 />;
        if (soc >= 20) return <Battery30 />;
        return <Battery20 />;
    };

    return (
        <Grid item xs={12} md={4}>
            <Card 
                sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                    }
                }}
                onClick={() => onClick(battery.batteryId)}
            >
                <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2, color: getStatusColor(battery.soc) === 'success' ? 'success.main' : getStatusColor(battery.soc) === 'warning' ? 'warning.main' : 'error.main' }}>
                        {getBatteryIcon(battery.soc)}
                    </Box>
                    <Typography variant="h6" gutterBottom>{battery.batteryId}</Typography>
                    <Typography variant="h4" sx={{ mb: 1, color: getStatusColor(battery.soc) === 'success' ? 'success.main' : getStatusColor(battery.soc) === 'warning' ? 'warning.main' : 'error.main' }}>
                        {battery.soc}%
                    </Typography>
                    <Chip 
                        label={getStatusText(battery.soc)}
                        color={getStatusColor(battery.soc)}
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                        {t('dashboard.lastUpdated')}: {new Date(battery.timestamp).toLocaleTimeString()}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export const HomeScreen = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [batteries, setBatteries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBatteries = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/battery/all');
            if (response.ok) {
                const data = await response.json();
                const latestBatteries = ['BATT-000', 'BATT-001', 'BATT-002'].map(batteryId => {
                    const batteryRecords = data.filter(item => item.batteryId === batteryId);
                    return batteryRecords.length > 0 
                        ? batteryRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
                        : { batteryId, soc: 0, timestamp: new Date().toISOString() };
                });
                setBatteries(latestBatteries);
            }
        } catch (error) {
            console.error('Error fetching battery data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatteries();
        const interval = setInterval(fetchBatteries, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleBatteryClick = (batteryId) => {
        navigate(`/battery/${batteryId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>{t('dashboard.title')}</Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('dashboard.subtitle')}
                </Typography>
            </Box>
            
            <Grid container spacing={3}>
                {batteries.map((battery) => (
                    <BatteryCard 
                        key={battery.batteryId}
                        battery={battery}
                        onClick={handleBatteryClick}
                        t={t}
                    />
                ))}
            </Grid>
        </Box>
    );
};