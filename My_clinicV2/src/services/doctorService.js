import apiClient from './api';

export const doctorService = {
  // Récupérer tous les médecins
  getAllDoctors: async () => {
    try {
      const response = await apiClient.get('/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer un médecin par ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await apiClient.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les médecins par spécialité
  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await apiClient.get('/doctors', {
        params: { specialty }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un médecin (admin)
  createDoctor: async (doctorData) => {
    try {
      const response = await apiClient.post('/doctors', doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un médecin
  updateDoctor: async (doctorId, doctorData) => {
    try {
      const response = await apiClient.put(`/doctors/${doctorId}`, doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un médecin
  deleteDoctor: async (doctorId) => {
    try {
      await apiClient.delete(`/doctors/${doctorId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
