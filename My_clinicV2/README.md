# 🏥 My Clinic V2

Application mobile de gestion médicale développée avec **React Native** et **Expo**.

Permet aux patients de consulter les médecins disponibles, prendre des rendez-vous, et gérer leur historique médical.

---

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Guide d'utilisation](#guide-dutilisation)

---

## ✨ Fonctionnalités

### 👤 Authentification
- ✅ Inscription utilisateur
- ✅ Connexion sécurisée
- ✅ Déconnexion
- ✅ Gestion du profil

### 👨‍⚕️ Médecins
- ✅ Lister tous les médecins disponibles
- ✅ Rechercher par nom ou spécialité
- ✅ Voir les détails du médecin
- ✅ Filtrer par spécialité

### 📅 Rendez-vous
- ✅ Prendre un rendez-vous
- ✅ Voir l'historique des rendez-vous
- ✅ Annuler un rendez-vous
- ✅ Statut du rendez-vous (confirmé, en attente, annulé)

### 📝 Consultations
- ✅ Notes de consultation
- ✅ Prescriptions
- ✅ Historique médical complet

### 🗺️ Fonctionnalités avancées
- ✅ Localisation des cliniques
- ✅ Interface tactile optimisée
- ✅ Notifications
- ✅ Stockage local des données

---

## 🏗️ Architecture

### Pattern: Service + Component + Screen

```
Screen (ex: HomeScreen)
    ↓
    Service (ex: doctorService)
    ↓
    API Backend
    ↓
    Component (ex: DoctorCard)
```

### Avantages
- 🔄 **Réutilisabilité** : Composants et services partagés
- 🧪 **Testabilité** : Services isolés et testables
- 📦 **Maintenabilité** : Code bien organisé et structuré
- 🚀 **Scalabilité** : Facile d'ajouter nouvelles features

---

## 📂 Structure du projet

```
My_clinicV2/
│
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── CustomInput.js       # Champs texte personnalisés
│   │   ├── CustomButton.js      # Boutons avec variantes
│   │   ├── DoctorCard.js        # Carte médecin
│   │   ├── AppointmentCard.js   # Carte rendez-vous
│   │   ├── LoadingSpinner.js    # Indicateur de chargement
│   │   ├── ErrorMessage.js      # Messages d'erreur/alerte
│   │   ├── SearchBar.js         # Barre de recherche
│   │   ├── EmptyState.js        # État vide
│   │   └── index.js             # Exports centralisés
│   │
│   ├── screens/                 # Écrans de l'application
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── DoctorsList.js
│   │   ├── AppointmentForm.js
│   │   ├── AppointmentsHistory.js
│   │   ├── ConsultationNoteScreen.js
│   │   ├── PrescriptionsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── MapScreen.js
│   │   ├── HistoryDetailScreen.js
│   │   ├── AdminScreen.js
│   │   └── HomePatient.js
│   │
│   ├── services/                # Logique métier & API
│   │   ├── api.js              # Configuration axios
│   │   ├── authService.js       # Authentification
│   │   ├── doctorService.js     # Opérations médecins
│   │   ├── appointmentService.js # Gestion rendez-vous
│   │   ├── storageService.js    # AsyncStorage
│   │   └── index.js             # Exports centralisés
│   │
│   ├── config/
│   │   └── api.js              # Configuration API
│   │
│   ├── context/
│   │   └── AuthContext.js       # Context d'authentification
│   │
│   └── navigation/
│       ├── AppNavigator.js      # Navigation principale
│       └── TabNavigator.js      # Navigation par onglets
│
├── assets/                       # Images, icônes, etc.
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── App.js                        # Point d'entrée
├── index.js                      # Configuration Expo
├── app.json                      # Configuration Expo
├── package.json                  # Dépendances
└── README.md                     # Documentation
```

---

## 🛠️ Technologies utilisées

### Frontend
- **React Native** 0.81.5 - Framework mobile
- **Expo** 54.0.31 - Plateforme de développement
- **React Navigation** 7.x - Navigation entre écrans
- **React Context** - Gestion d'état (authentification)

### HTTP & Stockage
- **Axios** 1.13.2 - Requêtes HTTP
- **AsyncStorage** 2.2.0 - Stockage local persistant

### UI & UX
- **Expo Vector Icons** - Icônes
- **React Native Maps** 1.20.1 - Cartes géographiques
- **React Native Calendars** - Calendrier
- **React Native DateTimePicker** - Sélecteur date/heure
- **React Native Gesture Handler** - Gestes tactiles
- **React Native Reanimated** - Animations

### Backend
- **Node.js + Express** - Serveur API
- **API REST** - Communication

---

## 📦 Installation

### Prérequis
- Node.js 16+ et npm
- Expo CLI : `npm install -g expo-cli`
- Un émulateur Android/iOS ou un téléphone physique

### Étapes

1. **Cloner le projet**
```bash
cd My_clinicV2
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'API**
Vérifiez `src/config/api.js` :
```javascript
export const API_URL = "http://172.20.10.4:5000/api";
```
Remplacez l'IP par celle de votre backend.

4. **Démarrer le serveur backend**
```bash
cd ../backend
npm install
node server.js
```

5. **Lancer l'app**
```bash
npm start
```

---

## ▶️ Scripts disponibles

```bash
# Démarrer en mode développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer sur web
npm run web
```

---

## 👤 Guide d'utilisation

### 1. Première connexion
- Cliquez sur "Créer un compte"
- Remplissez le formulaire d'inscription
- Confirmez votre email (si nécessaire)

### 2. Se connecter
- Entrez votre email
- Entrez votre mot de passe
- Cliquez sur "Se connecter"

### 3. Chercher un médecin
- Accédez à l'onglet "Médecins"
- Utilisez la barre de recherche pour filtrer
- Cliquez sur un médecin pour voir ses détails

### 4. Prendre un rendez-vous
- Sélectionnez un médecin
- Choisissez la date et l'heure
- Ajoutez une description du motif
- Confirmez la réservation

### 5. Gérer vos rendez-vous
- Accédez à "Mon historique"
- Visualisez tous vos rendez-vous
- Annulez si nécessaire

### 6. Profil
- Allez dans "Profil"
- Modifiez vos informations
- Changez votre mot de passe

---

## 🏥 Backend API

L'application communique avec un backend Node.js/Express.

### Endpoints principaux

```
POST   /api/login              # Connexion
POST   /api/register           # Inscription
GET    /api/doctors            # Lister médecins
GET    /api/doctors/:id        # Détail médecin
POST   /api/appointments       # Créer rendez-vous
GET    /api/appointments       # Lister rendez-vous
PUT    /api/appointments/:id   # Modifier rendez-vous
DELETE /api/appointments/:id   # Annuler rendez-vous
```

---

## 🔐 Authentification

Les tokens JWT sont stockés dans AsyncStorage et envoyés automatiquement via un intercepteur Axios :

```javascript
// Dans authService.js
const response = await authService.login(email, password);
// Token sauvegardé automatiquement
```

---

## 📱 Responsive Design

L'app est optimisée pour :
- ✅ Téléphones Android (5" à 7")
- ✅ Téléphones iOS
- ✅ Tablettes
- ✅ Orientation portrait et paysage

---

## 🚀 Améliorations futures

- [ ] Notifications push
- [ ] Intégration paiement (Stripe)
- [ ] Vidéo consultation
- [ ] Export PDF ordonnances
- [ ] Partage dossier médical
- [ ] Mode hors ligne
- [ ] Multi-langue

---

## 📞 Support & Contribution

Pour toute question ou bug report :
1. Ouvrez une issue sur le repository
2. Décrivez le problème clairement
3. Fournissez des étapes de reproduction

---

## 📄 Licence

Ce projet est sous licence propriétaire.

---

**Développé avec ❤️ en 2026**
