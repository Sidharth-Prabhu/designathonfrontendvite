import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid as MuiGrid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Layout from '../Layout';
import { facultyService } from '../../services/facultyService';

const Grid = MuiGrid as any;

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Portal State
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalExpiry, setPortalExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadClasses();
  }, []);

  // Reload attendance when date changes
  useEffect(() => {
    if (selectedClass) {
      handleClassChange(selectedClass);
    }
  }, [date]);

  useEffect(() => {
    let timer = null;
    if (portalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        const now = dayjs();
        const expiry = dayjs(portalExpiry);
        const diff = expiry.diff(now, 'second');
        if (diff <= 0) {
          setPortalOpen(false);
          setTimeLeft(0);
          clearInterval(timer);
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [portalOpen, portalExpiry, timeLeft]);

  // Real-time updates via SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (selectedClass && portalOpen) {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/faculty/attendance/stream/${selectedClass}?token=${token}`;
      
      eventSource = new EventSource(url);

      eventSource.addEventListener('attendanceUpdate', (event: any) => {
        try {
          const data = JSON.parse(event.data);
          setAttendance((prev) => ({
            ...prev,
            [data.regdNumber]: data.status,
          }));
        } catch (err) {
          console.error('Failed to parse attendance update', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
        eventSource?.close();
      };
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [selectedClass, portalOpen]);

  const loadClasses = async () => {
    try {
      const data = await facultyService.getMyClasses();
      setClasses(data);
    } catch (err) {
      setError('Failed to load classes');
    }
  };

  const checkPortalStatus = async (classId) => {
    try {
      const status = await facultyService.getPortalStatus(classId);
      if (status.isOpen) {
        setPortalOpen(true);
        setPortalExpiry(status.expiry);
        const now = dayjs();
        const expiry = dayjs(status.expiry);
        setTimeLeft(expiry.diff(now, 'second'));
      } else {
        setPortalOpen(false);
        setTimeLeft(0);
      }
    } catch (err) {
      console.error('Failed to check portal status');
    }
  };

  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    checkPortalStatus(classId);
    try {
      const data = await facultyService.getClassroomStudents(classId);
      setStudents(data);
      // Check for existing attendance for this class and date
      const formattedDate = date.format('YYYY-MM-DD');
      const existingAttendance = await facultyService.getAttendanceByClassAndDate(classId, formattedDate);
      
      const initialAttendance = {};
      
      // Default all to ABSENT
      data.forEach((student) => {
        initialAttendance[student.regdNumber] = 'ABSENT';
      });

      // Override with existing records if they exist
      if (existingAttendance && existingAttendance.length > 0) {
        existingAttendance.forEach((record) => {
          if (record.student && record.student.regdNumber) {
            initialAttendance[record.student.regdNumber] = record.status;
          }
        });
      }

      setAttendance(initialAttendance);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const handleOpenPortal = async () => {
    if (!selectedClass) return;
    try {
      const response = await facultyService.openPortal(selectedClass);
      setPortalOpen(true);
      setPortalExpiry(response.expiry);
      setTimeLeft(120); // 2 minutes
      setSuccess('Attendance portal is now OPEN for 2 minutes!');
    } catch (err) {
      setError('Failed to open portal');
    }
  };

  const handleAttendanceChange = (regdNumber, status) => {
    setAttendance((prev) => ({
      ...prev,
      [regdNumber]: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      await facultyService.markAttendance(
        selectedClass,
        date.format('YYYY-MM-DD'),
        attendance
      );
      setSuccess('Attendance marked successfully!');
      setAttendance({});
      setStudents([]);
      setSelectedClass(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case 'ABSENT':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'OD_INTERNAL':
        return { bg: 'rgba(249, 115, 22, 0.1)', color: '#F97316' };
      case 'OD_EXTERNAL':
        return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
      case 'LEAVE':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8' };
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout title="Mark Attendance">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="700">
                Mark Attendance
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Select a class and mark attendance for students
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Select Class */}
          <Grid xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom color="text.secondary">
                  <EventIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  Select Class
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    value={selectedClass || ''}
                    label="Select Class"
                    onChange={(e) => handleClassChange(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F97316',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F97316',
                      },
                    }}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ClassIcon sx={{ mr: 2, color: '#1E3A8A' }} />
                          {cls.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Select Date */}
          <Grid xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom color="text.secondary">
                  <EventIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  Select Date
                </Typography>
                <DatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  sx={{
                    mt: 2,
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#E2E8F0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#F97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#F97316',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Portal Controls */}
        {selectedClass && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: portalOpen 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                : 'rgba(30, 58, 138, 0.05)',
              border: portalOpen ? 'none' : '1px dashed #1E3A8A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="700" sx={{ color: portalOpen ? 'white' : '#1E3A8A' }}>
                {portalOpen ? 'Attendance Portal is OPEN' : 'Manual Attendance Marking'}
              </Typography>
              <Typography variant="body2" sx={{ color: portalOpen ? 'white' : 'text.secondary', opacity: 0.8 }}>
                {portalOpen 
                  ? `Students can now mark their own attendance. Portal expires in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                  : 'Open the portal to allow students to mark their own attendance for 2 minutes.'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleOpenPortal}
              disabled={portalOpen}
              sx={{
                background: portalOpen ? 'rgba(255,255,255,0.2)' : '#1E3A8A',
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  background: portalOpen ? 'rgba(255,255,255,0.3)' : '#1e3a8a',
                }
              }}
            >
              {portalOpen ? 'Portal is Active' : 'Open Attendance Portal'}
            </Button>
          </Paper>
        )}

        {/* Attendance Table */}
        {students.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Students List - {students.length} Students
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 80 }}>#</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Registration No.</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Student Name</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Department</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => {
                    const statusColors = getStatusColor(attendance[student.regdNumber] || 'ABSENT');
                    return (
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
                            label={index + 1}
                            size="small"
                            sx={{
                              background: 'rgba(30, 58, 138, 0.1)',
                              color: '#1E3A8A',
                              fontWeight: 600,
                              width: 32,
                              height: 32,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" sx={{ color: '#1E3A8A' }}>
                            {student.regdNumber}
                          </Typography>
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
                          <FormControl fullWidth size="small">
                            <Select
                              value={attendance[student.regdNumber] || 'ABSENT'}
                              onChange={(e) =>
                                handleAttendanceChange(student.regdNumber, e.target.value)
                              }
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: statusColors.bg.replace('0.1', '0.3'),
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: { borderRadius: 2 },
                                },
                              }}
                            >
                              <MenuItem value="PRESENT" sx={{ color: '#10B981', fontWeight: 600 }}>
                                ✓ Present
                              </MenuItem>
                              <MenuItem value="ABSENT" sx={{ color: '#EF4444', fontWeight: 600 }}>
                                ✕ Absent
                              </MenuItem>
                              <MenuItem value="OD_INTERNAL" sx={{ color: '#F97316', fontWeight: 600 }}>
                                ⏤ OD (Internal)
                              </MenuItem>
                              <MenuItem value="OD_EXTERNAL" sx={{ color: '#8B5CF6', fontWeight: 600 }}>
                                ⏤ OD (External)
                              </MenuItem>
                              <MenuItem value="LEAVE" sx={{ color: '#3B82F6', fontWeight: 600 }}>
                                ⚐ Leave
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  const allAbsent = {};
                  students.forEach((s) => {
                    allAbsent[s.regdNumber] = 'ABSENT';
                  });
                  setAttendance(allAbsent);
                }}
                sx={{ borderRadius: 2 }}
              >
                Mark All Absent
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                startIcon={<CheckCircleIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  px: 4,
                  py: 1.5,
                }}
              >
                Submit Attendance
              </Button>
            </Box>
          </Paper>
        )}

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
    </LocalizationProvider>
  );
};

const ClassIcon = ({ sx }: { sx?: any }) => (
  <Box component="svg" sx={{ width: 20, height: 20, ...sx }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </Box>
);

export default Attendance;
