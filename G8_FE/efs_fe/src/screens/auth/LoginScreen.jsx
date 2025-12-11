import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { useAlert } from '../../contexts/AlertContext';
import { Card, CardContent, TextField, Button, Typography, Box, Avatar } from '@mui/material';
import { Lock, Login } from '@mui/icons-material';



export const LoginScreen = () => {
    const navigate = useNavigate();
    const { login } = useSession();
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            showAlert('Please enter both email and password', 'warning');
            return;
        }

        try {
            const response = await fetch('http://localhost:8084/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseText = await response.text();

            if (response.ok && responseText.includes('success')) {
                console.log('Login API Response:', responseText);
                
                // Try to get user details from a separate API call
                try {
                    const userResponse = await fetch('http://localhost:8084/api/users', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (userResponse.ok) {
                        const allUsers = await userResponse.json();
                        console.log('All Users:', allUsers);
                        
                        // Find the logged-in user by email
                        const currentUser = allUsers.find(user => user.email === formData.email);
                        console.log('Current User Found:', currentUser);
                        
                        if (currentUser) {
                            const userData = {
                                id: currentUser.id,
                                name: `${currentUser.firstName} ${currentUser.lastName}`,
                                email: currentUser.email,
                                role: currentUser.role
                            };
                            console.log('Final User Data:', userData);
                            login(userData);
                            showAlert('Login successful!', 'success');
                            navigate('/home');
                            return;
                        }
                    }
                } catch (userFetchError) {
                    console.log('Failed to fetch user details:', userFetchError);
                }
                
                // Fallback if user details fetch fails
                const fallbackUserData = {
                    name: formData.email.split('@')[0],
                    email: formData.email,
                    role: 'USER'
                };
                console.log('Using Fallback User Data:', fallbackUserData);
                login(fallbackUserData);
                showAlert('Login successful!', 'success');
                navigate('/home');
            } else {
                showAlert('Invalid email or password', 'error');
                setFormData({ ...formData, password: '' });
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Network error. Please try again.', 'error');
        }
    };

    return (
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
                p: 3
            }}
        >
            <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 70, height: 70 }}>
                            <Lock sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue your journey
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            sx={{ mb: 4 }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Login />}
                            sx={{ mb: 3 }}
                        >
                            Sign In
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
                                    Create Account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};