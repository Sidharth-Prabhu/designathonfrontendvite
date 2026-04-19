import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid as MuiGrid,
  Avatar,
  Button,
} from '@mui/material';
import {
  DirectionsBus as BusIcon,
  Circle as CircleIcon,
  Sync as SyncIcon,
  Add as AddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';

const Grid = MuiGrid as any;

const AdminBusTracker = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Record<string, any>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`http://localhost:8080/api/bus/admin/tracker/stream?token=${token}`);

    eventSource.onopen = () => {
      setConnected(true);
      console.log('Bus tracking SSE connected');
    };

    eventSource.addEventListener('busUpdate', (event: any) => {
      const data = JSON.parse(event.data);
      setBuses((prev) => ({
        ...prev,
        [data.driverId]: {
          ...data,
          lastSeen: new Date().toLocaleTimeString()
        },
      }));
    });

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const busList = Object.values(buses) as any[];
  const activeCount = busList.filter(b => b.active).length;

  return (
    <Layout title="Live Bus Tracker">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/drivers')}
          sx={{ borderRadius: 2, px: 3, bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
        >
          Add Bus Driver
        </Button>
        <Button
          variant="outlined"
          startIcon={<PeopleIcon />}
          onClick={() => navigate('/admin/drivers')}
          sx={{ borderRadius: 2, px: 3, borderColor: '#0066CC', color: '#0066CC' }}
        >
          Manage Fleet
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 4, 
              background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
              color: 'white',
              mb: 3,
              boxShadow: '0 8px 32px rgba(0, 102, 204, 0.2)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" fontWeight="900">{activeCount}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Buses Right Now</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'white', color: '#0066CC' }}>
                  <BusIcon />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircleIcon sx={{ fontSize: 10, color: connected ? '#4ADE80' : '#EF4444' }} />
                <Typography variant="caption">{connected ? 'Live Sync Active' : 'Connecting...'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 2, px: 3, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="700">Real-Time Fleet Status</Typography>
              <SyncIcon sx={{ animation: connected ? 'spin 5s linear infinite' : 'none', color: '#64748B' }} />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Bus #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role / Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Live Coordinates</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Sync</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {busList.length > 0 ? (
                    busList.map((bus) => (
                      <TableRow key={bus.driverId} sx={{ '&:hover': { bgcolor: 'rgba(0,102,204,0.02)' } }}>
                        <TableCell>
                          <Typography variant="body1" fontWeight="700">#{bus.busNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={bus.active ? 'COLLECTING PASSENGERS' : 'OFF DUTY'} 
                            size="small"
                            color={bus.active ? 'success' : 'default'}
                            sx={{ fontWeight: 600, px: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
                            {bus.latitude.toFixed(5)}, {bus.longitude.toFixed(5)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {bus.lastSeen}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Waiting for driver connections...</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </Layout>
  );
};

export default AdminBusTracker;
