import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'; // Suppression de PROVIDER_GOOGLE pour test
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState(['Tous']);

  // Position centrée sur Casablanca (zoom sur la ville)
  const initialRegion = {
    latitude: 33.5731,
    longitude: -7.5898,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Remplace bien par ton IP actuelle si elle a changé
      const response = await axios.get("http://172.20.10.4:5000/api/doctors");
      console.log("Docteurs reçus pour la carte :", response.data.length);
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      
      // Extraire toutes les spécialités uniques
      const uniqueSpecialties = ['Tous', ...new Set(response.data.map(d => d.specialty))];
      setSpecialties(uniqueSpecialties);
    } catch (error) {
      console.error("Erreur MapScreen:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSpecialty === 'Tous') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.specialty === selectedSpecialty));
    }
  }, [selectedSpecialty, doctors]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtres horizontaux */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {specialties.map(spec => (
            <TouchableOpacity 
              key={spec} 
              style={[styles.chip, selectedSpecialty === spec && styles.activeChip]}
              onPress={() => setSelectedSpecialty(spec)}
            >
              <Text style={[styles.chipText, selectedSpecialty === spec && styles.activeChipText]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        // Retrait temporaire de provider={PROVIDER_GOOGLE} pour utiliser les cartes de base si Google Play Services manque
      >
        {filteredDoctors.map(doctor => (
          // Vérification que les coordonnées existent et sont valides
          (doctor.latitude !== null && doctor.latitude !== undefined && doctor.longitude !== null && doctor.longitude !== undefined) ? (
            <Marker
              key={doctor.id}
              coordinate={{ 
                latitude: parseFloat(doctor.latitude), 
                longitude: parseFloat(doctor.longitude) 
              }}
              title={doctor.name}
              description={doctor.specialty}
            >
              <Callout onPress={() => navigation.navigate('AppointmentForm', { doctor })}>
                <View style={styles.callout}>
                  <Text style={styles.calloutName}>{doctor.name}</Text>
                  <Text style={styles.calloutSpec}>{doctor.specialty}</Text>
                  <View style={styles.calloutBtn}>
                    <Text style={styles.calloutBtnText}>Prendre RDV</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ) : null
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterContainer: {
    position: 'absolute', top: 10, left: 0, right: 0, zIndex: 10,
    paddingVertical: 10, paddingHorizontal: 10
  },
  chip: {
    backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8,
    borderRadius: 20, marginRight: 10, elevation: 4, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 5
  },
  activeChip: { backgroundColor: '#1a73e8' },
  chipText: { color: '#4A5568', fontWeight: 'bold', fontSize: 13 },
  activeChipText: { color: '#fff' },
  callout: { width: 140, padding: 5, alignItems: 'center' },
  calloutName: { fontWeight: 'bold', fontSize: 13 },
  calloutSpec: { color: '#718096', fontSize: 11, marginBottom: 5 },
  calloutBtn: { backgroundColor: '#1a73e8', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5 },
  calloutBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});