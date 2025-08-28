// server.js
const express = require('express');
const vehicleRoutes = require('./routes/vehicleRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');

// Import middleware
const { isAuthenticated } = require('./middleware/authMiddleware');
const { hasRole } = require('./middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Use middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Public route for authentication
app.use('/api/auth', authRoutes);

// Protected routes (require a valid JWT)
// The order matters: authentication middleware runs before the route handler
// This new, corrected block handles all HTTP methods for /api/vehicles
app.get('/api/vehicles', isAuthenticated, (req, res, next) => next());
app.post('/api/vehicles', isAuthenticated, hasRole('admin'), (req, res, next) => next());
app.put('/api/vehicles/:id', isAuthenticated, hasRole('admin'), (req, res, next) => next());
app.delete('/api/vehicles/:id', isAuthenticated, hasRole('admin'), (req, res, next) => next());

app.use('/api/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the NeuroFleet Backend!');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected to WebSocket.');
    ws.on('message', message => {
        console.log(`Received message: ${message}`);
    });
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket.');
    });
});

let vehicleCounter = 0;
const sendVehicleLocation = () => {
    const data = {
        type: 'vehicle_update',
        id: 'real-time-vehicle-001',
        latitude: 28.6139 + Math.random() * 0.1,
        longitude: 77.2090 + Math.random() * 0.1,
        speed: Math.floor(Math.random() * 60)
    };
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
    vehicleCounter++;
};

setInterval(sendVehicleLocation, 2000);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});