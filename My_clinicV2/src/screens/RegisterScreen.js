import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE = "http://172.20.10.4:5000/api";

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert("Erreur", "Remplissez tout");
    try {
      await axios.post(`${API_BASE}/register`, { name, email, password });
      Alert.alert("Succès", "Compte créé ! Connectez-vous.");
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert("Erreur", e.response?.data?.error || "Inscription impossible");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleRegister}><Text style={styles.btnT}>S'inscrire</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.link}>Déjà un compte ? Se connecter</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 20, padding: 10 },
  btn: { backgroundColor: '#1a73e8', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#1a73e8', textAlign: 'center', marginTop: 20 }
});