import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid as MuiGrid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  DirectionsBus as BusIcon,
  MyLocation as LocationIcon,
  GpsFixed as GpsIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { useAuth } from '../../context/AuthContext';
import { busService } from '../../services/busService';

const Grid = MuiGrid as any;

const DriverDashboard = () => {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceActive, setAttendanceActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState(null);
  
  const timerRef = useRef(null);

  useEffect(() => {
    loadProfile();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadProfile = async () => {
    try {
      const data = await busService.getDriverProfile(user.username);
      setDriver(data);
      setAttendanceActive(data.attendanceActive);
    } catch (err) {
      setError('Failed to load driver profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (event) => {
    const active = event.target.checked;
    try {
      await busService.toggleAttendance(driver.id, active);
      setAttendanceActive(active);
      
      if (active) {
        startTracking();
      } else {
        stopTracking();
      }
    } catch (err) {
      setError('Failed to toggle attendance');
    }
  };

  const startTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Initial update
    updateLocation();
    
    // Set 5 second interval
    timerRef.current = setInterval(updateLocation, 5000);
  };

  const stopTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        try {
          if (driver) {
            await busService.updateLocation(driver.id, latitude, longitude);
            setLastSync(new Date().toLocaleTimeString());
          }
        } catch (err) {
          console.error('Location sync failed', err);
        }
      },
      (err) => setError(`Location error: ${err.message}`),
      { enableHighAccuracy: true }
    );
  };

  if (loading) return <Layout title="Bus Dashboard"><CircularProgress /></Layout>;

  return (
    <Layout title="Bus Driver Dashboard">
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <BusIcon sx={{ fontSize: 40, color: '#38BDF8' }} />
              <Typography variant="h4" fontWeight="800">
                Bus #{driver?.busNumber}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>
              Driver: {driver?.name}
            </Typography>
          </Grid>
          <Grid xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={attendanceActive}
                  onChange={toggleAttendance}
                  color="info"
                  sx={{ scale: '1.5', mr: 2 }}
                />
              }
              label={
                <Typography variant="h6" fontWeight="700">
                  {attendanceActive ? 'PORTAL ACTIVE' : 'PORTAL CLOSED'}
                </Typography>
              }
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                p: 2, 
                px: 3,
                borderRadius: 3,
                border: attendanceActive ? '2px solid #38BDF8' : '2px solid transparent'
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" /> Current Location
              </Typography>
              <Divider sx={{ my: 2 }} />
              {location ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid xs={6}>
                      <Typography variant="body2" color="text.secondary">Latitude</Typography>
                      <Typography variant="h5" fontWeight="700">{location.latitude.toFixed(6)}</Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography variant="body2" color="text.secondary">Longitude</Typography>
                      <Typography variant="h5" fontWeight="700">{location.longitude.toFixed(6)}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      icon={<GpsIcon />} 
                      label="GPS Active" 
                      color="success" 
                      variant="outlined" 
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Accuracy: High
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">Waiting for GPS signal...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon color="info" /> Sync Status
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ py: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Real-time synchronization frequency:
                </Typography>
                <Typography variant="h5" fontWeight="700">5 Seconds</Typography>
                
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Last synchronized at:</Typography>
                  <Typography variant="body2" fontWeight="700" color="primary">
                    {lastSync || '--:--:--'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, height: 4, bgcolor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                  {attendanceActive && (
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: '100%', 
                        bgcolor: '#38BDF8',
                        animation: 'progressSync 5s infinite linear'
                      }} 
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style>
        {`
          @keyframes progressSync {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </Layout>
  );
};

export default DriverDashboard;
