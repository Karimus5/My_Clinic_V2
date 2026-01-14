import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      
      if (response.data.user) {
        // Sauvegarder le token si fourni
        if (response.data.token) {
          await AsyncStorage.setItem('authToken', response.data.token);
        }
        return response.data.user;
      }
      throw new Error('Réponse serveur vide');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      if (response.data.user) {
        if (response.data.token) {
          await AsyncStorage.setItem('authToken', response.data.token);
        }
        return response.data.user;
      }
      throw new Error('Réponse serveur vide');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  // Récupérer les données de l'utilisateur
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
