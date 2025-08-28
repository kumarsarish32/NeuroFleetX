// firebase.js
const admin = require('firebase-admin');
require('dotenv').config();

// The path to your service account key file is read from the .env file.
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// We can now access Firestore through the initialized app
const db = admin.firestore();

// Export the Firestore database instance so other parts of your app can use it
module.exports = db;