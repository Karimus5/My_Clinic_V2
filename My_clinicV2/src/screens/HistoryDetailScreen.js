import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const HistoryDetailScreen = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!user?.id) {
        console.log('Pas d\'ID utilisateur:', user);
        Alert.alert('Erreur', 'Utilisateur non connecté');
        setLoading(false);
        return;
      }
      console.log('Fetch history pour:', user.id);
      const response = await axios.get(`${API_URL}/history/${user.id}`);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error.message, error.response?.data);
      Alert.alert('Erreur', 'Impossible de charger l\'historique: ' + (error.response?.data?.details || error.message));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  const renderConsultationDetail = (appointment) => {
    const consultation = appointment.ConsultationNote;
    
    return (
      <View style={styles.consultationCard}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedConsultation(null)}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.doctorName}>Dr. {appointment.Doctor?.name}</Text>
          <Text style={styles.specialty}>{appointment.Doctor?.specialty}</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.label}>Date de visite:</Text>
          <Text style={styles.value}>{new Date(appointment.date).toLocaleDateString('fr-FR')}</Text>
        </View>

        {consultation ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symptômes</Text>
              <Text style={styles.sectionContent}>
                {consultation.symptoms || 'Non enregistrés'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnostic</Text>
              <Text style={styles.sectionContent}>
                {consultation.diagnosis || 'Non disponible'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traitement</Text>
              <Text style={styles.sectionContent}>
                {consultation.treatment || 'Non disponible'}
              </Text>
            </View>

            {consultation.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes du docteur</Text>
                <Text style={styles.sectionContent}>{consultation.notes}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noConsultation}>
            <Text style={styles.noConsultationText}>Aucune note de consultation disponible</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setSelectedConsultation(null)}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (selectedConsultation) {
    return (
      <ScrollView style={styles.container}>
        {renderConsultationDetail(selectedConsultation)}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Historique Médical</Text>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun historique médical</Text>
        </View>
      ) : (
        history.map((appointment) => (
          <TouchableOpacity
            key={appointment.id}
            style={styles.historyItem}
            onPress={() => setSelectedConsultation(appointment)}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Dr. {appointment.Doctor?.name}</Text>
              <Text style={styles.itemDate}>
                {new Date(appointment.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <Text style={styles.itemSpecialty}>{appointment.Doctor?.specialty}</Text>
            
            {appointment.ConsultationNote && (
              <Text style={styles.itemPreview}>
                {appointment.ConsultationNote.diagnosis?.substring(0, 60)}...
              </Text>
            )}

            <Text style={styles.viewLink}>Voir détails →</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    flex: 1,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
  itemSpecialty: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  itemPreview: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  viewLink: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 12,
  },
  consultationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 5,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 0.6,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  noConsultation: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  noConsultationText: {
    color: '#999',
    fontSize: 14,
  },
});

export default HistoryDetailScreen;
