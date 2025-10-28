const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const carsController = require('./controllers/usersControllers');
const app = express();
const PORT = process.env.PORT || 3000;
const checkApiKey = require('./middleware/checkApiKey');
// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de gestion de voitures classiques',
    version: '1.0.0',
    endpoints: {
      getAllCars: 'GET /api/cars',
      getCarById: 'GET /api/cars/:id',
      createCar: 'POST /api/cars',
      updateCar: 'PUT /api/cars/:id',
      deleteCar: 'DELETE /api/cars/:id'
    }
  });
});

// Routes CRUD (protégées par le middleware)
app.get('/api/cars', checkApiKey, carsController.getAllCars);
app.get('/api/cars/:id', checkApiKey, carsController.getCarById);
app.post('/api/cars', checkApiKey, carsController.createCar);
app.put('/api/cars/:id', checkApiKey, carsController.updateCar);
app.delete('/api/cars/:id', checkApiKey, carsController.deleteCar);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.url} n'existe pas` 
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

/*// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const db = require('./database');
// Création de l'application Express
const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse le JSON des requêtes// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de gestion de voitures classiques',
    version: '1.0.0'
  });
});
// GET - Récupérer toutes les voitures
app.get('/api/cars', (req, res) => {
  const query = 'SELECT * FROM cars ORDER BY year DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Erreur lors de la récupération des voitures',
        details: err.message 
      });
    }
    
    res.json({
      message: 'Liste des voitures',
      count: rows.length,
      data: rows
    });
  });
});

// GET - Récupérer une voiture par son ID
app.get('/api/cars/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM cars WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Erreur serveur',
        details: err.message 
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        error: 'Voiture non trouvée' 
      });
    }
    
    res.json({
      message: 'Voiture trouvée',
      data: row
    });
  });
});

// POST - Créer une nouvelle voiture
app.post('/api/cars', (req, res) => {
  const carData = req.body;
  res.status(201).json({ 
    message: 'Voiture créée avec succès',
    data: carData 
  });
});

// PUT - Modifier une voiture existante
app.put('/api/cars/:id', (req, res) => {
  const id = req.params.id;
  const carData = req.body;
  res.json({ 
    message: `Voiture ${id} modifiée`,
    data: carData 
  });
});

// DELETE - Supprimer une voiture
app.delete('/api/cars/:id', (req, res) => {
  const id = req.params.id;
  res.json({ 
    message: `Voiture ${id} supprimée` 
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

app.get('/api/cars', (req, res) => {
  
  res.json({ message: 'Liste des voitures' });
});
  


/*const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des voitures classiques');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
/*
module.exports = app;
app.get('/api/cars', (req, res) => {
  res.json([
    { id: 1, brand: 'Ferrari', model: '250 GTO', year: 1962 },
    { id: 2, brand: 'Porsche', model: '911', year: 1964 }
  ]);
});
app.post('/api/cars', (req, res) => {
  const newCar = req.body;
  newCar.id = Date.now();
  res.status(201).json(newCar);
}*/