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

const Grid = MuiGrid as any;
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Class as ClassIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Layout from '../Layout';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    faculties: 0,
    classrooms: 0,
    attendance: '0%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [students, faculties, classrooms] = await Promise.all([
        adminService.getStudents(),
        adminService.getFaculties(),
        adminService.getClassrooms(),
      ]);

      setStats({
        students: students.length || 0,
        faculties: faculties.length || 0,
        classrooms: classrooms.length || 0,
        attendance: '0%', // Will be calculated when attendance is marked
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      title: 'Students',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.students,
      description: 'Total Students',
      icon: <SchoolIcon />,
      path: '/admin/students',
      color: 'stat-green',
    },
    {
      title: 'Faculties',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.faculties,
      description: 'Total Faculty Members',
      icon: <PeopleIcon />,
      path: '/admin/faculties',
      color: 'stat-yellow',
    },
    {
      title: 'Attendance',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.attendance,
      description: 'Average Attendance',
      icon: <AssignmentIcon />,
      path: '/admin/classrooms',
      color: 'stat-cyan',
    },
    {
      title: 'Classrooms',
      value: loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : stats.classrooms,
      description: 'Total Classrooms',
      icon: <ClassIcon />,
      path: '/admin/classrooms',
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
      <Paper className="info-card" sx={{ mb: 3 }}>
        <Box className="info-card-header">
          <Typography variant="h6" fontWeight="600">
            Quick Actions
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SchoolIcon />}
                onClick={() => navigate('/admin/students')}
                sx={{
                  py: 1.5,
                  bgcolor: '#28A745',
                  '&:hover': { bgcolor: '#218838' },
                }}
              >
                Add Student
              </Button>
            </Grid>
            <Grid xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/admin/faculties')}
                sx={{
                  py: 1.5,
                  bgcolor: '#0066CC',
                  '&:hover': { bgcolor: '#0052A3' },
                }}
              >
                Add Faculty
              </Button>
            </Grid>
            <Grid xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ClassIcon />}
                onClick={() => navigate('/admin/classrooms')}
                sx={{
                  py: 1.5,
                  bgcolor: '#17A2B8',
                  '&:hover': { bgcolor: '#138496' },
                }}
              >
                Create Class
              </Button>
            </Grid>
            <Grid xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/admin/reports')}
                sx={{
                  py: 1.5,
                  bgcolor: '#DC3545',
                  '&:hover': { bgcolor: '#C82333' },
                }}
              >
                View Reports
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Layout>
  );
};

export default AdminDashboard;
