import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid as MuiGrid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem as MuiListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Snackbar,
  Paper,
  Checkbox,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Class as ClassIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { facultyService } from '../../services/facultyService';

const Grid = MuiGrid as any;
const ListItem = MuiListItem as any;

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadClasses();
    loadStudents();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await facultyService.getMyClasses();
      setClasses(data);
    } catch (err) {
      setError('Failed to load classes');
    }
  };

  const loadStudents = async () => {
    try {
      const data = await facultyService.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students');
    }
  };

  const handleToggleStudent = (studentId) => {
    const currentIndex = selectedStudents.indexOf(studentId);
    const newChecked = [...selectedStudents];

    if (currentIndex === -1) {
      newChecked.push(studentId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedStudents(newChecked);
  };

  const handleCreateClass = async () => {
    try {
      await facultyService.createCustomClass({
        name: className,
        studentIds: selectedStudents,
      });
      setSuccess('Class created successfully!');
      setOpenDialog(false);
      setClassName('');
      setSelectedStudents([]);
      loadClasses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create class');
    }
  };

  return (
    <Layout title="My Classes">
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
            <ClassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            My Classes
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Classes: {classes.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'white',
            color: '#1E3A8A',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Create Custom Class
        </Button>
      </Paper>

      {/* Classes Grid */}
      <Grid container spacing={3}>
        {classes.map((classroom) => (
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
              }}
            >
              <Box
                sx={{
                  height: 100,
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClassIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.8)' }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" fontWeight="600" color="white">
                    {classroom.students?.length || 0} Students
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
                  {classroom.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ID: #{classroom.id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {classes.length === 0 && (
          <Grid xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: 'rgba(241, 245, 249, 0.5)',
              }}
            >
              <ClassIcon sx={{ fontSize: 80, color: '#CBD5E1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No classes yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first custom class to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                }}
              >
                Create Class
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Create Class Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E3A8A' }}>
          <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Create Custom Class
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Data Structures - Section A"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
          <Typography variant="subtitle2" gutterBottom fontWeight="600" color="#1E3A8A">
            Select Students ({selectedStudents.length} selected)
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              maxHeight: 350,
              overflow: 'auto',
              borderRadius: 2,
              borderColor: '#E2E8F0',
            }}
          >
            <List sx={{ p: 0 }}>
              {students.map((student) => {
                const labelId = `checkbox-list-label-${student.id}`;
                const isSelected = selectedStudents.indexOf(student.id) !== -1;
                return (
                  <ListItem
                    key={student.id}
                    button
                    onClick={() => handleToggleStudent(student.id)}
                    sx={{
                      borderBottom: '1px solid #F1F5F9',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(30, 58, 138, 0.04)',
                      },
                      ...(isSelected && {
                        backgroundColor: 'rgba(249, 115, 22, 0.08)',
                      }),
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                          color: '#F97316',
                          '&.Mui-checked': {
                            color: '#F97316',
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={
                        <Typography variant="body2" fontWeight="500">
                          {student.user?.username || student.username}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {student.regdNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • {student.dept}
                          </Typography>
                        </Box>
                      }
                    />
                    {isSelected && (
                      <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={!className || selectedStudents.length === 0}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
              px: 3,
              '&:disabled': {
                background: '#CBD5E1',
              },
            }}
          >
            Create Class
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

export default Classes;
