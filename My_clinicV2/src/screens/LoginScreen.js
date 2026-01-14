import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { CustomInput, CustomButton } from '../components';
import { authService } from '../services';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre mot de passe");
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      if (userData) {
        await login(userData);
      } else {
        Alert.alert("Erreur", "Réponse serveur vide");
      }
    } catch (error) {
      const errorMessage = error?.error || error?.message || "Serveur non joignable";
      Alert.alert("Erreur de connexion", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton
        title="Se connecter"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  link: { marginTop: 20, textAlign: 'center', color: '#1a73e8' }
});