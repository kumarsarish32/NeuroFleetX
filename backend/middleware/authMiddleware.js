// middleware/authMiddleware.js
const admin = require('firebase-admin');
const db = require('../firebase');

exports.isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Try to resolve role from token claims first
      let role = decodedToken.role || null;

      // If no role in token, try to fetch from Firestore users collection
      if (!role && decodedToken.uid) {
        try {
          const userDoc = await db.collection('users').doc(decodedToken.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            role = data && data.role ? data.role : null;
          }
        } catch (e) {
          console.error('Error fetching user role from Firestore:', e);
        }
      }

      req.user = { ...decodedToken, role };
      return next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};