import api from './api';

export const facultyService = {
  // Get all classrooms
  getMyClasses: async () => {
    const response = await api.get('/api/faculty/my-classes');
    return response.data;
  },

  // Get students in a classroom
  getClassroomStudents: async (classroomId) => {
    const response = await api.get(`/api/faculty/classroom/${classroomId}/students`);
    return response.data;
  },

  // Get all students
  getAllStudents: async () => {
    const response = await api.get('/api/faculty/all-students');
    return response.data;
  },

  // Create custom classroom
  createCustomClass: async (classData) => {
    const response = await api.post('/api/faculty/custom-class', classData);
    return response.data;
  },

  // Mark attendance
  markAttendance: async (classId, date, attendanceMap) => {
    const response = await api.post('/api/faculty/attendance/mark', {
      classId,
      date,
      attendance: attendanceMap,
    });
    return response.data;
  },

  // Get today's attendance summary
  getTodayAttendance: async () => {
    const response = await api.get('/api/faculty/attendance/today');
    return response.data;
  },

  // Portal methods
  openPortal: async (classId) => {
    const response = await api.post(`/api/faculty/classroom/${classId}/open-portal`);
    return response.data;
  },

  getPortalStatus: async (classId) => {
    const response = await api.get(`/api/faculty/classroom/${classId}/portal-status`);
    return response.data;
  },

  // Get attendance by classroom and date
  getAttendanceByClassAndDate: async (classId, date) => {
    const response = await api.get(`/api/faculty/classroom/${classId}/attendance?date=${date}`);
    return response.data;
  },
};
