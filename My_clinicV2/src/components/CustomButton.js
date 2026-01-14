import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

export const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        isDisabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[
          styles.text,
          styles[`textVariant_${variant}`]
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  variant_primary: {
    backgroundColor: '#1a73e8',
  },
  variant_secondary: {
    backgroundColor: '#e0e0e0',
  },
  variant_danger: {
    backgroundColor: '#d32f2f',
  },
  variant_success: {
    backgroundColor: '#388e3c',
  },
  size_small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  size_medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  size_large: {
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textVariant_primary: {
    color: '#fff',
  },
  textVariant_secondary: {
    color: '#333',
  },
  textVariant_danger: {
    color: '#fff',
  },
  textVariant_success: {
    color: '#fff',
  }
});
