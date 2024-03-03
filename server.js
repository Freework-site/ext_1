// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://miarslan555:PswxfNRcQ7y0wBnG@snapx.cseqful.mongodb.net/?retryWrites=true&w=majority&appName=SnapX/user_database')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for the data
const userDataSchema = new mongoose.Schema({
    email: String,
    password: String,
    sessionToken: String // Add a field for session token
});

// Create a Mongoose model based on the schema
const UserData = mongoose.model('UserData', userDataSchema);

// Login endpoint
app.post('/data', async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Query the database for a user with the provided email and password
        const user = await UserData.findOne({ email, password });

        if (user) {
            // Check if the user already has an active session token
            if (user.sessionToken) {
                // User is already logged in
                res.status(401).send('User is already logged in on another browser');
                return;
            }

            // Generate a unique session token
            const sessionToken = generateSessionToken();

            // Update the user's document in the database with the session token
            await UserData.updateOne({ email }, { sessionToken });

            // User is authenticated
            res.status(200).send('Login successful');
        } else {
            // User not found or invalid credentials
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout endpoint
// Logout endpoint
app.post('/logout', async (req, res) => {
    try {
        // Extract email from the request body
        const { email } = req.body;
        console.log('Received email:', email); // Add this line to check if email is received

        // Remove the session token from the user's document in the database
        await UserData.findOneAndUpdate({ email }, { $set: { sessionToken: null } });

        res.status(200).send('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Function to generate a random session token
function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
