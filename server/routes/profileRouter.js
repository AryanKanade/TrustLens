const express = require('express');

const profilerouter = express.Router();
const profileController = require('../controllers/profileController');

profilerouter.post('/get-profile', profileController.getProfile);

module.exports = profilerouter;