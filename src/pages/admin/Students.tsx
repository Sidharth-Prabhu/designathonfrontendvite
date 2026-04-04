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
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { adminService } from '../../services/adminService';

const Grid = MuiGrid as any;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    regdNumber: '',
    dept: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      username: '',
      password: '',
      regdNumber: '',
      dept: '',
      phone: '',
      email: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (student) => {
    setIsEdit(true);
    setSelectedStudent(student);
    setFormData({
      username: student.user?.username || student.username,
      password: '', // Leave blank for security
      regdNumber: student.regdNumber,
      dept: student.dept,
      phone: student.phone,
      email: student.email,
    });
    setOpenDialog(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
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
      ? ['username', 'regdNumber', 'dept', 'phone', 'email']
      : ['username', 'password', 'regdNumber', 'dept', 'phone', 'email'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    try {
      if (isEdit) {
        await adminService.updateStudent(selectedStudent.id, formData);
        setSuccess('Student updated successfully!');
      } else {
        await adminService.addStudent(formData);
        setSuccess('Student added successfully!');
      }
      setOpenDialog(false);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save student');
    }
  };

  return (
    <Layout title="Students Management">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
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
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Students List
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Students: {students.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            background: 'white',
            color: '#1E3A8A',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Add New Student
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
                <TableCell>Registration No.</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(30, 58, 138, 0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={`#${student.id}`}
                      size="small"
                      sx={{
                        background: 'rgba(30, 58, 138, 0.1)',
                        color: '#1E3A8A',
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
                          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          mr: 2,
                        }}
                      >
                        {(student.user?.username || student.username)?.charAt(0).toUpperCase()}
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        {student.user?.username || student.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500" sx={{ color: '#1E3A8A' }}>
                      {student.regdNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.dept}
                      size="small"
                      sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {student.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {student.phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ color: '#1E3A8A' }} onClick={() => handleOpenView(student)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#F97316' }} onClick={() => handleOpenEdit(student)}>
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

      {/* Add/Edit Student Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E3A8A' }}>
          {isEdit ? <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> : <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />}
          {isEdit ? 'Edit Student' : 'Add New Student'}
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
                label="Registration Number"
                name="regdNumber"
                value={formData.regdNumber}
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
              background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
              px: 3,
            }}
          >
            {isEdit ? 'Update Student' : 'Add Student'}
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
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', color: '#1E3A8A' }}>
          Student Details
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '2rem',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
                }}
              >
                {(selectedStudent.user?.username || selectedStudent.username)?.charAt(0).toUpperCase()}
              </Box>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                {selectedStudent.user?.username || selectedStudent.username}
              </Typography>
              <Chip 
                label={selectedStudent.regdNumber} 
                sx={{ mb: 3, fontWeight: 600, background: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' }} 
              />
              
              <Box sx={{ width: '100%', mt: 2 }}>
                <DetailRow label="Department" value={selectedStudent.dept} />
                <DetailRow label="Email" value={selectedStudent.email} />
                <DetailRow label="Phone" value={selectedStudent.phone} />
                <DetailRow label="User ID" value={`#${selectedStudent.user?.id || 'N/A'}`} />
                <DetailRow label="Account Role" value="STUDENT" />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setViewDialogOpen(false)} 
            variant="contained"
            sx={{ borderRadius: 2, background: '#1E3A8A', px: 4 }}
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

export default Students;
