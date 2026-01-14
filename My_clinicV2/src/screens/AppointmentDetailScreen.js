import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentDetailScreen({ route, navigation }) {
  // Données d'exemple pour la démo
  const appointment = route?.params?.appointment || {
    id: 1,
    date: '2026-01-20',
    time: '10:30',
    status: 'Confirmé',
    motif: 'Consultation de routine et suivi médical',
    Doctor: {
      name: 'Sarah Benali',
      specialty: 'Cardiologie',
      phone: '0612345678',
      email: 'dr.benali@myclinic.com',
      address: '15 Avenue Mohammed V, Casablanca'
    },
    createdAt: '2026-01-10T14:30:00',
    history: [
      { date: '2026-01-10 14:30', action: 'Rendez-vous créé', status: 'En attente' },
      { date: '2026-01-10 15:45', action: 'Confirmation par le médecin', status: 'Confirmé' },
    ],
    ConsultationNote: null
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmé': return '#10B981';
      case 'En attente': return '#F59E0B';
      case 'Annulé': return '#EF4444';
      case 'Complété': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmé': return 'checkmark-circle';
      case 'En attente': return 'time';
      case 'Annulé': return 'close-circle';
      case 'Complété': return 'checkbox';
      default: return 'help-circle';
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler le rendez-vous',
      'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Rendez-vous annulé avec succès');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleModify = () => {
    Alert.alert('Modifier', 'Fonctionnalité de modification disponible bientôt');
  };

  const handleContact = () => {
    Alert.alert('Contacter', `Appeler Dr. ${appointment.Doctor.name}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec statut */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Ionicons name={getStatusIcon(appointment.status)} size={24} color="#FFF" />
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>

      {/* Informations du rendez-vous */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Détails du rendez-vous</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#26A69A" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(appointment.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#26A69A" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Heure</Text>
            <Text style={styles.infoValue}>{appointment.time}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="document-text" size={20} color="#26A69A" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Motif</Text>
            <Text style={styles.infoValue}>{appointment.motif}</Text>
          </View>
        </View>
      </View>

      {/* Informations du médecin */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informations du médecin</Text>
        
        <View style={styles.doctorHeader}>
          <View style={styles.doctorAvatar}>
            <Ionicons name="person" size={40} color="#FFF" />
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {appointment.Doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{appointment.Doctor.specialty}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.contactRow} onPress={handleContact}>
          <Ionicons name="call" size={20} color="#26A69A" />
          <Text style={styles.contactText}>{appointment.Doctor.phone}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow}>
          <Ionicons name="mail" size={20} color="#26A69A" />
          <Text style={styles.contactText}>{appointment.Doctor.email}</Text>
        </TouchableOpacity>

        <View style={styles.contactRow}>
          <Ionicons name="location" size={20} color="#26A69A" />
          <Text style={styles.contactText}>{appointment.Doctor.address}</Text>
        </View>
      </View>

      {/* Historique du rendez-vous */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historique du rendez-vous</Text>
        
        {appointment.history.map((event, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            {index < appointment.history.length - 1 && <View style={styles.timelineLine} />}
            <View style={styles.timelineContent}>
              <Text style={styles.timelineAction}>{event.action}</Text>
              <Text style={styles.timelineDate}>
                {new Date(event.date).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <View style={[styles.timelineStatus, { backgroundColor: getStatusColor(event.status) + '20' }]}>
                <Text style={[styles.timelineStatusText, { color: getStatusColor(event.status) }]}>
                  {event.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Notes de consultation (si disponible) */}
      {appointment.ConsultationNote && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes de consultation</Text>
          <Text style={styles.consultationText}>
            {appointment.ConsultationNote.diagnosis}
          </Text>
        </View>
      )}

      {/* Boutons d'action */}
      {appointment.status === 'Confirmé' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.modifyButton} onPress={handleModify}>
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close-circle-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Référence: RDV-{appointment.id} • Créé le{' '}
          {new Date(appointment.createdAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#26A69A',
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    marginLeft: 15,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 15,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 30,
    marginBottom: 20,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#26A69A',
    borderWidth: 3,
    borderColor: '#E0F2F1',
  },
  timelineLine: {
    position: 'absolute',
    left: 5.5,
    top: 12,
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  timelineContent: {
    marginLeft: 0,
  },
  timelineAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  timelineStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  consultationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    gap: 10,
  },
  modifyButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#26A69A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
