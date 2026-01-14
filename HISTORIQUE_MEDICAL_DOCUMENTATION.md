# 📋 Système d'Historique Médical Détaillé - Documentation

## Vue d'ensemble
Un système complet permettant aux patients de consulter leur historique médical détaillé et aux docteurs de documenter les consultations avec diagnostics, traitements et ordonnances.

---

## 🗄️ Modèles de Base de Données

### 1. **ConsultationNote** (Note de Consultation)
Stocke les détails de chaque consultation médicale.

```javascript
{
  appointmentId: INTEGER,          // Lien vers le rendez-vous
  doctorId: INTEGER,               // Docteur ayant effectué la consultation
  userId: INTEGER,                 // Patient
  symptoms: TEXT,                  // Symptômes rapportés
  diagnosis: TEXT,                 // Diagnostic établi
  treatment: TEXT,                 // Traitement recommandé
  notes: TEXT,                     // Notes additionnelles
  visitDate: DATE                  // Date de la visite
}
```

### 2. **Prescription** (Ordonnance)
Stocke les médicaments prescrits et les instructions.

```javascript
{
  consultationNoteId: INTEGER,     // Lien vers la consultation
  userId: INTEGER,                 // Patient
  doctorId: INTEGER,               // Docteur prescripteur
  medicines: JSON,                 // [{name, dosage, frequency, duration}]
  instructions: TEXT               // Instructions spéciales
}
```

---

## 🔌 Routes API

### **Historique (Patients)**

#### GET `/api/history/:userId`
Récupère l'historique complet d'un patient avec toutes les consultations complétées.

**Réponse:**
```json
[
  {
    "id": 1,
    "date": "2024-01-10",
    "status": "completed",
    "Doctor": {
      "name": "Martin Dubois",
      "specialty": "Généraliste"
    },
    "ConsultationNote": {
      "symptoms": "Toux, fièvre",
      "diagnosis": "Grippe",
      "treatment": "Repos et hydratation",
      "Prescriptions": [...]
    }
  }
]
```

#### GET `/api/consultation/:consultationId`
Obtient les détails complets d'une consultation spécifique.

---

### **Consultation (Docteurs)**

#### POST `/api/consultation-notes`
Ajoute une note de consultation après une visite.

**Body:**
```json
{
  "appointmentId": 1,
  "doctorId": 5,
  "userId": 10,
  "symptoms": "Toux, fièvre, fatigue",
  "diagnosis": "Grippe saisonnière",
  "treatment": "Repos de 3-5 jours, hydratation régulière",
  "notes": "Patient a bon moral, suivi recommandé dans 1 semaine"
}
```

#### PUT `/api/consultation-notes/:consultationId`
Modifie une note de consultation existante.

---

### **Ordonnances**

#### POST `/api/prescriptions`
Crée une ordonnance pour un patient.

**Body:**
```json
{
  "consultationNoteId": 1,
  "userId": 10,
  "doctorId": 5,
  "medicines": [
    {
      "name": "Paracétamol",
      "dosage": "500mg",
      "frequency": "3x par jour",
      "duration": "7 jours"
    }
  ],
  "instructions": "À prendre avec de la nourriture"
}
```

#### GET `/api/prescriptions/:userId`
Récupère toutes les ordonnances d'un patient.

---

## 📱 Écrans Frontend

### **1. HistoryDetailScreen** (`HistoryDetailScreen.js`)
Affiche l'historique médical du patient avec tous les diagnostics et traitements.

**Fonctionnalités:**
- Liste de tous les rendez-vous complétés
- Affichage détaillé pour chaque consultation
- Visualisation des symptômes, diagnostics, traitements
- Affichage des ordonnances associées
- Interface intuitive et facile à lire

**Navigation:**
- Clique sur une consultation pour voir les détails
- Bouton retour pour revenir à la liste

### **2. ConsultationNoteScreen** (`ConsultationNoteScreen.js`)
Interface pour les docteurs pour documenter une consultation.

**Fonctionnalités:**
- Entrée des symptômes rapportés
- Enregistrement du diagnostic
- Description du traitement recommandé
- Notes additionnelles libres
- Ajout dynamique de médicaments
- Instructions de prise des médicaments

**Flux:**
1. Docteur remplit le diagnostic et traitement (obligatoires)
2. Ajoute les symptômes et notes (optionnels)
3. Ajoute les médicaments prescrits
4. Enregistre tout d'un seul coup

### **3. PrescriptionsScreen** (`PrescriptionsScreen.js`)
Affiche les ordonnances d'un patient.

**Fonctionnalités:**
- Liste de toutes les ordonnances
- Détails complets de chaque ordonnance
- Affichage des médicaments avec dosage et fréquence
- Bouton de partage pour envoyer l'ordonnance
- Interface claire et professionnelle

---

## 🔄 Flux de Travail Complet

```
┌─────────────────────────────────────────────────────┐
│ 1. PATIENT prend RDV avec DOCTEUR                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. Rendez-vous s'effectue                           │
│    (status: pending → completed)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. DOCTEUR remplit ConsultationNoteScreen           │
│    - Enregistre les symptômes                       │
│    - Diagnostique la condition                      │
│    - Prescrit un traitement                         │
│    - Ajoute les médicaments                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 4. Création automatique:                            │
│    - ConsultationNote avec tous les détails         │
│    - Prescription si médicaments                    │
│    - Status du rendez-vous → completed              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 5. PATIENT accède à HistoryDetailScreen             │
│    - Voit tout son historique médical               │
│    - Consulte les diagnostics passés                │
│    - Accède à ses ordonnances                       │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Intégration dans le Navigation

Ajoutez ces écrans dans `AppNavigator.js` ou `TabNavigator.js`:

```javascript
// Pour les patients
<Stack.Screen name="History" component={HistoryDetailScreen} />
<Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />

// Pour les docteurs
<Stack.Screen name="ConsultationNote" component={ConsultationNoteScreen} />
```

---

## 📊 Améliorations Futures

1. **Export PDF** - Exporter les ordonnances en PDF
2. **Rappels de médicaments** - Notifications pour prendre les médicaments
3. **Graphiques** - Visualiser les tendances de santé
4. **Recommandations** - Suggestions de suivi basées sur l'historique
5. **Documents attachés** - Upload d'images/analyses médicales
6. **Chat médecin-patient** - Communication directe

---

## 🔐 Points de Sécurité

✅ Vérifier l'authentification de l'utilisateur avant d'accéder à son historique
✅ Limiter l'accès des docteurs à leurs propres consultations
✅ Chiffrer les données sensibles (ordonnances, diagnostics)
✅ Logger tous les accès aux données médicales

---

## 📝 Notes d'Implémentation

- Les modèles utilisent SQLite avec Sequelize
- Les associations permettent les requêtes imbriquées efficaces
- Les timestamps (createdAt) sont automatiquement gérés
- Les ordonnances stockent les médicaments en JSON pour la flexibilité
