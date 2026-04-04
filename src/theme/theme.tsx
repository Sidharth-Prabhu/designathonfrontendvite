import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC', // RIT Blue
      light: '#3399FF',
      dark: '#004C99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6600', // RIT Orange
      light: '#FF8533',
      dark: '#CC5200',
      contrastText: '#FFFFFF',
    },
    // RIT Portal Style Stat Colors
    stat: {
      green: '#28A745',    // CGPA
      yellow: '#FFC107',   // Arrears
      cyan: '#17A2B8',     // Attendance
      red: '#DC3545',      // Leave
    },
    background: {
      default: '#F4F6F9', // Light gray background
      paper: '#FFFFFF',
      sidebar: '#2C3E50', // Dark sidebar
    },
    success: {
      main: '#28A745',
      light: '#34D058',
      dark: '#22863A',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
    },
    error: {
      main: '#DC3545',
      light: '#EF5350',
      dark: '#C62828',
    },
    info: {
      main: '#17A2B8',
      light: '#4DD0E1',
      dark: '#00838F',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      sidebar: '#ECF0F1',
      sidebarSecondary: '#95A5A6',
    },
  } as any,
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
    '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderBottom: '1px solid #E0E0E0',
        },
        head: {
          backgroundColor: '#F5F5F5',
          color: '#333333',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            fontSize: '0.9rem',
            '&:hover fieldset': {
              borderColor: '#0066CC',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0066CC',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          fontSize: '0.8rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#333333',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2C3E50',
          color: '#ECF0F1',
          borderRight: 'none',
          width: 260,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 8px',
          padding: '12px 16px',
          color: '#ECF0F1',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: '#0066CC',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#0052A3',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#ECF0F1',
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: '0.9rem',
          color: '#ECF0F1',
        },
        secondary: {
          color: '#95A5A6',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: '#95A5A6',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          backgroundColor: '#2C3E50',
        },
      },
    },
  },
});

export default theme;
