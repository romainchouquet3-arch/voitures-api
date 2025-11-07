|<p>CHOUQUET Romain</p><p>PIEDELEU Robin</p>|||
| :- | :-: | -: |

TP développement web

Séance 1 : Initialisation du projet et première route

Initialisation de l’API node.js

Dans cette première étape, on met en place la base du serveur Node.js avec Express.\
` `L’objectif est d’obtenir une API simple capable de répondre à des requêtes HTTP de type GET, POST, PUT et DELETE.\
` `On initialise également les middlewares essentiels (cors et express.json) pour gérer la communication entre le backend et un futur frontend.

|<p>// Importation des modules nécessaires</p><p>const express = require('express');</p><p>const cors = require('cors');</p><p></p><p>// Création de l'application Express</p><p>const app = express();</p><p></p><p>// Configuration du port</p><p>const PORT = process.env.PORT || 3000;</p><p></p><p>// Middlewares globaux</p><p>app.use(cors()); // Autorise les requêtes cross-origin</p><p>app.use(express.json()); // Parse le JSON des requêtes// Route de test</p><p>app.get('/', (req, res) => {</p><p>`  `res.json({ </p><p>`    `message: 'Bienvenue sur l\'API de gestion de voitures classiques',</p><p>`    `version: '1.0.0'</p><p>`  `});</p><p>});</p><p>// GET - Récupérer toutes les voitures</p><p>app.get('/api/cars', (req, res) => {</p><p>`  `res.json({ </p><p>`    `message: 'Liste de toutes les voitures',</p><p>`    `data: [] </p><p>`  `});</p><p>});</p><p>// GET - Récupérer une voiture par son ID</p><p>app.get('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `res.json({ </p><p>`    `message: `Voiture avec l'ID ${id}`,</p><p>`    `data: null </p><p>`  `});</p><p>});</p><p></p>|<p>// POST - Créer une nouvelle voiture</p><p>app.post('/api/cars', (req, res) => {</p><p>`  `const carData = req.body;</p><p>`  `res.status(201).json({ </p><p>`    `message: 'Voiture créée avec succès',</p><p>`    `data: carData </p><p>`  `});</p><p>});</p><p></p><p>// PUT - Modifier une voiture existante</p><p>app.put('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `const carData = req.body;</p><p>`  `res.json({ </p><p>`    `message: `Voiture ${id} modifiée`,</p><p>`    `data: carData </p><p>`  `});</p><p>});</p><p></p><p>// DELETE - Supprimer une voiture</p><p>app.delete('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `res.json({ </p><p>`    `message: `Voiture ${id} supprimée` </p><p>`  `});</p><p>});</p><p></p><p>// Démarrage du serveur</p><p>app.listen(PORT, () => {</p><p>`  `console.log(`🚀 Serveur démarré sur le port ${PORT}`);</p><p>`  `console.log(`📍 [http://localhost:${PORT}`]());</p><p>});</p><p></p><p>app.get('/api/cars', (req, res) => {</p><p>  </p><p>`  `res.json({ message: 'Liste des voitures' });</p><p>});</p><p></p>|
| :- | :- |



On ajoute avec la méthode “POST” un élément à la base de données

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.001.png)

Ce premier serveur est purement statique. Les données ne sont pas encore stockées : chaque requête retourne un message JSON fixe.\
` `Cette étape permet de comprendre la structure d’une API REST et de vérifier que les routes fonctionnent dans Postman.



Séance 2 : Base de données SQLite

Dans cette étape, on connecte notre API à une base de données SQLite, afin de rendre les routes dynamiques.\
` `SQLite permet d’écrit des requêtes SQL (SELECT, INSERT, UPDATE, DELETE) directement dans les routes Express.

|<p>// Importation des modules nécessaires</p><p>const express = require('express');</p><p>const cors = require('cors');</p><p>const db = require('./database');</p><p>// Création de l'application Express</p><p>const app = express();</p><p></p><p>// Configuration du port</p><p>const PORT = process.env.PORT || 3000;</p><p></p><p>// Middlewares globaux</p><p>app.use(cors()); // Autorise les requêtes cross-origin</p><p>app.use(express.json()); // Parse le JSON des requêtes// Route de test</p><p>app.get('/', (req, res) => {</p><p>`  `res.json({ </p><p>`    `message: 'Bienvenue sur l\'API de gestion de voitures classiques',</p><p>`    `version: '1.0.0'</p><p>`  `});</p><p>});</p><p>// GET - Récupérer toutes les voitures</p><p>app.get('/api/cars', (req, res) => {</p><p>`  `const query = 'SELECT \* FROM cars ORDER BY year DESC';</p><p>  </p><p>`  `db.all(query, [], (err, rows) => {</p><p>`    `if (err) {</p><p>`      `return res.status(500).json({ </p><p>`        `error: 'Erreur lors de la récupération des voitures',</p><p>`        `details: err.message </p><p>`      `});</p><p>`    `}</p><p>    </p><p>`    `res.json({</p><p>`      `message: 'Liste des voitures',</p><p>`      `count: rows.length,</p><p>`      `data: rows</p><p>`    `});</p><p>`  `});</p><p>});</p><p></p><p>// GET - Récupérer une voiture par son ID</p><p>app.get('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `const query = 'SELECT \* FROM cars WHERE id = ?';</p><p></p><p></p>|<p>`  `db.get(query, [id], (err, row) => {</p><p>`    `if (err) {</p><p>`      `return res.status(500).json({ </p><p>`        `error: 'Erreur serveur',</p><p>`        `details: err.message </p><p>`      `});</p><p>`    `}</p><p>    </p><p>`    `if (!row) {</p><p>`      `return res.status(404).json({ </p><p>`        `error: 'Voiture non trouvée' </p><p>`      `});</p><p>`    `}</p><p>`    `res.json({</p><p>`      `message: 'Voiture trouvée',</p><p>`      `data: row</p><p>`    `});</p><p>`  `});</p><p>});</p><p>// POST - Créer une nouvelle voiture</p><p>app.post('/api/cars', (req, res) => {</p><p>`  `const carData = req.body;</p><p>`  `res.status(201).json({ </p><p>`    `message: 'Voiture créée avec succès',</p><p>`    `data: carData </p><p>`  `});</p><p>});</p><p>// PUT - Modifier une voiture existante</p><p>app.put('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `const carData = req.body;</p><p>`  `res.json({ </p><p>`    `message: `Voiture ${id} modifiée`,</p><p>`    `data: carData </p><p>`  `});</p><p>});</p><p>// DELETE - Supprimer une voiture</p><p>app.delete('/api/cars/:id', (req, res) => {</p><p>`  `const id = req.params.id;</p><p>`  `res.json({ </p><p>`    `message: `Voiture ${id} supprimée` </p><p>`  `});</p><p>});</p><p>// Démarrage du serveur</p><p>app.listen(PORT, () => {</p><p>`  `console.log(`🚀 Serveur démarré sur le port ${PORT}`);</p><p>`  `console.log(`📍 [http://localhost:${PORT}`]());</p><p>});</p><p></p><p>app.get('/api/cars', (req, res) => {</p><p>  </p><p>`  `res.json({ message: 'Liste des voitures' });</p><p>});</p><p></p><p></p>|
| :- | :- |
![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.002.png)

**Explication du schéma de table :**

- INTEGER PRIMARY KEY AUTOINCREMENT : ID unique qui s'incrémente automatiquement
- TEXT NOT NULL : Champ texte obligatoire
- INTEGER : Nombre entier
- REAL : Nombre décimal
- DATETIME DEFAULT CURRENT\_TIMESTAMP : Date de création automatique



La base de données a bien été ajoutée on vérifie avec POSTMAN la recherche dans la base de données

On affiche ainsi toute la base![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.003.png)

Le 1er élément

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.004.png)

On recherche hors des limites de la base de données![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.005.png)



Séance 3 : Contrôleurs et architecture MVC

Dans cette étape, on sépare le code en plusieurs fichiers :

- **controllers/** pour la logique métier (interactions avec la base)
- **models/** pour la gestion des données (SQL)
- **app.js** pour la configuration principale du serveur

Cela améliore la lisibilité, la maintenabilité et permet de faire évoluer le projet plus facilement.

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.006.png)

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.007.png)

Séance 4 : 

Pour sécuriser l’accès à notre API, on met en place un **middleware** vérifiant une clé API dans les headers de chaque requête.\
` `Sans cette clé, l’accès est refusé.

|<p>const express = require('express');</p><p>const bodyParser = require('body-parser');</p><p>const cors = require('cors');</p><p>const carsController = require('./controllers/usersControllers');</p><p>const app = express();</p><p>const PORT = process.env.PORT || 3000;</p><p>const checkApiKey = require('./middleware/checkApiKey');</p><p>// Middlewares</p><p>app.use(cors());</p><p>app.use(bodyParser.json());</p><p></p><p>// Route de bienvenue</p><p>app.get('/', (req, res) => {</p><p>`  `res.json({ </p><p>`    `message: 'Bienvenue sur l\'API de gestion de voitures classiques',</p><p>`    `version: '1.0.0',</p><p>`    `endpoints: {</p><p>`      `getAllCars: 'GET /api/cars',</p><p>`      `getCarById: 'GET /api/cars/:id',</p><p>`      `createCar: 'POST /api/cars',</p><p>`      `updateCar: 'PUT /api/cars/:id',</p><p>`      `deleteCar: 'DELETE /api/cars/:id'</p><p>`    `}</p><p>`  `});</p><p>});</p><p></p><p>// Routes CRUD (protégées par le middleware)</p><p>app.get('/api/cars', checkApiKey, carsController.getAllCars);</p><p>app.get('/api/cars/:id', checkApiKey, carsController.getCarById);</p><p>app.post('/api/cars', checkApiKey, carsController.createCar);</p><p>app.put('/api/cars/:id', checkApiKey, carsController.updateCar);</p><p>app.delete('/api/cars/:id', checkApiKey, carsController.deleteCar);</p><p></p><p>// Gestion des routes non trouvées</p><p>app.use((req, res) => {</p><p>`  `res.status(404).json({ </p><p>`    `error: 'Route non trouvée',</p><p>`    `message: `La route ${req.method} ${req.url} n'existe pas` </p><p>`  `});</p><p>});</p><p></p><p>// Démarrage du serveur</p><p>app.listen(PORT, () => {</p><p>`  `console.log(`🚀 Serveur démarré sur le port ${PORT}`);</p><p>`  `console.log(`📍 [http://localhost:${PORT}`]());</p><p>});</p><p></p>|
| :- |



|<p>// Middleware pour vérifier la clé API</p><p>const checkApiKey = (req, res, next) => {</p><p>`  `// Récupérer la clé API depuis les headers</p><p>`  `const apiKey = req.headers['x-api-key'];</p><p>  </p><p>`  `// Clé API attendue (en production, stockez-la dans des variables d'environnement)</p><p>`  `const validApiKey = 'ma-super-cle-api-2025';</p><p>  </p><p>`  `// Vérification</p><p>`  `if (!apiKey) {</p><p>`    `return res.status(401).json({</p><p>`      `error: 'Non autorisé',</p><p>`      `message: 'Clé API manquante. Ajoutez le header x-api-key à votre requête'</p><p>`    `});</p><p>`  `}</p><p>  </p><p>`  `if (apiKey !== validApiKey) {</p><p>`    `return res.status(403).json({</p><p>`      `error: 'Accès refusé',</p><p>`      `message: 'Clé API invalide'</p><p>`    `});</p><p>`  `}</p><p>  </p><p>`  `// Si tout est OK, on passe au prochain middleware/route</p><p>`  `console.log('✅ Clé API valide');</p><p>`  `next(<a name="_int_zpvauomr"></a>);</p><p>};</p><p></p><p>module.exports = checkApiKey;</p><p></p>|
| :- |
![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.008.png)

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.009.png)

J'ai mis “clé” au lieu de “ma-super-cle-api-2025" donc ça ne peut pas fonctionner

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.010.png)



Plus loin : 

Affiche permet d'effectuer une recherche dans la base de données on voie les différents essais que j’ai fait d'ajout de la Ferrari

![](Aspose.Words.30d6caec-3913-4b53-84ea-cfbba98d5667.011.png)
||||
| :- | :-: | -: |

