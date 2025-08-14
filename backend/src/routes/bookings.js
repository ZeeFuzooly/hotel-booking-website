const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const { validateBooking, validateBookingId } = require('../middleware/validation');

// All booking routes require authentication
router.use(authenticateToken);

// Create a new booking
router.post('/', validateBooking, bookingController.createBooking);

// Get user's bookings
router.get('/', bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', validateBookingId, bookingController.getBookingById);

// Cancel booking
router.delete('/:id', validateBookingId, bookingController.cancelBooking);

module.exports = router;
