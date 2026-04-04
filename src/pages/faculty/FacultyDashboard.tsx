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
} from '@mui/material';
import {
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { facultyService } from '../../services/facultyService';

const Grid = MuiGrid as any;

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    classes: 0,
    toMark: 0,
    students: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [classes, todayAttendance] = await Promise.all([
        facultyService.getMyClasses(),
        facultyService.getTodayAttendance(),
      ]);

      // Calculate total students across all classes
      const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);

      setStats({
        classes: classes.length || 0,
        toMark: todayAttendance.totalRecords || 0,
        students: totalStudents,
        pending: 0, // Will be calculated based on unmarked attendance
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      title: 'My Classes',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.classes,
      description: 'Total Classes',
      icon: <ClassIcon />,
      path: '/faculty/classes',
      color: 'stat-green',
    },
    {
      title: 'To Mark Today',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.toMark,
      description: 'Attendance Pending',
      icon: <AssignmentIcon />,
      path: '/faculty/attendance',
      color: 'stat-yellow',
    },
    {
      title: 'Students',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.students,
      description: 'Total Students',
      icon: <ClassIcon />,
      path: '/faculty/classes',
      color: 'stat-cyan',
    },
    {
      title: 'Pending Tasks',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.pending,
      description: 'Pending Tasks',
      icon: <AssignmentIcon />,
      path: '/faculty/attendance',
      color: 'stat-red',
    },
  ];

  return (
    <Layout title="Dashboard">
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
                startIcon={<ClassIcon />}
                onClick={() => navigate('/faculty/classes')}
                sx={{
                  py: 1.5,
                  bgcolor: '#28A745',
                  '&:hover': { bgcolor: '#218838' },
                }}
              >
                My Classes
              </Button>
            </Grid>
            <Grid xs={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/faculty/attendance')}
                sx={{
                  py: 1.5,
                  bgcolor: '#17A2B8',
                  '&:hover': { bgcolor: '#138496' },
                }}
              >
                Mark Attendance
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Layout>
  );
};

export default FacultyDashboard;
