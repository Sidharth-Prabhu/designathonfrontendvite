import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  DirectionsBus as BusIcon,
  Edit as EditIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { busService } from '../../services/busService';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    busNumber: '',
    busRoute: '',
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await busService.getAllDrivers();
      setDrivers(data);
    } catch (err) {
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setEditingDriver(null);
    setFormData({ username: '', password: '', name: '', busNumber: '', busRoute: '' });
    setOpen(true);
  };

  const handleEditOpen = (driver: any) => {
    setEditingDriver(driver);
    setFormData({
      username: driver.user?.username || '',
      password: '', // Don't show password
      name: driver.name,
      busNumber: driver.busNumber,
      busRoute: driver.busRoute || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDriver(null);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingDriver) {
        await busService.updateDriver(editingDriver.id, formData);
      } else {
        await busService.addDriver(formData);
      }
      loadDrivers();
      handleClose();
      setFormData({ username: '', password: '', name: '', busNumber: '', busRoute: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  if (loading) return <Layout title="Manage Drivers"><CircularProgress /></Layout>;

  return (
    <Layout title="Bus Driver Management">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="700">All Scheduled Drivers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2, px: 3, bgcolor: '#0066CC' }}
        >
          Register New Driver
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bus Info</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="600">{driver.name}</Typography>
                  <Typography variant="caption" color="text.secondary">@{driver.user?.username}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusIcon sx={{ color: '#0066CC', fontSize: 18 }} />
                    <Typography fontWeight="600">#{driver.busNumber}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RouteIcon sx={{ color: '#64748B', fontSize: 18 }} />
                    <Typography variant="body2">{driver.busRoute || 'Not set'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1.5, py: 0.5, borderRadius: 1,
                      bgcolor: driver.attendanceActive ? '#DCFCE7' : '#F1F5F9',
                      color: driver.attendanceActive ? '#166534' : '#64748B',
                      fontWeight: 700
                    }}
                  >
                    {driver.attendanceActive ? 'ACTIVE NOW' : 'IDLE'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOpen(driver)} size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingDriver ? <EditIcon color="primary" /> : <PersonAddIcon color="primary" />}
          {editingDriver ? 'Edit Driver' : 'Register Driver'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new driver account for bus fleet management.
          </Typography>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Bus Number"
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
          />
          <TextField
              fullWidth
              label="Bus Route (e.g. Route A - Downtown)"
              name="busRoute"
              value={formData.busRoute}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
          />
          {!editingDriver && (
            <>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="dense"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="dense"
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, borderRadius: 2 }}>
            {editingDriver ? 'Save Changes' : 'Register Driver'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AdminDrivers;
