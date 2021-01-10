const express = require('express');
const tourController = require('../controllers/tourcontroller');

const router = express.Router();

// router.param('id', (tourController.checkIDTour));

router
  .route('/top-5-cheap')
  .get(tourController.getAllTours, tourController.getTopCheap);

router.
  route('/tour-stats')
  .get(tourController.getTourStats);

router.
  route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

