const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Route to get all resources
router.get('/resources', resourceController.getAllResources);

// Route to get nearby resources based on location
router.get('/resources/nearby', resourceController.getNearbyResources);

// Route to add a new resource (admin use)
router.post('/resources', resourceController.addResource);

module.exports = router;
