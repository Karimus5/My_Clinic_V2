import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ErrorMessage = ({
  message,
  onRetry = null,
  type = 'error'
}) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#ffebee';
      case 'warning':
        return '#fff3e0';
      case 'success':
        return '#e8f5e9';
      default:
        return '#f5f5f5';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return '#c62828';
      case 'warning':
        return '#e65100';
      case 'success':
        return '#2e7d32';
      default:
        return '#333';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: getBackgroundColor() }
    ]}>
      <View style={styles.content}>
        <Ionicons
          name={getIcon()}
          size={24}
          color={getTextColor()}
          style={styles.icon}
        />
        <Text style={[
          styles.message,
          { color: getTextColor() }
        ]}>
          {message}
        </Text>
      </View>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: getTextColor() }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryButtonText, { color: getTextColor() }]}>
            Réessayer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  }
});
