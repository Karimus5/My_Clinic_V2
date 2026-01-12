const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });

// MODÈLE UTILISATEUR
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// ROUTE REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Cet email est déjà utilisé." });

    // ✅ Création dans la base de données
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE LOGIN (Pour tester après)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user) res.json(user);
  else res.status(401).json({ error: "Identifiants incorrects" });
});

sequelize.sync().then(() => {
  app.listen(5000, "0.0.0.0", () => console.log("🚀 Serveur prêt sur 172.20.10.3:5000"));
});