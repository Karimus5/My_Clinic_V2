import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AppointmentsHistory from '../screens/AppointmentsHistory';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import MapScreen from '../screens/MapScreen';
import HistoryDetailScreen from '../screens/HistoryDetailScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator 
      screenOptions={{ 
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: 'gray',
        headerShown: true
      }}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          title: "Médecins"
        }} 
      />
      <Tab.Screen 
        name="Carte" 
        component={MapScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
          title: "À proximité"
        }} 
      />
      <Tab.Screen 
        name="Mes RDV" 
        component={AppointmentsHistory} 
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          title: "Mes Rendez-vous"
        }} 
      />
      <Tab.Screen 
        name="Historique" 
        component={HistoryDetailScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
          title: "Historique"
        }} 
      />
      <Tab.Screen 
        name="Compte" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          title: "Mon Profil"
        }} 
      />
      {user && user.role === "admin" && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
            title: "Gestion"
          }} 
        />
      )}
    </Tab.Navigator>
  );
}