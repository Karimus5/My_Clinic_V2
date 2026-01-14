import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  
  // États pour les paramètres
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  // Sauvegarder les paramètres
  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Gestion des paramètres
  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    saveSettings('notifications_enabled', value);
  };

  const handleAppointmentRemindersToggle = (value) => {
    setAppointmentReminders(value);
    saveSettings('appointment_reminders', value);
  };

  const handleEmailNotificationsToggle = (value) => {
    setEmailNotifications(value);
    saveSettings('email_notifications', value);
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    saveSettings('dark_mode', value);
    Alert.alert('Mode sombre', 'Cette fonctionnalité sera disponible dans une prochaine version.');
  };

  const handleBiometricAuthToggle = (value) => {
    setBiometricAuth(value);
    saveSettings('biometric_auth', value);
    Alert.alert('Authentification biométrique', 'Cette fonctionnalité sera disponible dans une prochaine version.');
  };

  // Navigation vers les écrans
  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  const handleChangePassword = () => {
    Alert.alert('Changer le mot de passe', 'Cette fonctionnalité sera disponible bientôt.');
  };

  const handleAbout = () => {
    Alert.alert(
      'À propos',
      'My Clinic V2\nVersion 1.0.0\n\nApplication mobile de gestion médicale\nDéveloppée avec React Native & Expo\n\n© 2026 My Clinic V2'
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Politique de confidentialité', 'Vos données sont protégées et utilisées uniquement pour les services de l\'application.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Conditions d\'utilisation', 'En utilisant cette application, vous acceptez nos conditions d\'utilisation.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Composant pour une option de menu
  const SettingOption = ({ icon, title, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity style={styles.settingOption} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#26A69A" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {rightComponent ? rightComponent : (
        showArrow && <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  // Composant pour une section
  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#FFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@exemple.com'}</Text>
          </View>
        </View>
      </View>

      {/* Section Profil */}
      <SettingSection title="PROFIL">
        <SettingOption 
          icon="person-outline" 
          title="Modifier le profil" 
          onPress={handleEditProfile}
        />
        <SettingOption 
          icon="lock-closed-outline" 
          title="Changer le mot de passe" 
          onPress={handleChangePassword}
        />
      </SettingSection>

      {/* Section Notifications */}
      <SettingSection title="NOTIFICATIONS">
        <SettingOption 
          icon="notifications-outline" 
          title="Notifications" 
          showArrow={false}
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#CCC', true: '#26A69A' }}
              thumbColor={notificationsEnabled ? '#FFF' : '#F4F3F4'}
            />
          }
        />
        <SettingOption 
          icon="alarm-outline" 
          title="Rappels de rendez-vous" 
          showArrow={false}
          rightComponent={
            <Switch
              value={appointmentReminders}
              onValueChange={handleAppointmentRemindersToggle}
              trackColor={{ false: '#CCC', true: '#26A69A' }}
              thumbColor={appointmentReminders ? '#FFF' : '#F4F3F4'}
              disabled={!notificationsEnabled}
            />
          }
        />
        <SettingOption 
          icon="mail-outline" 
          title="Notifications email" 
          showArrow={false}
          rightComponent={
            <Switch
              value={emailNotifications}
              onValueChange={handleEmailNotificationsToggle}
              trackColor={{ false: '#CCC', true: '#26A69A' }}
              thumbColor={emailNotifications ? '#FFF' : '#F4F3F4'}
            />
          }
        />
      </SettingSection>

      {/* Section Apparence */}
      <SettingSection title="APPARENCE">
        <SettingOption 
          icon="moon-outline" 
          title="Mode sombre" 
          showArrow={false}
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#CCC', true: '#26A69A' }}
              thumbColor={darkMode ? '#FFF' : '#F4F3F4'}
            />
          }
        />
      </SettingSection>

      {/* Section Sécurité */}
      <SettingSection title="SÉCURITÉ">
        <SettingOption 
          icon="finger-print" 
          title="Authentification biométrique" 
          showArrow={false}
          rightComponent={
            <Switch
              value={biometricAuth}
              onValueChange={handleBiometricAuthToggle}
              trackColor={{ false: '#CCC', true: '#26A69A' }}
              thumbColor={biometricAuth ? '#FFF' : '#F4F3F4'}
            />
          }
        />
      </SettingSection>

      {/* Section À propos */}
      <SettingSection title="À PROPOS">
        <SettingOption 
          icon="information-circle-outline" 
          title="À propos de l'application" 
          onPress={handleAbout}
        />
        <SettingOption 
          icon="shield-checkmark-outline" 
          title="Politique de confidentialité" 
          onPress={handlePrivacyPolicy}
        />
        <SettingOption 
          icon="document-text-outline" 
          title="Conditions d'utilisation" 
          onPress={handleTermsOfService}
        />
      </SettingSection>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF5252" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingTop: 40,
    paddingBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1E8E7E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E0F2F1',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
});