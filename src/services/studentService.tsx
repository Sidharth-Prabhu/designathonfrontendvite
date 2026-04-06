import api from './api';

export const studentService = {
  // Get my attendance
  getMyAttendance: async (studentId) => {
    const response = await api.get('/api/student/my-attendance', {
      params: { studentId },
    });
    return response.data;
  },

  // Get attendance summary
  getAttendanceSummary: async (studentId) => {
    const response = await api.get('/api/student/attendance-summary', {
      params: { studentId },
    });
    return response.data;
  },

  getProfile: async (username) => {
    const response = await api.get(`/api/student/profile?username=${username}`);
    return response.data;
  },

  // Portal methods
  getPortalStatus: async (classId) => {
    const response = await api.get(`/api/student/classroom/${classId}/portal-status`);
    return response.data;
  },


  markMyAttendance: async (classId, username, latitude, longitude) => {
    const response = await api.post('/api/student/mark-my-attendance', { classId, username, latitude, longitude });
    return response.data;
  },
};
