import apiClient from './api';

export const appointmentService = {
  // Récupérer tous les rendez-vous
  getAllAppointments: async () => {
    try {
      const response = await apiClient.get('/appointments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les rendez-vous d'un patient
  getPatientAppointments: async (patientId) => {
    try {
      const response = await apiClient.get(`/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les rendez-vous d'un médecin
  getDoctorAppointments: async (doctorId) => {
    try {
      const response = await apiClient.get(`/appointments/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un rendez-vous
  createAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un rendez-vous
  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      const response = await apiClient.put(`/appointments/${appointmentId}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Annuler un rendez-vous
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await apiClient.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un rendez-vous
  deleteAppointment: async (appointmentId) => {
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
