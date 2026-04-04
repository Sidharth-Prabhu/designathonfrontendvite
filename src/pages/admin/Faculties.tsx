import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid as MuiGrid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { adminService } from '../../services/adminService';

const Grid = MuiGrid as any;

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    staffCode: '',
    dept: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await adminService.getFaculties();
      setFaculties(data);
    } catch (err) {
      setError('Failed to load faculties');
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      username: '',
      password: '',
      staffCode: '',
      dept: '',
      phone: '',
      email: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (faculty) => {
    setIsEdit(true);
    setSelectedFaculty(faculty);
    setFormData({
      username: faculty.user?.username || faculty.username,
      password: '',
      staffCode: faculty.staffCode,
      dept: faculty.dept,
      phone: faculty.phone,
      email: faculty.email,
    });
    setOpenDialog(true);
  };

  const handleOpenView = (faculty) => {
    setSelectedFaculty(faculty);
    setViewDialogOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = isEdit
      ? ['username', 'staffCode', 'dept', 'phone', 'email']
      : ['username', 'password', 'staffCode', 'dept', 'phone', 'email'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    try {
      if (isEdit) {
        await adminService.updateFaculty(selectedFaculty.id, formData);
        setSuccess('Faculty updated successfully!');
      } else {
        await adminService.addFaculty(formData);
        setSuccess('Faculty added successfully!');
      }
      setOpenDialog(false);
      loadFaculties();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save faculty');
    }
  };

  return (
    <Layout title="Faculties Management">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="700" gutterBottom>
            <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Faculties List
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Faculty Members: {faculties.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            background: 'white',
            color: '#0066CC',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Add New Faculty
        </Button>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Staff Code</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faculties.map((faculty) => (
                <TableRow
                  key={faculty.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 102, 204, 0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={`#${faculty.id}`}
                      size="small"
                      sx={{
                        background: 'rgba(0, 102, 204, 0.1)',
                        color: '#0066CC',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          mr: 2,
                        }}
                      >
                        {(faculty.user?.username || faculty.username)?.charAt(0).toUpperCase()}
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        {faculty.user?.username || faculty.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500" sx={{ color: '#0066CC' }}>
                      {faculty.staffCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={faculty.dept}
                      size="small"
                      sx={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3B82F6',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {faculty.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {faculty.phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ color: '#0066CC' }} onClick={() => handleOpenView(faculty)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#F97316' }} onClick={() => handleOpenEdit(faculty)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Faculty Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0066CC' }}>
          {isEdit ? <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> : <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />}
          {isEdit ? 'Edit Faculty' : 'Add New Faculty'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label={isEdit ? "Password (leave blank to keep current)" : "Password"}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEdit}
                variant="outlined"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Staff Code"
                name="staffCode"
                value={formData.staffCode}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Department"
                name="dept"
                value={formData.dept}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
              px: 3,
            }}
          >
            {isEdit ? 'Update Faculty' : 'Add Faculty'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', color: '#0066CC' }}>
          Faculty Details
        </DialogTitle>
        <DialogContent>
          {selectedFaculty && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '2rem',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
                }}
              >
                {(selectedFaculty.user?.username || selectedFaculty.username)?.charAt(0).toUpperCase()}
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                {selectedFaculty.user?.username || selectedFaculty.username}
              </Typography>
              <Chip 
                label={selectedFaculty.staffCode} 
                sx={{ mb: 3, fontWeight: 600, background: 'rgba(0, 102, 204, 0.1)', color: '#0066CC' }} 
              />
              
              <Box sx={{ width: '100%', mt: 2 }}>
                <DetailRow label="Department" value={selectedFaculty.dept} />
                <DetailRow label="Email" value={selectedFaculty.email} />
                <DetailRow label="Phone" value={selectedFaculty.phone} />
                <DetailRow label="User ID" value={`#${selectedFaculty.user?.id || 'N/A'}`} />
                <DetailRow label="Account Role" value="FACULTY" />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setViewDialogOpen(false)} 
            variant="contained"
            sx={{ borderRadius: 2, background: '#0066CC', px: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

// Helper component for detail rows
const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
    <Typography variant="body2" color="text.secondary" fontWeight="500">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="600">
      {value}
    </Typography>
  </Box>
);

export default Faculties;
