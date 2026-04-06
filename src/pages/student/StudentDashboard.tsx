import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid as MuiGrid,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import dayjs from 'dayjs';

const Grid = MuiGrid as any;


const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendanceRate: '0%',
    percentage: 0,
    present: 0,
    absent: 0,
    onDuty: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Portal State
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalExpiry, setPortalExpiry] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState({ text: '', type: 'info' });

  useEffect(() => {
    loadStats();
    loadProfileAndCheckPortal();
  }, []);

  // Portal Timer logic
  useEffect(() => {
    let timer: any = null;
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

  // Polling for portal (every 30 seconds if not open)
  useEffect(() => {
    let poll: any = null;
    if (!portalOpen && studentProfile?.classId) {
      poll = setInterval(() => {
        checkPortal(studentProfile.classId);
      }, 30000);
    }
    return () => {
      if (poll) clearInterval(poll);
    };
  }, [portalOpen, studentProfile]);

  const loadProfileAndCheckPortal = async () => {
    try {
      if (!user?.username) return;
      const profile = await studentService.getProfile(user.username);
      setStudentProfile(profile);
      if (profile.classId) {
        checkPortal(profile.classId);
      }
    } catch (err) {
      console.error('Failed to load student profile');
    }
  };

  const checkPortal = async (classId: number) => {
    try {
      const status = await studentService.getPortalStatus(classId);
      if (status.isOpen) {
        setPortalOpen(true);
        setPortalExpiry(status.expiry);
        const now = dayjs();
        const expiry = dayjs(status.expiry);
        setTimeLeft(expiry.diff(now, 'second'));
      }
    } catch (err) {
      console.error('Portal check failed');
    }
  };

  const handleMarkAttendance = async () => {
    if (!studentProfile?.classId) return;
    try {
      setLoading(true);
      await studentService.markMyAttendance(studentProfile.classId, user.username);
      setMessage({ text: 'Attendance marked successfully!', type: 'success' });
      setPortalOpen(false); 
      loadStats(); 
    } catch (err: any) {
      setMessage({ text: err.response?.data?.error || 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const loadStats = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem('username');
      if (!username) return;

      const profile = await studentService.getProfile(username);
      if (!profile) return;
      
      const studentId = profile.id;
      
      const [attendanceData, summaryData] = await Promise.all([
        studentService.getMyAttendance(studentId),
        studentService.getAttendanceSummary(studentId),
      ]);

      const totalDays = summaryData.totalDays || 0;
      const presentDays = summaryData.summary?.present || 0;
      
      const percentage = totalDays > 0 
        ? Math.round((presentDays / totalDays) * 100) 
        : 0;

      setStats({
        attendanceRate: `${percentage}%`,
        percentage: percentage,
        present: presentDays,
        absent: summaryData.summary?.absent || 0,
        onDuty: (summaryData.summary?.odInternal || 0) + (summaryData.summary?.odExternal || 0),
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      title: 'Attendance Rate',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : `${stats.percentage}%`,
      description: 'Overall Presence',
      icon: <AssignmentIcon />,
      path: '/student/attendance',
      color: 'stat-cyan',
    },
    {
      title: 'Present',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.present,
      description: 'Days Present',
      icon: <CheckCircleIcon />,
      path: '/student/attendance',
      color: 'stat-green',
    },
    {
      title: 'Absent',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.absent,
      description: 'Days Absent',
      icon: <AssignmentIcon />,
      path: '/student/attendance',
      color: 'stat-red',
    },
    {
      title: 'On Duty',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.onDuty,
      description: 'OD Days',
      icon: <AssignmentIcon />,
      path: '/student/attendance',
      color: 'stat-yellow',
    },
  ];

  return (
    <Layout title="Dashboard">

      {/* Portal Active Alert */}
      {portalOpen && studentProfile && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            borderRadius: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.01)' },
              '100%': { transform: 'scale(1)' },
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: 2, display: 'flex' }}>
              <TimerIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700">
                Attendance Portal is OPEN!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Mark your attendance for <b>{studentProfile?.className}</b>. 
                Expires in: <b>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</b>
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleMarkAttendance}
            disabled={loading}
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: 'white',
              color: '#059669',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Mark Me Present
          </Button>
        </Paper>
      )}

      {/* Student Info Card */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: '#0066CC',
            fontSize: '1.5rem',
            fontWeight: 700
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="700" color="#1E293B">
            {user?.username}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Reg No: <b>{studentProfile?.regdNumber || '...'}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Class: <b>{studentProfile?.className || '...'}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dept: <b>{studentProfile?.dept || '...'}</b>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statItems.map((item, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card
              className={`stat-card ${item.color}`}
              onClick={() => navigate(item.path)}
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
                background: item.color === 'stat-green' ? 'linear-gradient(135deg, #28A745 0%, #20C997 100%)'
                  : item.color === 'stat-yellow' ? 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)'
                  : item.color === 'stat-cyan' ? 'linear-gradient(135deg, #17A2B8 0%, #4DD0E1 100%)'
                  : 'linear-gradient(135deg, #DC3545 0%, #EF5350 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    className="stat-card-value"
                    sx={{ color: '#FFFFFF', mb: 1, fontSize: '2.5rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    className="stat-card-label"
                    sx={{ color: '#FFFFFF' }}
                  >
                    {item.description}
                  </Typography>
                  <Box
                    className="stat-card-more"
                    sx={{
                      color: '#FFFFFF',
                      mt: 2,
                      pt: 1.5,
                      borderTop: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    More info <ChevronRightIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0.3,
                    color: '#FFFFFF',
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 80 } })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper className="info-card">
        <Box className="info-card-header">
          <Typography variant="h6" fontWeight="600">
            Quick Actions
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/student/attendance')}
                sx={{
                  py: 1.5,
                  bgcolor: '#0066CC',
                  '&:hover': { bgcolor: '#0052A3' },
                }}
              >
                View Attendance
              </Button>
            </Grid>
            <Grid xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TrendingUpIcon />}
                sx={{
                  py: 1.5,
                  bgcolor: '#28A745',
                  '&:hover': { bgcolor: '#218838' },
                }}
              >
                Download Report
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={() => setMessage({ ...message, text: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={message.type as any} variant="filled" sx={{ borderRadius: 2 }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default StudentDashboard;
