const express = require('express');

const investigateRouter = express.Router();
const investigateController = require('../controllers/investigateController');

investigateRouter.post('/start-investigation', investigateController.startInvestigation);
investigateRouter.post('/check-price', investigateController.checkPrice);
investigateRouter.post('/check-forums', investigateController.checkForums);
investigateRouter.post('/check-news', investigateController.checkNews);
investigateRouter.post('/check-maps-place', investigateController.checkMapsPlace);
investigateRouter.post('/check-maps-reviews', investigateController.checkMapsReviews);

module.exports = investigateRouter;