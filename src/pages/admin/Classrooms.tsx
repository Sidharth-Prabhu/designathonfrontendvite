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
  Grid as MuiGrid,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  MeetingRoom as RoomIcon,
  Edit as EditIcon,
  GroupAdd as GroupAddIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { adminService } from '../../services/adminService';
import Select from 'react-select';

const Grid = MuiGrid as any;

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [openAddStudentsDialog, setOpenAddStudentsDialog] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadClassrooms();
    loadStudents();
  }, []);

  const loadClassrooms = async () => {
    try {
      const data = await adminService.getClassrooms();
      setClassrooms(data);
    } catch (err) {
      setError('Failed to load classrooms');
    }
  };

  const loadStudents = async () => {
    try {
      const data = await adminService.getStudents();
      const options = data.map(s => ({
        value: s.id,
        label: `${s.regdNumber} - ${s.user?.username || s.username} (${s.dept})`
      }));
      setStudents(options);
    } catch (err) {
      console.error('Failed to load students for select', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({ name: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (classroom) => {
    setIsEdit(true);
    setSelectedClassroom(classroom);
    setFormData({ name: classroom.name });
    setOpenDialog(true);
  };

  const handleOpenAddStudents = (classroom) => {
    setSelectedClassroom(classroom);
    setSelectedStudents([]);
    setOpenAddStudentsDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await adminService.updateClassroom(selectedClassroom.id, formData);
        setSuccess('Classroom updated successfully!');
      } else {
        await adminService.createClassroom(formData);
        setSuccess('Classroom created successfully!');
      }
      setOpenDialog(false);
      loadClassrooms();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save classroom');
    }
  };

  const handleAddStudentsSubmit = async () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    try {
      const studentIds = selectedStudents.map(s => s.value);
      await adminService.addStudentsToClassroom(selectedClassroom.id, studentIds);
      setSuccess('Students added successfully!');
      setOpenAddStudentsDialog(false);
      loadClassrooms();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add students');
    }
  };

  const handleViewStudents = (classroom) => {
    setSelectedClassroom(classroom);
    setOpenStudentsDialog(true);
  };

  return (
    <Layout title="Classrooms Management">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
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
            <RoomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Classrooms List
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Classrooms: {classrooms.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            background: 'white',
            color: '#10B981',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Create Classroom
        </Button>
      </Paper>

      {/* Classrooms Grid */}
      <Grid container spacing={3}>
        {classrooms.map((classroom) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={classroom.id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                },
                position: 'relative',
              }}
            >
              {/* Card Header with Gradient */}
              <Box
                sx={{
                  height: 80,
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RoomIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
                <Chip
                  label={`${classroom.students?.length || 0} Students`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                
                <Box sx={{ position: 'absolute', top: 5, left: 5 }}>
                  <IconButton 
                    size="small" 
                    sx={{ color: 'white' }}
                    onClick={() => handleOpenEdit(classroom)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom noWrap title={classroom.name}>
                  {classroom.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ID: #{classroom.id}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewStudents(classroom)}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      borderColor: '#1E3A8A',
                      color: '#1E3A8A',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '&:hover': {
                        background: '#1E3A8A',
                        color: 'white',
                      },
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<GroupAddIcon />}
                    onClick={() => handleOpenAddStudents(classroom)}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      background: '#F97316',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '&:hover': {
                        background: '#EA580C',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Classroom Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#10B981' }}>
          {isEdit ? <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> : <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />}
          {isEdit ? 'Edit Classroom' : 'Create New Classroom'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Classroom Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder="e.g., CSE-2024-A"
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
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              px: 3,
            }}
          >
            {isEdit ? 'Update Classroom' : 'Create Classroom'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Students Dialog */}
      <Dialog
        open={openAddStudentsDialog}
        onClose={() => setOpenAddStudentsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#F97316' }}>
          <GroupAddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Add Students to {selectedClassroom?.name}
        </DialogTitle>
        <DialogContent sx={{ minHeight: 200 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Search and select students:
            </Typography>
            <Select
              isMulti
              options={students}
              value={selectedStudents}
              onChange={(newValue) => setSelectedStudents(newValue as any[])}
              placeholder="Type to search students..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  padding: '2px',
                  borderColor: '#CBD5E1',
                })
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenAddStudentsDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStudentsSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: '#F97316',
              px: 3,
              '&:hover': { background: '#EA580C' }
            }}
          >
            Add Selected Students
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog
        open={openStudentsDialog}
        onClose={() => setOpenStudentsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E3A8A' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RoomIcon sx={{ mr: 1 }} />
            Students in {selectedClassroom?.name}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClassroom?.students && selectedClassroom.students.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Registration No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedClassroom.students.map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(30, 58, 138, 0.04)',
                        },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#1E3A8A' }}>
                          {student.regdNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              mr: 2,
                              fontSize: '0.75rem',
                              background: 'rgba(30, 58, 138, 0.1)',
                              color: '#1E3A8A',
                            }}
                          >
                            {(student.user?.username || student.username)?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            {student.user?.username || student.username}
                          </Typography>
                        </Box>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <RoomIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No students enrolled yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add students to this classroom from the Students page
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenStudentsDialog(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
              px: 3,
            }}
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

export default Classrooms;
