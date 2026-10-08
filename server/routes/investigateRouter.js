const express = require('express');

const investigateRouter = express.Router();
const investigateController = require('../controllers/investigateController');

investigateRouter.post('/start-investigation', investigateController.startInvestigation);

module.exports = investigateRouter;