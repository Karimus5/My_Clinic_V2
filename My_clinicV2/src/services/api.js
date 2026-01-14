import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://172.20.10.4:5000/api";

// Instance axios avec intercepteurs
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
