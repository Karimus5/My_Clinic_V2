import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AppointmentCard = ({
  appointment,
  onPress,
  onCancel = null
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#388e3c';
      case 'pending':
        return '#f57c00';
      case 'cancelled':
        return '#d32f2f';
      case 'completed':
        return '#1a73e8';
      default:
        return '#999';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.doctor}>Dr. {appointment.doctorName}</Text>
          <Text style={styles.specialty}>{appointment.specialty}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(appointment.status) }
        ]}>
          <Text style={styles.statusText}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>{appointment.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>

        {appointment.reason && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#666" />
            <Text style={styles.detailText}>{appointment.reason}</Text>
          </View>
        )}
      </View>

      {onCancel && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Ionicons name="close-circle" size={16} color="#d32f2f" />
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  cancelButtonText: {
    marginLeft: 6,
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 13,
  }
});
