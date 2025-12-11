import { useState } from 'react';
import { SimplePagination } from '../../components/SimplePagination';
import { useAlert } from '../../contexts/AlertContext';
import { Card, CardHeader, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box } from '@mui/material';
import { Search, Battery20, Battery30, Battery50, Battery60, Battery80, Battery90, BatteryFull } from '@mui/icons-material';

const DataControls = ({ selectedBattery, setSelectedBattery, startDate, setStartDate, endDate, setEndDate, onFetch, loading }) => (
    <Card sx={{ mb: 3 }}>
        <CardHeader title="Data Selection" />
        <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Battery</InputLabel>
                    <Select
                        value={selectedBattery}
                        label="Battery"
                        onChange={(e) => setSelectedBattery(e.target.value)}
                    >
                        <MenuItem value="BATT-000">BATT-000</MenuItem>
                        <MenuItem value="BATT-001">BATT-001</MenuItem>
                        <MenuItem value="BATT-002">BATT-002</MenuItem>
                    </Select>
                </FormControl>
                
                <TextField
                    label="Start Date & Time"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                
                <TextField
                    label="End Date & Time"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                
                <Button
                    variant="contained"
                    onClick={onFetch}
                    disabled={loading}
                    startIcon={<Search />}
                    sx={{ height: 'fit-content', alignSelf: 'end' }}
                >
                    {loading ? 'Loading...' : 'Fetch Data'}
                </Button>
            </Box>
        </CardContent>
    </Card>
);

const DataTable = ({ metricsData, currentPage, setCurrentPage, itemsPerPage }) => {
    if (!metricsData || metricsData.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📋</Typography>
                <Typography variant="body1" color="text.secondary">
                    Select battery and date range to view history data
                </Typography>
            </Box>
        );
    }

    const totalPages = Math.ceil(metricsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = metricsData.slice(startIndex, startIndex + itemsPerPage);

    const getSocColor = (soc) => {
        if (soc >= 80) return 'success';
        if (soc >= 40) return 'warning';
        return 'error';
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>SOC (%)</TableCell>
                            <TableCell>SOH (%)</TableCell>
                            <TableCell>Temperature (°C)</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData.map((record, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={`${Math.round(record.soc)}%`}
                                        color={getSocColor(record.soc)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{Math.round(record.soh)}%</TableCell>
                                <TableCell>{Math.round(record.temperature)}°C</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={record.charging ? 'Charging' : 'Idle'}
                                        color={record.charging ? 'warning' : 'info'}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, metricsData.length)} of {metricsData.length} records
                </Typography>
            </Box>
        </>
    );
};

export const BatteryDataScreen = () => {
    const { showAlert } = useAlert();
    const [selectedBattery, setSelectedBattery] = useState('BATT-000');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [metricsData, setMetricsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchMetricsData = async () => {
        if (!startDate || !endDate) {
            showAlert('Please select both start and end dates', 'warning');
            return;
        }

        setLoading(true);
        try {
            const startTime = new Date(startDate).toISOString().slice(0, -5);
            const endTime = new Date(endDate).toISOString().slice(0, -5);
            
            const response = await fetch(
                `http://localhost:8081/api/battery/${selectedBattery}/history?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`
            );
            
            if (response.ok) {
                const data = await response.json();
                setMetricsData(data);
                setCurrentPage(1);
            } else {
                showAlert('Failed to fetch history data', 'error');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            showAlert('Error fetching data', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Battery History Analysis</Typography>
                <Typography variant="body1" color="text.secondary">
                    View historical battery data and trends
                </Typography>
            </Box>
            
            <DataControls 
                selectedBattery={selectedBattery}
                setSelectedBattery={setSelectedBattery}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onFetch={fetchMetricsData}
                loading={loading}
            />
            
            <Card>
                <CardHeader title="History Data Table" />
                <CardContent>
                    <DataTable 
                        metricsData={metricsData} 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                    />
                    {metricsData && metricsData.length > 0 && (
                        <SimplePagination 
                            totalPages={Math.ceil(metricsData.length / itemsPerPage)}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};