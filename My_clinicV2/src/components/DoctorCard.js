import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const DoctorCard = ({
  doctor,
  onPress,
  actionButton = null
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={50} color="#1a73e8" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
        </View>
      </View>

      {doctor.phone && (
        <Text style={styles.detail}>
          <Ionicons name="call" size={14} /> {doctor.phone}
        </Text>
      )}

      {doctor.email && (
        <Text style={styles.detail}>
          <Ionicons name="mail" size={14} /> {doctor.email}
        </Text>
      )}

      {doctor.location && (
        <Text style={styles.detail}>
          <Ionicons name="location" size={14} /> {doctor.location}
        </Text>
      )}

      {actionButton && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={actionButton.onPress}
        >
          <Text style={styles.actionButtonText}>{actionButton.title}</Text>
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
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  detail: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  }
});
