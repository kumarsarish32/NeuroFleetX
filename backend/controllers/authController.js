// controllers/authController.js
const admin = require('firebase-admin');
const db = require('../firebase');

// Handle user registration
exports.register = async (req, res) => {
    const { email, password } = req.body;
    
    // Perform a basic check for email and password
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        console.log(`[AUTH] Attempting to create user: ${email}`);
        
        // Step 1: Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        console.log(`[AUTH] User created in Firebase Auth: ${userRecord.uid}`);
        
        // Step 2: Store user data in Firestore
        console.log(`[FIRESTORE] Attempting to create user document...`);
        await db.collection('users').doc(userRecord.uid).set({
            email: userRecord.email,
            role: 'user', // Default role for a new user
            createdAt: new Date(),
        });
        console.log(`[FIRESTORE] User document created successfully.`);

        // Step 3: Set a custom claim for the user
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });
        console.log(`[AUTH] Custom claim set for user.`);

        return res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        // If an error occurs, it's most likely during the Firestore write
        console.error('Error during registration:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        
        return res.status(500).json({ error: 'Failed to register user.' });
    }
};

// Handle user login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        // Get user by email to ensure they exist
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Create a custom token for the client to use for authentication
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        
        return res.status(200).json({ token: customToken });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Failed to log in. Check credentials.' });
    }
};

// Return current authenticated user's profile (uid, email, role)
exports.me = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { uid, email, role } = req.user;
    return res.status(200).json({ uid, email: email || null, role: role || null });
};

// Admin-only: set a user's role (accepts uid or email)
exports.setRole = async (req, res) => {
    const { uid, email, role } = req.body;
    if (!role || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Use "admin" or "user".' });
    }

    try {
        let targetUid = uid;
        if (!targetUid && email) {
            const userRecord = await admin.auth().getUserByEmail(email);
            targetUid = userRecord.uid;
        }
        if (!targetUid) {
            return res.status(400).json({ error: 'Provide uid or email to identify the user.' });
        }

        // Update Firestore profile
        await db.collection('users').doc(targetUid).set({ role }, { merge: true });
        // Update custom claims
        await admin.auth().setCustomUserClaims(targetUid, { role });

        return res.status(200).json({ message: `Role updated to ${role} for user ${targetUid}.` });
    } catch (error) {
        console.error('Error setting user role:', error);
        return res.status(500).json({ error: 'Failed to set user role.' });
    }
};