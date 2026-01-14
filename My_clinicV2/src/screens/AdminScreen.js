import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function AdminScreen() {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' ou 'users'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // État pour les suggestions d'adresse
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // État pour la modal carte
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.9716,
    longitude: -6.8498,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // État pour le nouveau médecin
  const [newDoc, setNewDoc] = useState({ 
    name: '', 
    specialty: '', 
    address: '',
    image: null 
  });
  
  // État pour la modification
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ Vérifie bien que ton adresse IP est la bonne (172.20.10.4)
  const API_BASE = "http://172.20.10.4:5000/api";

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [statsRes, docsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/stats`),
        axios.get(`${API_BASE}/doctors`),
        axios.get(`${API_BASE}/users`)
      ]);
      setStats(statsRes.data);
      setDoctors(docsRes.data);
      setFilteredDoctors(docsRes.data);
      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);
    } catch (e) {
      console.error("Erreur de chargement:", e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Choisir une photo
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setNewDoc({ ...newDoc, image: result.assets[0].uri });
    }
  };

  // ✅ Recherche en temps réel
  const handleSearch = (text) => {
    setSearch(text);
    if (activeTab === 'doctors') {
      if (text.trim() === '') {
        setFilteredDoctors(doctors);
      } else {
        const filtered = doctors.filter(doc => 
          doc.name.toLowerCase().includes(text.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredDoctors(filtered);
      }
    } else if (activeTab === 'users') {
      if (text.trim() === '') {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(user => 
          user.name.toLowerCase().includes(text.toLowerCase()) ||
          user.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
  };

  // ✅ Gérer le clic sur la carte
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  // ✅ Confirmer la localisation
  const confirmLocation = () => {
    if (selectedLocation) {
      setNewDoc({
        ...newDoc,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      });
      setShowMapModal(false);
    }
  };

  // ✅ Ajouter un médecin
  const handleAddDoctor = async () => {
    if (!newDoc.name || !newDoc.specialty) {
      Alert.alert("Erreur", "Le nom et la spécialité sont obligatoires.");
      return;
    }
    
    if (newDoc.latitude === undefined || newDoc.longitude === undefined) {
      Alert.alert("Erreur", "Veuillez sélectionner une localisation sur la carte.");
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.post(`${API_BASE}/doctors`, {
        name: newDoc.name,
        specialty: newDoc.specialty,
        address: `${newDoc.latitude}, ${newDoc.longitude}`,
        latitude: newDoc.latitude,
        longitude: newDoc.longitude,
        image: newDoc.image || "https://via.placeholder.com/150"
      });
      
      Alert.alert("Succès", "Médecin ajouté !");
      setNewDoc({ name: '', specialty: '', image: null });
      setLoading(false);
      loadData();
    } catch (e) {
      setLoading(false);
      Alert.alert("Erreur", "Impossible d'ajouter le médecin.");
    }
  };

  // ✅ Supprimer un médecin (Corrigé)
  const handleDeleteDoctor = (id, name) => {
    Alert.alert("Supprimer", `Voulez-vous vraiment retirer le Dr. ${name} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try {
          await axios.delete(`${API_BASE}/doctors/${id}`);
          setDoctors(doctors.filter(d => d.id !== id));
          setFilteredDoctors(filteredDoctors.filter(d => d.id !== id));
          Alert.alert("Succès", "Médecin supprimé");
        } catch (e) {
          Alert.alert("Erreur", "Impossible de supprimer le médecin");
        }
      }}
    ]);
  };

  // ✅ Supprimer un utilisateur
  const handleDeleteUser = (id, name) => {
    Alert.alert("Supprimer", `Voulez-vous vraiment retirer ${name} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try {
          await axios.delete(`${API_BASE}/users/${id}`);
          setUsers(users.filter(u => u.id !== id));
          setFilteredUsers(filteredUsers.filter(u => u.id !== id));
          Alert.alert("Succès", "Utilisateur supprimé");
        } catch (e) {
          Alert.alert("Erreur", "Impossible de supprimer l'utilisateur");
        }
      }}
    ]);
  };
      
  // ✅ Ouvrir la modal de modification
  const handleEditDoctor = (doctor) => {
    setEditingDoctor({
      ...doctor,
      editName: doctor.name,
      editSpecialty: doctor.specialty
    });
    setShowEditModal(true);
  };

  // ✅ Sauvegarder les modifications
  const handleSaveChanges = async () => {
    if (!editingDoctor.editName || !editingDoctor.editSpecialty) {
      Alert.alert("Erreur", "Le nom et la spécialité sont obligatoires.");
      return;
    }

    try {
      await axios.put(`${API_BASE}/doctors/${editingDoctor.id}`, {
        name: editingDoctor.editName,
        specialty: editingDoctor.editSpecialty,
        latitude: editingDoctor.latitude || 0,
        longitude: editingDoctor.longitude || 0,
        address: editingDoctor.address || "",
        image: editingDoctor.image || "https://via.placeholder.com/150"
      });
      Alert.alert("Succès", "Médecin modifié !");
      setShowEditModal(false);
      setEditingDoctor(null);
      loadData();
    } catch (e) {
      console.error("Erreur modification:", e.response ? e.response.data : e.message);
      Alert.alert("Erreur", e.response?.data?.error || "Impossible de modifier le médecin.");
    }
  };

  if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#1a73e8" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.mainTitle}>Tableau de Bord Admin</Text>

      {/* ✅ ONGLETS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
          onPress={() => { setActiveTab('doctors'); setSearch(''); }}
        >
          <Ionicons name="medkit" size={20} color={activeTab === 'doctors' ? '#1a73e8' : '#A0AEC0'} />
          <Text style={[styles.tabText, activeTab === 'doctors' && styles.activeTabText]}>Médecins</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => { setActiveTab('users'); setSearch(''); }}
        >
          <Ionicons name="people" size={20} color={activeTab === 'users' ? '#1a73e8' : '#A0AEC0'} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Patients</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ SECTION STATISTIQUES (4 CARTES) */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#1a73e8" />
          <Text style={styles.statNum}>{stats?.userCount || 0}</Text>
          <Text style={styles.statLabel}>Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="medkit" size={24} color="#34d399" />
          <Text style={styles.statNum}>{stats?.doctorCount || 0}</Text>
          <Text style={styles.statLabel}>Médecins</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#f59e0b" />
          <Text style={styles.statNum}>{stats?.appointmentCount || 0}</Text>
          <Text style={styles.statLabel}>RDV</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color="#8b5cf6" />
          <Text style={styles.statNum}>{stats?.reviewCount || 0}</Text>
          <Text style={styles.statLabel}>Avis</Text>
        </View>
      </View>

      {/* ✅ SECTION FORMULAIRE - MÉDECINS SEULEMENT */}
      {activeTab === 'doctors' && (
        <>
          <Text style={styles.sectionTitle}>Ajouter un médecin</Text>
          <View style={styles.formCard}>
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {newDoc.image ? (
              <Image source={{ uri: newDoc.image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={30} color="#A0AEC0" />
                <Text style={styles.imageText}>Ajouter photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Nom" value={newDoc.name} onChangeText={(v) => setNewDoc({...newDoc, name: v})} />
        <TextInput style={styles.input} placeholder="Spécialité" value={newDoc.specialty} onChangeText={(v) => setNewDoc({...newDoc, specialty: v})} />
        
        {/* Bouton pour ouvrir la carte */}
        <TouchableOpacity 
          style={[styles.input, { backgroundColor: '#EBF8FF', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#1a73e8' }]}
          onPress={() => setShowMapModal(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            <Ionicons name="location" size={20} color="#1a73e8" />
            <Text style={{ marginLeft: 10, color: newDoc.latitude ? '#2D3748' : '#A0AEC0' }}>
              {newDoc.latitude 
                ? `📍 ${newDoc.latitude.toFixed(4)}, ${newDoc.longitude.toFixed(4)}` 
                : 'Cliquez pour sélectionner sur la carte'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddDoctor}>
          <Text style={styles.addBtnText}>Enregistrer le médecin</Text>
        </TouchableOpacity>
          </View>
        </>
      )}

      {/* ✅ SECTION RECHERCHE ET LISTE - MÉDECINS */}
      {activeTab === 'doctors' && (
        <>
          <Text style={styles.sectionTitle}>Gérer les médecins</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#A0AEC0" />
            <TextInput style={styles.searchInput} placeholder="Rechercher..." value={search} onChangeText={handleSearch} />
          </View>

          {filteredDoctors.map((doc) => (
            <View key={doc.id} style={styles.docItem}>
              <Image source={{ uri: doc.image }} style={styles.docThumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docSpec}>{doc.specialty}</Text>
              </View>
              <TouchableOpacity style={{ marginRight: 15 }} onPress={() => handleEditDoctor(doc)}>
                <Ionicons name="pencil" size={24} color="#1a73e8" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteDoctor(doc.id, doc.name)}>
                <Ionicons name="trash-outline" size={24} color="#e53e3e" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* ✅ SECTION RECHERCHE ET LISTE - PATIENTS */}
      {activeTab === 'users' && (
        <>
          <Text style={styles.sectionTitle}>Gérer les patients</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#A0AEC0" />
            <TextInput style={styles.searchInput} placeholder="Rechercher..." value={search} onChangeText={handleSearch} />
          </View>

          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.docItem}>
              <View style={[styles.docThumb, { backgroundColor: '#EDF2F7', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={24} color="#1a73e8" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.docName}>{user.name}</Text>
                <Text style={styles.docSpec}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteUser(user.id, user.name)}>
                <Ionicons name="trash-outline" size={24} color="#e53e3e" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* MODAL MODIFICATION */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.editModalContainer}>
          <View style={styles.editModalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.editModalTitle}>Modifier le médecin</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color="#2D3748" />
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.input} 
              placeholder="Nom" 
              value={editingDoctor?.editName} 
              onChangeText={(v) => setEditingDoctor({...editingDoctor, editName: v})} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Spécialité" 
              value={editingDoctor?.editSpecialty} 
              onChangeText={(v) => setEditingDoctor({...editingDoctor, editSpecialty: v})} 
            />

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity 
                style={[styles.modalBtn, { flex: 1, marginRight: 10, backgroundColor: '#EDF2F7' }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={{ color: '#2D3748', fontWeight: 'bold', textAlign: 'center' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { flex: 1, backgroundColor: '#1a73e8' }]}
                onPress={handleSaveChanges}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CARTE */}
      <Modal visible={showMapModal} animationType="slide" transparent={false}>
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Sélectionnez une localisation</Text>
            <View style={{ width: 30 }} />
          </View>

          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChange={setMapRegion}
            onPress={handleMapPress}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation} />
            )}
          </MapView>

          <View style={styles.mapFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowMapModal(false)}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmBtn, !selectedLocation && styles.disabledBtn]} 
              onPress={confirmLocation}
              disabled={!selectedLocation}
            >
              <Text style={styles.confirmBtnText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  tabsContainer: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#1a73e8' },
  tabText: { marginLeft: 8, color: '#A0AEC0', fontWeight: '600' },
  activeTabText: { color: '#1a73e8' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginTop: 5 },
  statLabel: { color: '#718096', fontSize: 11, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A5568', marginVertical: 20 },
  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20 },
  imagePicker: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F7FAFC', borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E0', overflow: 'hidden' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageText: { fontSize: 10, color: '#A0AEC0', marginTop: 5 },
  previewImage: { width: '100%', height: '100%' },
  input: { backgroundColor: '#F7FAFC', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#EDF2F7' },
  addBtn: { backgroundColor: '#1a73e8', padding: 15, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  searchInput: { flex: 1, paddingVertical: 10, marginLeft: 10 },
  docItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 15, marginBottom: 10, alignItems: 'center', elevation: 2 },
  docThumb: { width: 45, height: 45, borderRadius: 22.5 },
  docName: { fontWeight: 'bold', color: '#2D3748' },
  docSpec: { color: '#1a73e8', fontSize: 13 },
  suggestionsBox: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 8, 
    maxHeight: 200, 
    marginTop: -5,
    marginBottom: 15
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7'
  },
  suggestionText: {
    marginLeft: 10,
    color: '#2D3748',
    fontSize: 13,
    flex: 1
  },
  mapContainer: { flex: 1, backgroundColor: '#fff' },
  mapHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1a73e8', 
    padding: 15, 
    paddingTop: 10 
  },
  mapTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  map: { flex: 1 },
  mapFooter: { 
    flexDirection: 'row', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#EDF2F7' 
  },
  cancelBtn: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#EDF2F7', 
    borderRadius: 10, 
    alignItems: 'center', 
    marginRight: 10 
  },
  cancelBtnText: { color: '#2D3748', fontWeight: 'bold' },
  confirmBtn: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#1a73e8', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#CBD5E0' },
  editModalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  editModalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, width: '100%', maxHeight: '70%' },
  editModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3748' },
  modalBtn: { padding: 15, borderRadius: 10 }
});