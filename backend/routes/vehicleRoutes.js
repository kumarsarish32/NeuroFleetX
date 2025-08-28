const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// CREATE a new vehicle
router.post('/', vehicleController.createVehicle);

// GET all vehicles
router.get('/', vehicleController.getVehicles);

// GET a single vehicle by ID
router.get('/:id', vehicleController.getVehicleById);

// UPDATE a vehicle by ID
router.put('/:id', vehicleController.updateVehicle);

// DELETE a vehicle by ID
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;