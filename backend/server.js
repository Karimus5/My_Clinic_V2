const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: './database.sqlite', 
  logging: false 
});

// --- MODÈLES ---
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' } // admin ou user
});

const Doctor = sequelize.define('Doctor', {
  name: DataTypes.STRING,
  specialty: DataTypes.STRING,
  image: DataTypes.STRING,
  address: DataTypes.STRING,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT
});

const Appointment = sequelize.define('Appointment', {
  date: DataTypes.STRING,
  time: DataTypes.STRING,
  doctorId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER 
});

const Review = sequelize.define('Review', {
  rating: DataTypes.INTEGER,
  comment: DataTypes.STRING,
  userName: DataTypes.STRING,
  doctorId: DataTypes.INTEGER
});

// --- ASSOCIATIONS ---
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Doctor.hasMany(Review, { foreignKey: 'doctorId' });
Review.belongsTo(Doctor, { foreignKey: 'doctorId' });

// --- ROUTES ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email: email.toLowerCase(), password, role: 'user' });
    res.status(201).json({ message: "Compte créé", user });
  } catch (err) {
    res.status(400).json({ error: "Email déjà utilisé" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase(), password } });
    if (user) {
      res.json({ user: { id: user.id, name: user.name, role: user.role } });
    } else {
      res.status(401).json({ error: "Identifiants incorrects" });
    }
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get('/api/admin/stats', async (req, res) => {
  res.json({
    userCount: await User.count(),
    doctorCount: await Doctor.count(),
    appointmentCount: await Appointment.count()
  });
});

// GET stats for a specific user
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const total = await Appointment.count({ where: { userId } });
    const next = await Appointment.findOne({ 
      where: { userId }, 
      include: [Doctor],
      order: [['date', 'ASC']]
    });
    
    res.json({
      total,
      next,
      healthScore: 85 // Placeholder value
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des stats" });
  }
});

// GET all appointments for a user
app.get('/api/appointments', async (req, res) => {
  try {
    const { userId } = req.query;
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [Doctor],
      order: [['date', 'DESC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous" });
  }
});

// POST new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { date, time, doctorId, patientName, userId } = req.body;
    
    // Vérifier si le créneau est déjà réservé
    const existingAppointment = await Appointment.findOne({
      where: { date, time, doctorId }
    });
    
    if (existingAppointment) {
      return res.status(409).json({ error: "Ce créneau est déjà réservé. Veuillez choisir un autre." });
    }
    
    const appointment = await Appointment.create({
      date,
      time,
      doctorId,
      userId
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Impossible de créer le rendez-vous" });
  }
});

// DELETE appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.destroy({ where: { id } });
    res.json({ message: "Rendez-vous supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// GET reviews for a doctor
app.get('/api/reviews/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.findAll({ where: { doctorId } });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des avis" });
  }
});

// POST new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { rating, comment, userName, doctorId } = req.body;
    const review = await Review.create({ rating, comment, userName, doctorId });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: "Impossible de publier l'avis" });
  }
});

app.get('/api/doctors', async (req, res) => {
  res.json(await Doctor.findAll());
});

// Ajouter un médecin
app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialty, latitude, longitude, image } = req.body;
    const doctor = await Doctor.create({ name, specialty, latitude, longitude, image });
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erreur lors de la création du médecin" });
  }
});

// Supprimer un médecin
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.destroy({ where: { id } });
    res.json({ message: "Médecin supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// Modifier un médecin
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, latitude, longitude, address, image } = req.body;
    
    await Doctor.update(
      { name, specialty, latitude, longitude, address, image },
      { where: { id } }
    );
    
    const updatedDoctor = await Doctor.findByPk(id);
    res.json(updatedDoctor);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erreur lors de la modification" });
  }
});

// --- DÉMARRAGE AVEC MISE À JOUR DE LA BASE ---
// L'option { alter: true } ajoute les colonnes manquantes (comme 'role') automatiquement
sequelize.sync({ alter: true }).then(async () => {
  const admin = await User.findOne({ where: { email: "admin@test.com" } });
  if (!admin) {
    await User.create({ 
      name: "Administrateur", 
      email: "admin@test.com", 
      password: "123", 
      role: 'admin' 
    });
    console.log("👤 Compte Admin créé avec succès");
  }

  // Ajouter des médecins s'il n'y en a pas
  const doctorCount = await Doctor.count();
  if (doctorCount === 0) {
    await Doctor.create({ name: "Dr. Martin Dubois", specialty: "Généraliste", address: "Boulevard de la Corniche, Casablanca", latitude: 33.5700, longitude: -7.6000 });
    await Doctor.create({ name: "Dr. Sophie Bernard", specialty: "Dermatologue", address: "Rue Allal Ben Abdellah, Casablanca", latitude: 33.5750, longitude: -7.5950 });
    await Doctor.create({ name: "Dr. Jean Moreau", specialty: "Cardiologue", address: "Avenue Hassan II, Casablanca", latitude: 33.5731, longitude: -7.5898 });
    await Doctor.create({ name: "Dr. Pierre Leclerc", specialty: "Neurologue", address: "Rue Tarik Ibn Ziad, Casablanca", latitude: 33.5780, longitude: -7.5870 });
    await Doctor.create({ name: "Dr. Marie Petit", specialty: "Pédiatre", address: "Boulevard Mohamed V, Casablanca", latitude: 33.5720, longitude: -7.5920 });
    await Doctor.create({ name: "Dr. Luc Gautier", specialty: "Orthopédiste", address: "Rue Sidi Belyout, Casablanca", latitude: 33.5690, longitude: -7.6050 });
    await Doctor.create({ name: "Dr. Isabelle Fournier", specialty: "Gynécologue", address: "Avenue Abdelmoumen, Casablanca", latitude: 33.5760, longitude: -7.5880 });
    await Doctor.create({ name: "Dr. Thomas Renault", specialty: "Urologue", address: "Rue Colonel Driss, Casablanca", latitude: 33.5740, longitude: -7.5960 });
    await Doctor.create({ name: "Dr. Nathalie Durand", specialty: "Ophtalmologue", address: "Rue Ghandi, Casablanca", latitude: 33.5710, longitude: -7.5910 });
    await Doctor.create({ name: "Dr. Christophe Martin", specialty: "ORL", address: "Boulevard d'Anfa, Casablanca", latitude: 33.5850, longitude: -7.6100 });
    await Doctor.create({ name: "Dr. Véronique Blanc", specialty: "Psychiatre", address: "Rue Bab Marrakech, Casablanca", latitude: 33.5650, longitude: -7.5800 });
    await Doctor.create({ name: "Dr. François Rousseau", specialty: "Dentiste", address: "Avenue de Fès, Casablanca", latitude: 33.5800, longitude: -7.5870 });
    await Doctor.create({ name: "Dr. Sylvie Girard", specialty: "Gastroentérologue", address: "Rue Strasbourg, Casablanca", latitude: 33.5730, longitude: -7.5930 });
    
    // Ajouter des médecins supplémentaires avec les mêmes spécialités
    await Doctor.create({ name: "Dr. Ahmed Karim", specialty: "Généraliste", address: "Rue de Foucauld, Casablanca", latitude: 33.5710, longitude: -7.5880 });
    await Doctor.create({ name: "Dr. Laila Hassan", specialty: "Cardiologue", address: "Avenue Lalla Yacout, Casablanca", latitude: 33.5760, longitude: -7.5950 });
    await Doctor.create({ name: "Dr. Karim Bennani", specialty: "Dermatologue", address: "Boulevard de la Liberté, Casablanca", latitude: 33.5740, longitude: -7.5820 });
    await Doctor.create({ name: "Dr. Fatima Mansouri", specialty: "Pédiatre", address: "Rue Othman Ibn Affan, Casablanca", latitude: 33.5700, longitude: -7.5900 });
    await Doctor.create({ name: "Dr. Hassan Aziz", specialty: "Orthopédiste", address: "Avenue Pasteur, Casablanca", latitude: 33.5780, longitude: -7.6050 });
    await Doctor.create({ name: "Dr. Amina Alami", specialty: "Gynécologue", address: "Rue Abdelkrim Khattabi, Casablanca", latitude: 33.5720, longitude: -7.5870 });
    
    console.log("🏥 19 Médecins créés avec succès à Casablanca");
  }

  app.listen(5000, "0.0.0.0", () => console.log("🚀 Serveur prêt sur port 5000"));
});