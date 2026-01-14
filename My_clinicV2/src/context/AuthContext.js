import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        // Ajout d'une sécurité : on vérifie que le JSON est valide
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        }
      }
    } catch (e) {
      console.log("Erreur lors du chargement de l'utilisateur :", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      // ✅ Sécurité critique : on ne sauvegarde que si userData n'est pas undefined
      if (userData && userData.user) {
        // Si ton backend envoie { user: { id, name, role } }
        const userToStore = userData.user;
        setUser(userToStore);
        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
      } else if (userData && userData.role) {
        // Si ton backend envoie directement les infos { id, name, role }
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.error("Format de données utilisateur invalide :", userData);
      }
    } catch (e) {
      console.log("Erreur lors de la sauvegarde du login :", e);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.log("Erreur lors de la déconnexion :", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};