import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Pour rafraîchir les stats

export default function ProfileScreen({ navigation }) { // ✅ Ajout de navigation
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Rafraîchir les statistiques à chaque fois qu'on arrive sur l'écran
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://172.20.10.4:5000/api/stats/${user.id}`);
      setStats(res.data);
    } catch (e) {
      console.error("Erreur lors de la récupération des stats:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1a73e8" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header Profil */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Section Prochain RDV */}
        <Text style={styles.sectionTitle}>Votre prochain rendez-vous</Text>
        {stats?.next ? (
          <View style={styles.nextCard}>
            <View style={styles.nextInfo}>
              <Ionicons name="calendar" size={24} color="#fff" />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.nextDate}>{stats.next.date} à {stats.next.time}</Text>
                <Text style={styles.nextDoctor}>Dr. {stats.next.Doctor?.name}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.nextCard, { backgroundColor: '#EDF2F7' }]}>
            <Text style={{ color: '#718096', textAlign: 'center' }}>Aucun rendez-vous prévu</Text>
          </View>
        )}

        {/* Grille de Statistiques */}
        <Text style={styles.sectionTitle}>Statistiques de santé</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle" size={30} color="#1a73e8" />
            <Text style={styles.statNum}>{stats?.total || 0}</Text>
            <Text style={styles.statLabel}>RDV Totaux</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="heart" size={30} color="#e53e3e" />
            <Text style={styles.statNum}>{stats?.healthScore || 0}%</Text>
            <Text style={styles.statLabel}>Score Santé</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stats?.healthScore || 0}%` }]} />
            </View>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.menu}>
          {/* ✅ Ajout du onPress pour naviguer vers Settings */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#4A5568" />
            <Text style={styles.menuText}>Paramètres du compte</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { marginTop: 10 }]} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color="#e53e3e" />
            <Text style={[styles.menuText, { color: '#e53e3e' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1a73e8', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2D3748' },
  userEmail: { color: '#718096', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A5568', marginVertical: 15 },
  nextCard: { backgroundColor: '#1a73e8', padding: 20, borderRadius: 20, elevation: 5 },
  nextInfo: { flexDirection: 'row', alignItems: 'center' },
  nextDate: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  nextDoctor: { color: '#E2E8F0', fontSize: 14 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', marginVertical: 5 },
  statLabel: { color: '#718096', fontSize: 12 },
  progressBar: { width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#e53e3e', borderRadius: 3 },
  menu: { marginTop: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15 },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#4A5568' }
});