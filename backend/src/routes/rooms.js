const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { optionalAuth } = require('../middleware/auth');
const { validateRoomSearch, validateRoomId } = require('../middleware/validation');

// Get all rooms with optional filters (public route)
router.get('/', validateRoomSearch, optionalAuth, roomController.getRooms);

// Get room types (public route)
router.get('/types', roomController.getRoomTypes);

// Get room by ID (public route)
router.get('/:id', validateRoomId, roomController.getRoomById);

// Get room availability for specific dates (public route)
router.get('/:id/availability', validateRoomId, roomController.getRoomAvailability);

module.exports = router;
