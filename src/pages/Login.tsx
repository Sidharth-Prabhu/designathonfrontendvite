import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.login(username, password);
      login(userData);
      navigate(userData.redirectUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#F4F6F9',
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          color: '#FFFFFF',
        }}
      >
        <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
          {/* Logo Placeholder */}
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 70, color: '#0066CC' }} />
          </Box>
          <Typography variant="h3" fontWeight="700" gutterBottom>
            Attendance Portal
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            Smart Attendance System
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Manage attendance, students, and faculty all in one place
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 450,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="600" color="#333" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body1" color="#666">
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} variant="filled">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#FAFAFA',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LoginIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#FAFAFA',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004C99 0%, #003D80 100%)',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={28} sx={{ color: 'white' }} /> : 'Sign In'}
            </Button>
          </form>

          {/* Test Credentials */}
          <Paper
            variant="outlined"
            sx={{
              mt: 4,
              p: 3,
              bgcolor: '#FAFAFA',
              borderColor: '#E0E0E0',
            }}
          >
            <Typography variant="subtitle2" color="#0066CC" gutterBottom fontWeight="600">
              📋 Test Credentials
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #E0E0E0' }}>
                <Typography variant="body2" fontWeight="500">
                  <Box component="span" sx={{ color: '#0066CC' }}>🔷</Box> Admin
                </Typography>
                <Typography variant="body2" color="#666" sx={{ fontFamily: 'monospace', bgcolor: '#F0F0F0', px: 1, borderRadius: 1 }}>
                  admin / admin123
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #E0E0E0' }}>
                <Typography variant="body2" fontWeight="500">
                  <Box component="span" sx={{ color: '#FF6600' }}>🟠</Box> Faculty
                </Typography>
                <Typography variant="body2" color="#666" sx={{ fontFamily: 'monospace', bgcolor: '#F0F0F0', px: 1, borderRadius: 1 }}>
                  faculty1 / admin123
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight="500">
                  <Box component="span" sx={{ color: '#28A745' }}>🟢</Box> Student
                </Typography>
                <Typography variant="body2" color="#666" sx={{ fontFamily: 'monospace', bgcolor: '#F0F0F0', px: 1, borderRadius: 1 }}>
                  student1 / admin123
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="#999">
              © 2026 Null Pointers
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
