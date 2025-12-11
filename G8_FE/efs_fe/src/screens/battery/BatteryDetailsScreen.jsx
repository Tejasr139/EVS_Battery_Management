import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { Card, CardContent, CardHeader, Typography, Button, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { Battery20, Battery30, Battery50, Battery60, Battery80, Battery90, BatteryFull, Bolt, ThermostatAuto, Favorite, FlashOn } from '@mui/icons-material';

const StatusCard = ({ title, value, unit, color, icon, width = 3, cardWidth }) => (
    <Grid item xs={width}>
        <Card sx={{ 
            textAlign: 'center', 
            height: '100%',
            minHeight: 160,
            width: cardWidth,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 4
            }
        }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2, color, fontSize: '2.5rem' }}>
                    {icon}
                </Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
                    {value}{unit}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
);

const ControlButton = ({ onClick, color, icon, children, buttonWidth }) => (
    <Button 
        onClick={onClick}
        variant="contained"
        color={color}
        startIcon={icon}
        fullWidth
        size="large"
        sx={{ mb: 2, py: 1.5, fontSize: '1rem', width: buttonWidth }}
    >
        {children}
    </Button>
);

const ChartCanvas = ({ canvasRef, batteryData }) => {
    const drawChart = (data) => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        const socValues = data.map(d => d.soc);
        const minSoc = Math.min(...socValues) - 5;
        const maxSoc = Math.max(...socValues) + 5;
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        if (data.length > 1) {
            ctx.strokeStyle = '#007bff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            data.forEach((point, index) => {
                const x = padding + (index * chartWidth / (data.length - 1));
                const y = height - padding - ((point.soc - minSoc) / (maxSoc - minSoc)) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            ctx.fillStyle = '#007bff';
            data.forEach((point, index) => {
                const x = padding + (index * chartWidth / (data.length - 1));
                const y = height - padding - ((point.soc - minSoc) / (maxSoc - minSoc)) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = maxSoc - (i * (maxSoc - minSoc) / 5);
            const y = padding + (i * chartHeight / 5) + 4;
            ctx.fillText(Math.round(value) + '%', padding - 10, y);
        }
        
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillText('SOC Over Time', width / 2, 20);
    };

    useEffect(() => {
        if (batteryData && batteryData.length > 0) {
            drawChart(batteryData);
        }
    }, [batteryData]);

    return (
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={300} 
            style={{width: '100%', height: 'auto', maxHeight: '300px'}}
        />
    );
};

export const BatteryDetailsScreen = () => {
    const { batteryId } = useParams();
    const { showAlert } = useAlert();
    const { theme } = useTheme();
    const muiTheme = useMuiTheme();
    const [batteryData, setBatteryData] = useState(null);
    const [recentReadings, setRecentReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    const roundValue = (value) => Math.round(value * 10) / 10;

    const handleCharge = async (targetSoc) => {
        try {
            const response = await fetch(`/api/charge/${targetSoc}?batteryId=${batteryId}&currentSoc=${targetSoc}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            if (response.ok) {
                showAlert(`Charge to ${targetSoc}% initiated successfully`, 'success');
                fetchBatteryData();
            } else {
                showAlert('Failed to initiate charge', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('CORS Error: Backend server needs to allow cross-origin requests', 'error');
        }
    };

    const handleDischarge = async (targetSoc) => {
        try {
            const response = await fetch(`/api/discharge/${targetSoc}?batteryId=${batteryId}&currentSoc=${Math.round(batteryData.soc)}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            if (response.ok) {
                showAlert(`Discharge to ${targetSoc}% initiated successfully`, 'success');
                fetchBatteryData();
            } else {
                showAlert('Failed to initiate discharge', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('CORS Error: Backend server needs to allow cross-origin requests', 'error');
        }
    };

    const fetchBatteryData = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/battery/all');
            if (response.ok) {
                const data = await response.json();
                const batteryData = data.filter(item => item.batteryId === batteryId);
                
                if (batteryData.length > 0) {
                    const sortedData = batteryData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setBatteryData(sortedData[0]);
                    setRecentReadings(sortedData.slice(0, 5));
                } else {
                    setBatteryData(null);
                    setRecentReadings([]);
                }
            }
        } catch (error) {
            console.error('Error fetching battery data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatteryData();
        const interval = setInterval(fetchBatteryData, 5000);
        return () => clearInterval(interval);
    }, [batteryId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!batteryData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Alert severity="warning">Battery data not found</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Battery {batteryId} Details</Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time monitoring and control
                </Typography>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <StatusCard 
                    title="SOC" 
                    value={roundValue(batteryData.soc)} 
                    unit="%" 
                    color={muiTheme.palette.primary.main} 
                    icon={<BatteryFull />}
                    width={3}
                    cardWidth="180px"
                />
                <StatusCard 
                    title="SOH" 
                    value={roundValue(batteryData.soh)} 
                    unit="%" 
                    color="success.main" 
                    icon={<Favorite />}
                    cardWidth="180px"
                />
                <StatusCard 
                    title="Temperature" 
                    value={roundValue(batteryData.temperature)} 
                    unit="°C" 
                    color="error.main" 
                    icon={<ThermostatAuto />}
                    cardWidth="180px"
                />
                <StatusCard 
                    title="Status" 
                    value={batteryData.is_charging ? "Charging" : "Idle"} 
                    unit="" 
                    color={batteryData.is_charging ? "warning.main" : "info.main"} 
                    icon={batteryData.is_charging ? <Bolt /> : <Battery50 />}
                    cardWidth="180px"
                />
            </Grid>

            <Card sx={{ mb: 4 }}>
                <CardHeader 
                    title="Battery Control" 
                    sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        '& .MuiCardHeader-title': { fontWeight: 600 }
                    }} 
                />
                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
                                ⚡ Charge Controls
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <ControlButton 
                                    onClick={() => handleCharge(60)}
                                    color="warning"
                                    icon={<FlashOn />}
                                    buttonWidth="350px"
                                >
                                    Charge to 60%
                                </ControlButton>
                                <ControlButton 
                                    onClick={() => handleCharge(80)}
                                    color="success"
                                    icon={<BatteryFull />}
                                    
                                >
                                    Charge to 80%
                                </ControlButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
                                🔋 Discharge Controls
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <ControlButton 
                                    onClick={() => handleDischarge(50)}
                                    color="info"
                                    icon={<Battery50 />}
                                    buttonWidth="350px"
                                >
                                    Discharge to 50%
                                </ControlButton>
                                <ControlButton 
                                    onClick={() => handleDischarge(20)}
                                    color="error"
                                    icon={<Battery20 />}
                                >
                                    Discharge to 20%
                                </ControlButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Card sx={{ height: 500, maxWidth: '550px' }}>
                        <CardHeader 
                            title="📈 Performance Chart" 
                            sx={{ 
                                bgcolor: 'secondary.main', 
                                color: 'white',
                                '& .MuiCardHeader-title': { fontWeight: 600 }
                            }} 
                        />
                        <CardContent sx={{ p: 3, height: 'calc(100% - 64px)' }}>
                            <ChartCanvas canvasRef={canvasRef} batteryData={recentReadings.slice().reverse()} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ height: 500, maxWidth: '400px' }}>
                        <CardHeader 
                            title="📊 Recent Readings" 
                            sx={{ 
                                bgcolor: 'info.main', 
                                color: 'white',
                                '& .MuiCardHeader-title': { fontWeight: 600 }
                            }} 
                        />
                        <CardContent sx={{ p: 3, height: 'calc(100% - 64px)', overflow: 'auto' }}>
                            <Box>
                                {recentReadings.map((reading, index) => (
                                    <Box key={index} sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        py: 2, 
                                        px: 1,
                                        borderBottom: '1px solid #eee',
                                        '&:hover': { bgcolor: 'grey.50' }
                                    }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                            {new Date(reading.timestamp).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                                            {roundValue(reading.soc)}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};