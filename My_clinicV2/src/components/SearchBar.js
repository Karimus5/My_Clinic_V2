import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
  onClear = null
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
      <Text
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        placeholderTextColor="#999"
      />
      {value && onClear && (
        <Ionicons
          name="close-circle"
          size={18}
          color="#999"
          onPress={onClear}
          style={styles.clearIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginVertical: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  clearIcon: {
    marginLeft: 8,
  }
});
