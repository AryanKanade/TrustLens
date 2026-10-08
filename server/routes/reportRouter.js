const express = require('express');
const reportRouter = express.Router();
const reportController = require('../controllers/reportController');

reportRouter.get('/:id', reportController.getReport);

module.exports = reportRouter;