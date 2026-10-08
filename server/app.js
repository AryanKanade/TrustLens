require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
require('./config/db');

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/profile', require('./routes/profileRouter'));
app.use('/api/investigate', require('./routes/investigateRouter'));

//Health check route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

//port
const PORT = process.env.PORT || 5000;

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})