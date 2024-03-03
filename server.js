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
mongoose.connect('mongodb+srv://miarslan555:PswxfNRcQ7y0wBnG@snapx.cseqful.mongodb.net/?retryWrites=true&w=majority&appName=SnapX/extension_users')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for the data
const userDataSchema = new mongoose.Schema({
    email: String,
    password: String
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
