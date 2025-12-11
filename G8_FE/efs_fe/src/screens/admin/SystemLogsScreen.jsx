import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Refresh, Download } from '@mui/icons-material';

export const SystemLogsScreen = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const mockLogs = [
        { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'System started successfully', source: 'System' },
        { id: 2, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'warning', message: 'Battery B001 temperature high', source: 'Battery Monitor' },
        { id: 3, timestamp: new Date(Date.now() - 600000).toISOString(), level: 'error', message: 'Failed to connect to database', source: 'Database' },
        { id: 4, timestamp: new Date(Date.now() - 900000).toISOString(), level: 'info', message: 'User admin logged in', source: 'Auth' },
        { id: 5, timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'info', message: 'Battery charge cycle completed', source: 'Battery Controller' }
    ];

    useEffect(() => {
        setLogs(mockLogs);
    }, []);

    const getChipColor = (level) => {
        switch (level) {
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'default';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === 'all' || log.level === filter;
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.source.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleRefresh = () => {
        // Refresh logs logic
        setLogs([...mockLogs, {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'Logs refreshed',
            source: 'System'
        }]);
    };

    const handleExport = () => {
        // Export logs logic
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'system-logs.json';
        link.click();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>System Logs</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button variant="contained" startIcon={<Download />} onClick={handleExport}>
                        Export
                    </Button>
                </Box>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Search logs"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 200 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Level</InputLabel>
                            <Select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                label="Level"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="info">Info</MenuItem>
                                <MenuItem value="warning">Warning</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Source</TableCell>
                                    <TableCell>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={log.level.toUpperCase()} 
                                                color={getChipColor(log.level)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{log.source}</TableCell>
                                        <TableCell>{log.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};