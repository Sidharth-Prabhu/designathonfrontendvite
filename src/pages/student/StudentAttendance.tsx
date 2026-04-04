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
  Grid as MuiGrid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const Grid = MuiGrid as any;

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll use student ID 1
      const studentId = 1;
      
      const [attendanceData, summaryData] = await Promise.all([
        studentService.getMyAttendance(studentId),
        studentService.getAttendanceSummary(studentId),
      ]);
      
      setAttendance(attendanceData.attendance || []);
      setSummary(summaryData.summary || null);
      setError('');
    } catch (err) {
      setError('Failed to load attendance data. Make sure you have created a student profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PRESENT':
        return { 
          bg: 'rgba(16, 185, 129, 0.1)', 
          color: '#10B981',
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          label: 'Present'
        };
      case 'ABSENT':
        return { 
          bg: 'rgba(239, 68, 68, 0.1)', 
          color: '#EF4444',
          icon: <CancelIcon sx={{ fontSize: 16 }} />,
          label: 'Absent'
        };
      case 'OD_INTERNAL':
        return { 
          bg: 'rgba(249, 115, 22, 0.1)', 
          color: '#F97316',
          icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
          label: 'OD (Internal)'
        };
      case 'OD_EXTERNAL':
        return { 
          bg: 'rgba(139, 92, 246, 0.1)', 
          color: '#8B5CF6',
          icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
          label: 'OD (External)'
        };
      default:
        return { 
          bg: 'rgba(148, 163, 184, 0.1)', 
          color: '#94A3B8',
          icon: null,
          label: status
        };
    }
  };

  const calculatePercentage = () => {
    if (!summary) return 0;
    const total = (summary.present || 0) + (summary.absent || 0) + (summary.odInternal || 0) + (summary.odExternal || 0);
    if (total === 0) return 0;
    return Math.round(((summary.present || 0) * 100) / total);
  };

  if (loading) {
    return (
      <Layout title="My Attendance">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: '#1E3A8A' }} />
        </Box>
      </Layout>
    );
  }

  const percentage = calculatePercentage();

  return (
    <Layout title="My Attendance">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssignmentIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="700">
              My Attendance Record
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Track your presence and academic progress
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Attendance Percentage */}
          <Grid xs={12} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: `linear-gradient(135deg, ${percentage >= 75 ? '#10B981' : percentage >= 50 ? '#F97316' : '#EF4444'} 0%, ${percentage >= 75 ? '#34D399' : percentage >= 50 ? '#FB923C' : '#F87171'} 100%)`,
                color: 'white',
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h2" fontWeight="700">
                  {percentage}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Attendance Rate
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 1 }}>
                  {percentage >= 75 ? '✓ Good standing' : percentage >= 50 ? '⚠ Needs improvement' : '✗ Critical'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Present Days */}
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CheckCircleIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: '#10B981', mb: 1 }}>
                  {summary.present || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  Days Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Absent Days */}
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CancelIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: '#EF4444', mb: 1 }}>
                  {summary.absent || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  Days Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* OD Days */}
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    background: 'rgba(249, 115, 22, 0.1)',
                    color: '#F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <AccessTimeIcon fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: '#F97316', mb: 1 }}>
                  {(summary.odInternal || 0) + (summary.odExternal || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  On Duty Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Attendance Table */}
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
            Attendance History - {attendance.length} Records
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 80 }}>#</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Date</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Classroom</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((record, index) => {
                  const statusConfig = getStatusConfig(record.status);
                  return (
                    <TableRow
                      key={record.id}
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
                        <Typography variant="body2" fontWeight="500">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500" sx={{ color: '#1E3A8A' }}>
                          {record.classroom?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          sx={{
                            background: statusConfig.bg,
                            color: statusConfig.color,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: 'inherit',
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Box sx={{ py: 6 }}>
                      <AssignmentIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No attendance records found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your attendance will appear here once marked by faculty
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
};

export default StudentAttendance;
