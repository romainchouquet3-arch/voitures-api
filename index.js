// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const checkApiKey = require('./middleware/checkApiKey');
const carsController = require('./controllers/usersControllers');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de gestion de voitures classiques',
    version: '1.0.0',
    endpoints: {
      getAllCars: 'GET /api/cars',
      getCarById: 'GET /api/cars/:id',
      createCar: 'POST /api/cars',
      updateCar: 'PUT /api/cars/:id',
      deleteCar: 'DELETE /api/cars/:id',
      searchCars: 'GET /api/cars/search?brand=Ferrari&year=1962'
    }
  });
});



app.get('/api/cars/search', checkApiKey, (req, res) => {
  const { brand, year } = req.query;
  let query = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND LOWER(brand) = LOWER(?)';
    params.push(brand);
  }

  if (year) {
    query += ' AND year = ?';
    params.push(year);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Erreur lors de la recherche dans la base de données',
        details: err.message 
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Aucune voiture trouvée avec ces critères',
        filters: { brand, year }
      });
    }

    res.json({
      message: 'Résultats de la recherche',
      filters: { brand, year },
      count: rows.length,
      data: rows
    });
  });
});

// Routes pour la gestion des voitures CRUD
app.get('/api/cars', checkApiKey, carsController.getAllCars);
app.get('/api/cars/:id', checkApiKey, carsController.getCarById);
app.post('/api/cars', checkApiKey, carsController.createCar);
app.put('/api/cars/:id', checkApiKey, carsController.updateCar);
app.delete('/api/cars/:id', checkApiKey, carsController.deleteCar);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.url} n'existe pas` 
  });
});


// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
