import api from './api';

export const adminService = {
  // Students
  getStudents: async () => {
    const response = await api.get('/api/admin/students');
    return response.data;
  },

  addStudent: async (studentData) => {
    const response = await api.post('/api/admin/students', studentData);
    return response.data;
  },

  getStudent: async (id) => {
    const response = await api.get(`/api/admin/students/${id}`);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await api.put(`/api/admin/students/${id}`, studentData);
    return response.data;
  },

  // Faculties
  getFaculties: async () => {
    const response = await api.get('/api/admin/faculties');
    return response.data;
  },

  addFaculty: async (facultyData) => {
    const response = await api.post('/api/admin/faculties', facultyData);
    return response.data;
  },

  getFaculty: async (id) => {
    const response = await api.get(`/api/admin/faculties/${id}`);
    return response.data;
  },

  updateFaculty: async (id, facultyData) => {
    const response = await api.put(`/api/admin/faculties/${id}`, facultyData);
    return response.data;
  },

  // Classrooms
  getClassrooms: async () => {
    const response = await api.get('/api/admin/classrooms');
    return response.data;
  },

  createClassroom: async (classroomData) => {
    const response = await api.post('/api/admin/classrooms', classroomData);
    return response.data;
  },

  getClassroom: async (id) => {
    const response = await api.get(`/api/admin/classrooms/${id}`);
    return response.data;
  },

  updateClassroom: async (id, classroomData) => {
    const response = await api.put(`/api/admin/classrooms/${id}`, classroomData);
    return response.data;
  },

  addStudentsToClassroom: async (classroomId, studentIds) => {
    const response = await api.post(`/api/admin/classrooms/${classroomId}/students`, studentIds);
    return response.data;
  },
};
