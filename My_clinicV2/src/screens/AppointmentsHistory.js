import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Ajout de l'import

export default function AppointmentsHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const API_BASE = "http://172.20.10.4:5000/api";

  // ✅ Cette fonction s'exécute à CHAQUE FOIS que l'onglet devient visible
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/appointments?userId=${user.id}`);
      const allAppointments = response.data;
      
      // Séparer les rendez-vous à venir des rendez-vous passés
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today;
      });
      
      // Afficher seulement les rendez-vous à venir
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = (id) => {
    Alert.alert("Annuler", "Voulez-vous annuler ce rendez-vous ?", [
      { text: "Non" },
      { text: "Oui", onPress: async () => {
          try {
            await axios.delete(`${API_BASE}/appointments/${id}`);
            fetchAppointments(); // Rafraîchir après suppression
          } catch (e) { Alert.alert("Erreur", "Impossible d'annuler"); }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{item.date.split('-')[2]}</Text>
        <Text style={styles.monthText}>{item.date.split('-')[1]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.docName}>Dr. {item.Doctor?.name}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
        <Text style={styles.specText}>{item.Doctor?.specialty}</Text>
      </View>
      <TouchableOpacity onPress={() => cancelAppointment(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#e53e3e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Aucun rendez-vous trouvé.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  dateBadge: { backgroundColor: '#EBF8FF', padding: 10, borderRadius: 10, alignItems: 'center', minWidth: 50 },
  dateText: { fontSize: 18, fontWeight: 'bold', color: '#1a73e8' },
  monthText: { fontSize: 12, color: '#1a73e8', textTransform: 'uppercase' },
  info: { flex: 1, marginLeft: 15 },
  docName: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  timeText: { color: '#4A5568', marginVertical: 2 },
  specText: { color: '#A0AEC0', fontSize: 12 },
  info: { flex: 1, marginLeft: 15 },
  docName: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  timeText: { color: '#4A5568', marginVertical: 2 },
  specText: { color: '#A0AEC0', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 50, color: '#A0AEC0' }
});