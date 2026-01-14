import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { DoctorCard, LoadingSpinner, EmptyState } from '../components';
import { doctorService } from '../services';

export default function HomeScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, [])
  );

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des docteurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doc => 
        doc.name.toLowerCase().includes(text.toLowerCase()) || 
        doc.specialty.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <DoctorCard
      doctor={item}
      onPress={() => navigation.navigate('AppointmentForm', { doctor: item })}
      actionButton={{
        title: 'Prendre RDV',
        onPress: () => navigation.navigate('AppointmentForm', { doctor: item })
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bonjour, {user?.name} 👋</Text>
        <Text style={styles.subtitle}>Trouvez votre spécialiste</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#A0AEC0" />
        <TextInput
          style={styles.input}
          placeholder="Rechercher un médecin..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <LoadingSpinner message="Chargement des médecins..." />
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          title="Aucun médecin"
          message="Aucun médecin ne correspond à votre recherche"
        />
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 20 },
  welcome: { fontSize: 18, color: '#718096' },
  subtitle: { fontSize: 24, fontWeight: 'bold', color: '#2D3748' },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 15, 
    borderRadius: 15, 
    marginBottom: 20,
    elevation: 2
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10 }
});