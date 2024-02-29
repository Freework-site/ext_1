const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Add this line to enable CORS

// Endpoint to receive data from the frontend
//Mangodb Connection
mongoose.connect('mongodb+srv://miarslan555:PswxfNRcQ7y0wBnG@snapx.cseqful.mongodb.net/?retryWrites=true&w=majority&appName=SnapX/extension_users')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
