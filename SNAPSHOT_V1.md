# 📸 SNAPSHOT - État Actuel du Projet (13 Janvier 2026)

## 🏗️ Architecture Générale

```
My_clinicV2/
├── Frontend (React Native - Expo)
│   ├── Screens
│   ├── Navigation
│   └── Services API
│
Backend/
├── Express.js Server
├── SQLite Database
└── Routes API
```

---

## 🎯 Fonctionnalités Implémentées

### ✅ Authentication & Profil
- [x] Inscription/Connexion utilisateurs
- [x] Logout
- [x] Profil utilisateur avec avatar
- [x] Onglet Profil avec statistiques de santé

### ✅ Gestion des Rendez-vous
- [x] Vue liste des médecins
- [x] Réservation de RDV avec calendrier
- [x] Sélection d'heures disponibles
- [x] Validation : pas de réservation à heures passées (fuseau horaire GMT+1 Maroc)
- [x] Historique des rendez-vous

### ✅ Score de Santé (Dynamique)
- [x] Calcul basé sur :
  - Score de base: 50 points
  - +10 par RDV (max 30)
  - +15 si RDV ce mois-ci
  - +5 pour régularité (3 derniers mois)
  - Maximum: 100 points
- [x] Affichage avec barre de progression visuelle
- [x] Rafraîchissement à chaque accès au profil

### ✅ Consultations Médicales
- [x] Notes de consultation (symptômes, diagnostic, traitement)
- [x] Historique des consultations

### ✅ Avis & Évaluations
- [x] Système d'avis sur les médecins (étoiles + commentaires)
- [x] Affichage des avis sur la fiche médecin

### ✅ Admin Dashboard
- [x] Vue statistiques (utilisateurs, médecins, RDV)
- [x] **Gestion des médecins** :
  - Ajouter médecin avec photo
  - Modifier médecin
  - Supprimer médecin
  - Recherche/Filtrage
  - Sélection localisation sur carte

### ✅ Autres Fonctionnalités
- [x] Carte interactive (affichage médecins + sélection localisation)
- [x] Prescription screen
- [x] Settings screen
- [x] Safe Area Context (fix dépréciations)

---

## 📦 Base de Données (SQLite)

### Tables
- **Users** : id, name, email, password, role (user/admin)
- **Doctors** : id, name, specialty, image, address, latitude, longitude
- **Appointments** : id, date, time, doctorId, userId
- **ConsultationNotes** : id, appointmentId, doctorId, userId, symptoms, diagnosis, treatment, notes, visitDate
- **Reviews** : id, rating, comment, userName, doctorId

### Associations
```
User ← → Appointment → Doctor
User ← → ConsultationNote → Doctor
Doctor ← → Review
```

---

## 🔧 Configuration Actuelle

### Backend
- **Server** : Express.js (port 5000)
- **Database** : SQLite (./database.sqlite)
- **Fuseau Horaire** : GMT+1 (Maroc)
- **IP Locale** : 172.20.10.4

### Frontend
- **Framework** : React Native (Expo)
- **Navigation** : Bottom Tabs + Stack Navigation
- **API Base** : http://172.20.10.4:5000/api

### Dépendances Principales
**Backend** :
- express, sequelize, sqlite3
- bcryptjs, jsonwebtoken
- cors

**Frontend** :
- react-native, expo
- react-navigation
- axios, react-native-maps, react-native-calendars
- expo-image-picker

---

## 🐛 Récentes Corrections
1. ✅ Validation des heures passées (fuseau horaire marocain)
2. ✅ Score de santé dynamique basé sur les rendez-vous
3. ✅ SafeAreaView remplacé par react-native-safe-area-context
4. ✅ Fix erreur 500 dans /api/stats/:userId

---

## 📋 À FAIRE (Prochaines Étapes)

### 🎯 Demande Actuelle
- [ ] Ajouter gestion des **utilisateurs pour l'admin** (comme la gestion des médecins)
  - Voir liste des utilisateurs
  - Modifier utilisateur
  - Supprimer utilisateur
  - Rechercher utilisateur

---

## 📱 Screens Disponibles

### Patient
- LoginScreen
- RegisterScreen
- HomePatient
- HomeScreen (Liste médecins)
- AppointmentForm
- AppointmentsHistory
- HistoryDetailScreen
- DoctorsList
- ProfileScreen
- PrescriptionsScreen
- SettingsScreen
- MapScreen
- ConsultationNoteScreen

### Admin
- AdminScreen (Dashboard + Gestion médecins)

---

## 🔗 Routes API Principales

### Auth
- `POST /api/register` - Créer compte
- `POST /api/login` - Connexion

### Doctors
- `GET /api/doctors` - Liste tous les médecins
- `POST /api/doctors` - Ajouter médecin
- `PUT /api/doctors/:id` - Modifier médecin
- `DELETE /api/doctors/:id` - Supprimer médecin

### Appointments
- `GET /api/appointments?userId=X` - Liste RDV patient
- `POST /api/appointments` - Réserver RDV
- `GET /api/stats/:userId` - Stats patient + score santé

### Reviews
- `GET /api/reviews/:doctorId` - Avis médecin
- `POST /api/reviews` - Poster avis

### Admin
- `GET /api/admin/stats` - Stats globales

---

## ✨ Notes Importantes
- Fuseau horaire **GMT+1** appliqué partout
- Score santé recalculé à chaque accès profil
- Admin a accès au dashboard avec gestion médecins
- **À implémenter** : gestion utilisateurs pour admin

---

**Date du Snapshot** : 13 Janvier 2026  
**Version** : 1.0 (Stable avec corrections)
