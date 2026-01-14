import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView, TextInput, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentForm({ route, navigation }) {
  const { doctor } = route.params;
  const { user } = useContext(AuthContext);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  
  // États pour les avis
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const API_BASE = "http://172.20.10.4:5000/api";
  const MOROCCO_TIMEZONE_OFFSET = 1; // GMT+1
  
  // Obtenir l'heure actuelle en fuseau horaire marocain
  const getNowMorocco = () => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcTime + MOROCCO_TIMEZONE_OFFSET * 3600000);
  };
  
  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const getTodayDate = () => {
    const today = getNowMorocco();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reviews/${doctor.id}`);
      setReviews(res.data);
    } catch (e) { console.error(e); }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erreur", "Sélectionnez une date et une heure.");
      return;
    }
    
    const nowMorocco = getNowMorocco();
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    
    // Créer une date/heure en fuseau horaire marocain
    const appointmentTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    if (appointmentTime < nowMorocco) {
      Alert.alert("Erreur", "Vous ne pouvez pas réserver une heure qui est déjà passée.");
      return;
    }
    
    try {
      await axios.post(`${API_BASE}/appointments`, {
        date: selectedDate, time: selectedTime, doctorId: doctor.id, patientName: user.name, userId: user.id
      });
      Alert.alert("Succès", "Rendez-vous réservé !");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Indisponible", error.response?.data?.error || "Erreur serveur");
    }
  };

  const submitReview = async () => {
    if (userRating === 0) {
      Alert.alert("Note requise", "Veuillez choisir un nombre d'étoiles.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/reviews`, {
        rating: userRating, comment: userComment, userName: user.name, doctorId: doctor.id
      });
      setUserRating(0);
      setUserComment('');
      fetchReviews();
      Alert.alert("Merci", "Votre avis a été publié.");
    } catch (e) { Alert.alert("Erreur", "Impossible de publier l'avis."); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.docHeader}>
          <Ionicons name="person-circle" size={60} color="#1a73e8" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={styles.docSpec}>{doctor.specialty}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Réserver un créneau</Text>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: '#1a73e8' } }}
          theme={{ todayTextColor: '#1a73e8', selectedDayBackgroundColor: '#1a73e8' }}
          minDate={getTodayDate()}
        />

        <View style={styles.timeGrid}>
          {timeSlots.map(t => {
            let isDisabled = false;
            // Désactiver les heures passées si c'est aujourd'hui
            if (selectedDate) {
              const nowMorocco = getNowMorocco();
              const [year, month, day] = selectedDate.split('-').map(Number);
              const [hours, minutes] = t.split(':').map(Number);
              const slotTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
              
              isDisabled = slotTime < nowMorocco;
            }
            
            return (
              <TouchableOpacity 
                key={t} 
                style={[
                  styles.timeSlot, 
                  selectedTime === t && styles.activeTime,
                  isDisabled && { opacity: 0.4 }
                ]}
                onPress={() => !isDisabled && setSelectedTime(t)}
                disabled={isDisabled}
              >
                <Text style={{ color: selectedTime === t ? '#fff' : isDisabled ? '#999' : '#333' }}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
          <Text style={styles.bookBtnText}>Confirmer le RDV</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* SECTION AVIS */}
        <Text style={styles.sectionTitle}>Laisser un avis</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <TouchableOpacity key={s} onPress={() => setUserRating(s)}>
              <Ionicons name={s <= userRating ? "star" : "star-outline"} size={30} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Votre commentaire..."
          value={userComment}
          onChangeText={setUserComment}
          multiline
        />
        <TouchableOpacity style={styles.reviewBtn} onPress={submitReview}>
          <Text style={styles.reviewBtnText}>Publier mon avis</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Avis des patients ({reviews.length})</Text>
        {reviews.map((r, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewUser}>{r.userName}</Text>
            <View style={{ flexDirection: 'row' }}>
              {[...Array(r.rating)].map((_, i) => <Ionicons key={i} name="star" size={14} color="#FFD700" />)}
            </View>
            <Text style={styles.reviewComment}>{r.comment}</Text>
          </View>
        ))}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  docHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  docName: { fontSize: 22, fontWeight: 'bold' },
  docSpec: { color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15 },
  timeSlot: { width: '30%', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  activeTime: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  bookBtn: { backgroundColor: '#1a73e8', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 30 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, height: 80, textAlignVertical: 'top' },
  reviewBtn: { backgroundColor: '#34d399', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  reviewBtnText: { color: '#fff', fontWeight: 'bold' },
  reviewCard: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 10 },
  reviewUser: { fontWeight: 'bold', marginBottom: 2 },
  reviewComment: { color: '#444', marginTop: 5 }
});