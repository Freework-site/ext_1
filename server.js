const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Add this line to enable CORS

// Endpoint to receive data from the frontend

app.post('/', (req,res) => {
    res.render("Hello buddy")
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
