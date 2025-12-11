import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Switch, FormControlLabel, Chip, Pagination, Stack } from '@mui/material';
import { Add, Edit, Delete, PersonAdd, Security, Block } from '@mui/icons-material';
import { useAlert } from '../../contexts/AlertContext';

export const UserManagementScreen = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        gender: 'Male',
        role: 'USER'
    });
    const { showAlert } = useAlert();

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8084/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setTotalPages(Math.ceil(data.length / usersPerPage));
            }
        } catch (error) {
            showAlert('Failed to fetch users', 'error');
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedUsers = users.slice(
        (page - 1) * usersPerPage,
        page * usersPerPage
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = () => {
        setEditUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            gender: 'Male',
            role: 'USER'
        });
        setOpen(true);
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            password: '',
            confirmPassword: '',
            gender: user.gender || 'Male',
            role: user.role || 'USER'
        });
        setOpen(true);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (editUser) {
                const response = await fetch(`http://localhost:8084/api/users/${editUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    showAlert('User updated successfully', 'success');
                    fetchUsers();
                }
            } else {
                const response = await fetch('http://localhost:8084/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    showAlert('User added successfully', 'success');
                    fetchUsers();
                }
            }
            setOpen(false);
        } catch (error) {
            showAlert('Operation failed', 'error');
        }
        setLoading(false);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8084/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showAlert('User deleted successfully', 'success');
                fetchUsers();
            }
        } catch (error) {
            showAlert('Failed to delete user', 'error');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:8084/api/users/${userId}/role?role=${newRole}`, {
                method: 'PUT'
            });
            if (response.ok) {
                showAlert('Role updated successfully', 'success');
                fetchUsers();
            }
        } catch (error) {
            showAlert('Failed to update role', 'error');
        }
    };

    const handleAccessToggle = async (userId, active) => {
        try {
            const response = await fetch(`http://localhost:8084/api/users/${userId}/access?active=${active}`, {
                method: 'PUT'
            });
            if (response.ok) {
                showAlert('Access updated successfully', 'success');
                fetchUsers();
            }
        } catch (error) {
            showAlert('Failed to update access', 'error');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>User Management</Typography>
                <Button variant="contained" startIcon={<PersonAdd />} onClick={handleAddUser}>
                    Add User
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="USER">USER</MenuItem>
                                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={user.active !== false}
                                                        onChange={(e) => handleAccessToggle(user.id, e.target.checked)}
                                                        size="small"
                                                    />
                                                }
                                                label={user.active !== false ? 'Active' : 'Inactive'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditUser(user)} color="primary">
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(user.id)} color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Stack spacing={2}>
                            <Pagination 
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                            <Typography variant="body2" color="text.secondary" align="center">
                                Showing {((page - 1) * usersPerPage) + 1}-{Math.min(page * usersPerPage, users.length)} of {users.length} users
                            </Typography>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <MenuItem value="USER">USER</MenuItem>
                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};