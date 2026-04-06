import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Badge,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Divider,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  LocationOff as LocationOffIcon,
  GpsFixed as GpsFixedIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [locationError, setLocationError] = useState(null);

  React.useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    // Check if origin is secure
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    
    if (!isSecure && window.location.hostname !== 'localhost') {
      setLocationError('INSECURE_ORIGIN');
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationError(null),
      (err) => {
        if (err.code === 1) setLocationError('PERMISSION_DENIED');
        else setLocationError('POSITION_ERROR');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getMenuItems = () => {
    const role = user?.role?.toUpperCase();
    
    if (role === 'ADMIN') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Students', icon: <SchoolIcon />, path: '/admin/students' },
        { text: 'Faculties', icon: <PeopleIcon />, path: '/admin/faculties' },
        { text: 'Classrooms', icon: <ClassIcon />, path: '/admin/classrooms' },
      ];
    }
    if (role === 'FACULTY') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/faculty/dashboard' },
        { text: 'My Classes', icon: <ClassIcon />, path: '/faculty/classes' },
        { text: 'Mark Attendance', icon: <AssignmentIcon />, path: '/faculty/attendance' },
      ];
    }
    if (role === 'STUDENT') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
        { text: 'My Attendance', icon: <AssignmentIcon />, path: '/student/attendance' },
      ];
    }
    return [];
  };

  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  const drawer = (
    <Box sx={{ bgcolor: '#2C3E50', minHeight: '100%' }}>
      {/* Logo Section */}
      <Box sx={{ p: 2, bgcolor: '#FFFFFF', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="700" color="#0066CC">
          ATTENDANCE
        </Typography>
        <Typography variant="caption" color="#666666" display="block">
          Management System
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{
          mx: 1.5,
          mt: 2,
          mb: 1,
          bgcolor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <SearchIcon sx={{ ml: 1.5, color: '#95A5A6', fontSize: 20 }} />
        <InputBase
          placeholder="Search..."
          sx={{
            ml: 1,
            flex: 1,
            color: '#FFFFFF',
            fontSize: '0.9rem',
            py: 1,
            '& input::placeholder': {
              color: '#95A5A6',
              opacity: 1,
            },
          }}
        />
      </Paper>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1.5 }} />

      {/* Menu Items */}
      <List sx={{ px: 1, py: 2 }}>
        {getMenuItems().map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  py: 1.5,
                  px: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: '#0066CC',
                    '&:hover': {
                      bgcolor: '#0052A3',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#FFFFFF' : '#ECF0F1',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : '#ECF0F1',
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F9' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: '#2C3E50',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: '#2C3E50',
                borderRight: 'none',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <Toolbar
          className="top-header"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, color: '#333' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="#333" fontWeight="600">
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <Badge badgeContent={0} color="error" sx={{ cursor: 'pointer' }}>
              <NotificationsIcon sx={{ color: '#666' }} />
            </Badge>

            {/* User Profile */}
            <Box
              onClick={handleProfileMenuOpen}
              className="user-profile-btn"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.9rem', bgcolor: '#004C99' }}>
                {getUserInitials()}
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.username}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, mt: 1, minWidth: 180 },
              }}
            >
              <Box sx={{ px: 2, py: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="600">
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Breadcrumb */}
        <Box className="breadcrumb">
          <Typography variant="body2" className="breadcrumb-item">
            Home
          </Typography>
          <span className="breadcrumb-separator">/</span>
          <Typography variant="body2" className="breadcrumb-item active">
            {title}
          </Typography>
        </Box>

        {/* Welcome Section */}
        <Box className="welcome-section">
          <Typography variant="h5" color="#333" fontWeight="600">
            Hi, welcome back!
          </Typography>
        </Box>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            maxWidth: 1400,
            margin: '0 auto',
            width: '100%',
          }}
        >
          {locationError === 'INSECURE_ORIGIN' && (
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<LocationOffIcon />}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Location Blocked (Insecure Connection)</AlertTitle>
              Chrome blocks location requests on non-HTTPS sites. To test on mobile, use 
              <strong> localhost</strong> or 
              <strong> HTTPS</strong>. 
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.9 }}>
                  Tip: Enable <strong>chrome://flags/#unsafely-treat-insecure-origin-as-secure</strong> in your Android Chrome and add your IP:Port to the list.
                </Typography>
              </Box>
            </Alert>
          )}

          {locationError === 'PERMISSION_DENIED' && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(249, 115, 22, 0.1)', color: '#C2410C', border: '1px solid #F97316' }}
              icon={<LocationOffIcon sx={{ color: '#F97316' }} />}
              action={
                <Button color="inherit" size="small" onClick={requestLocation} sx={{ fontWeight: 700 }}>
                  Try Again
                </Button>
              }
            >
              <AlertTitle sx={{ fontWeight: 700 }}>Location Permission Required</AlertTitle>
              Please enable location access in your browser settings to mark attendance correctly.
            </Alert>
          )}

          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
