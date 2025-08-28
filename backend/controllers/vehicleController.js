const db = require('../firebase');
const { FieldValue } = require('firebase-admin/firestore');

exports.createVehicle = async (req, res) => {
    const { make, model, licensePlate, status } = req.body;
    try {
        const vehicleData = { make, model, licensePlate, status, createdAt: new Date() };
        const docRef = await db.collection('vehicles').add(vehicleData);
        res.status(201).json({ id: docRef.id, ...vehicleData });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};

exports.getVehicles = async (req, res) => {
    try {
        const vehiclesSnapshot = await db.collection('vehicles').get();
        const vehicles = [];
        vehiclesSnapshot.forEach(doc => {
            vehicles.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error getting vehicles:', error);
        res.status(500).json({ error: 'Failed to get vehicles' });
    }
};

exports.getVehicleById = async (req, res) => {
    const { id } = req.params;
    try {
        const vehicleDoc = await db.collection('vehicles').doc(id).get();
        if (!vehicleDoc.exists) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json({ id: vehicleDoc.id, ...vehicleDoc.data() });
    } catch (error) {
        console.error('Error getting vehicle by ID:', error);
        res.status(500).json({ error: 'Failed to get vehicle' });
    }
};

exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const vehicleRef = db.collection('vehicles').doc(id);
        await vehicleRef.update(updateData);
        res.status(200).json({ id, ...updateData });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('vehicles').doc(id).delete();
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};