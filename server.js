// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid library for generating session tokens
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://miarslan555:PswxfNRcQ7y0wBnG@snapx.cseqful.mongodb.net/?retryWrites=true&w=majority&appName=SnapX/extension_users')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for the data
const userDataSchema = new mongoose.Schema({
    email: String,
    password: String,
    sessionToken: String // Add a field for storing session tokens
});

// Create a Mongoose model based on the schema
const UserData = mongoose.model('UserData', userDataSchema);

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already has an active session
        const existingUser = await UserData.findOne({ email, sessionToken: { $ne: null } });
        if (existingUser) {
            return res.status(401).send('User is already logged in from another device');
        }

        // Validate user credentials
        const user = await UserData.findOne({ email, password });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate a session token
        const sessionToken = uuidv4();

        // Update user with the session token
        await UserData.updateOne({ email }, { sessionToken });

        res.status(200).send('Login successful');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout endpoint
app.post('/logout', async (req, res) => {
    try {
        const { email } = req.body;

        // Remove the session token for the user
        await UserData.updateOne({ email }, { sessionToken: null });

        res.status(200).send('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
