const { db } = require('../config/database');

// Get all rooms with optional filters
const getRooms = (req, res) => {
  try {
    const {
      check_in,
      check_out,
      guests,
      room_type,
      min_price,
      max_price,
      page = 1,
      limit = 10
    } = req.query;

    // Build WHERE clause for filters
    const whereConditions = [];
    const queryParams = [];

    if (guests) {
      whereConditions.push('capacity >= ?');
      queryParams.push(parseInt(guests));
    }

    if (room_type) {
      whereConditions.push('room_type = ?');
      queryParams.push(room_type);
    }

    if (min_price) {
      whereConditions.push('price_per_night >= ?');
      queryParams.push(parseFloat(min_price));
    }

    if (max_price) {
      whereConditions.push('price_per_night <= ?');
      queryParams.push(parseFloat(max_price));
    }

    // Check availability for specific dates
    if (check_in && check_out) {
      whereConditions.push(`
        id NOT IN (
          SELECT DISTINCT room_id 
          FROM bookings 
          WHERE status != 'cancelled' 
          AND (
            (check_in_date <= ? AND check_out_date > ?) OR
            (check_in_date < ? AND check_out_date >= ?) OR
            (check_in_date >= ? AND check_out_date <= ?)
          )
        )
      `);
      queryParams.push(check_out, check_in, check_out, check_in, check_in, check_out);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count total rooms for pagination
    const countQuery = `SELECT COUNT(*) as total FROM rooms ${whereClause}`;

    db.get(countQuery, queryParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error counting rooms'
        });
      }

      const totalRooms = countResult.total;
      const totalPages = Math.ceil(totalRooms / limit);
      const offset = (page - 1) * limit;

      // Get rooms with pagination
      const roomsQuery = `
        SELECT 
          id, name, description, price_per_night, capacity, 
          room_type, amenities, image_url, created_at, updated_at
        FROM rooms 
        ${whereClause}
        ORDER BY price_per_night ASC
        LIMIT ? OFFSET ?
      `;

      const finalParams = [...queryParams, parseInt(limit), offset];

      db.all(roomsQuery, finalParams, (err, rooms) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error retrieving rooms'
          });
        }

        // Parse amenities JSON for each room
        const roomsWithParsedAmenities = rooms.map(room => ({
          ...room,
          amenities: room.amenities ? JSON.parse(room.amenities) : []
        }));

        res.json({
          rooms: roomsWithParsedAmenities,
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_rooms: totalRooms,
            rooms_per_page: parseInt(limit),
            has_next: page < totalPages,
            has_prev: page > 1
          },
          filters: {
            check_in,
            check_out,
            guests: guests ? parseInt(guests) : null,
            room_type,
            min_price: min_price ? parseFloat(min_price) : null,
            max_price: max_price ? parseFloat(max_price) : null
          }
        });
      });
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving rooms'
    });
  }
};

// Get room by ID
const getRoomById = (req, res) => {
  try {
    const roomId = req.params.id;

    const roomQuery = `
      SELECT 
        id, name, description, price_per_night, capacity, 
        room_type, amenities, image_url, is_available, created_at, updated_at
      FROM rooms 
      WHERE id = ?
    `;

    db.get(roomQuery, [roomId], (err, room) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving room'
        });
      }

      if (!room) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'Room with the specified ID does not exist'
        });
      }

      // Parse amenities JSON
      const roomWithParsedAmenities = {
        ...room,
        amenities: room.amenities ? JSON.parse(room.amenities) : []
      };

      res.json({
        room: roomWithParsedAmenities
      });
    });
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving room'
    });
  }
};

// Get room availability for specific dates
const getRoomAvailability = (req, res) => {
  try {
    const roomId = req.params.id;
    const { check_in, check_out } = req.query;

    if (!check_in || !check_out) {
      return res.status(400).json({
        error: 'Missing dates',
        message: 'Check-in and check-out dates are required'
      });
    }

    // Check if room exists
    const roomQuery = 'SELECT id, name FROM rooms WHERE id = ?';

    db.get(roomQuery, [roomId], (err, room) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking room existence'
        });
      }

      if (!room) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'Room with the specified ID does not exist'
        });
      }

      // Check for conflicting bookings
      const availabilityQuery = `
        SELECT COUNT(*) as conflicting_bookings
        FROM bookings 
        WHERE room_id = ? 
        AND status != 'cancelled'
        AND (
          (check_in_date <= ? AND check_out_date > ?) OR
          (check_in_date < ? AND check_out_date >= ?) OR
          (check_in_date >= ? AND check_out_date <= ?)
        )
      `;

      db.get(availabilityQuery, [roomId, check_out, check_in, check_out, check_in, check_in, check_out], (err, result) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error checking room availability'
          });
        }

        const isAvailable = result.conflicting_bookings === 0;

        res.json({
          room_id: parseInt(roomId),
          room_name: room.name,
          check_in_date: check_in,
          check_out_date: check_out,
          is_available: isAvailable,
          conflicting_bookings: result.conflicting_bookings
        });
      });
    });
  } catch (error) {
    console.error('Get room availability error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error checking room availability'
    });
  }
};

// Get room types
const getRoomTypes = (req, res) => {
  try {
    const typesQuery = `
      SELECT DISTINCT room_type, COUNT(*) as count
      FROM rooms 
      GROUP BY room_type
      ORDER BY room_type
    `;

    db.all(typesQuery, [], (err, types) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving room types'
        });
      }

      res.json({
        room_types: types
      });
    });
  } catch (error) {
    console.error('Get room types error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving room types'
    });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  getRoomAvailability,
  getRoomTypes
};
