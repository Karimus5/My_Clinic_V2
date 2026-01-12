const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// 1. Récupérer tous les médecins
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
});

// 2. Ajouter un médecin manuellement
router.post('/add', async (req, res) => {
  try {
    const { name, specialty, image } = req.body;
    const newDoc = await Doctor.create({ name, specialty, image });
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: "Impossible d'ajouter le médecin" });
  }
});

module.exports = router;