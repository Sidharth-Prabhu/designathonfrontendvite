import api from './api';

export const busService = {
  // Driver: Profile
  getDriverProfile: async (username) => {
    const response = await api.get(`/api/bus/driver/profile?username=${username}`);
    return response.data;
  },

  // Driver: Update location
  updateLocation: async (driverId, latitude, longitude) => {
    const response = await api.post('/api/bus/driver/update-location', { driverId, latitude, longitude });
    return response.data;
  },

  // Driver: Toggle attendance
  toggleAttendance: async (driverId, active) => {
    const response = await api.post('/api/bus/driver/toggle-attendance', { driverId, active });
    return response.data;
  },

  // Student: Check proximity
  checkProximity: async (username, latitude, longitude) => {
    const response = await api.post('/api/bus/student/check-proximity', { username, latitude, longitude });
    return response.data;
  },

  // Admin: Get all drivers
  getAllDrivers: async () => {
    const response = await api.get('/api/bus/admin/all-drivers');
    return response.data;
  },

  // Admin: Add driver
  addDriver: async (driverData) => {
    const response = await api.post('/api/bus/admin/add-driver', driverData);
    return response.data;
  },

  // Admin: Update driver
  updateDriver: async (id, driverData) => {
    const response = await api.put(`/api/bus/admin/update-driver/${id}`, driverData);
    return response.data;
  }
};
