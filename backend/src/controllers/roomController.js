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

    // Get all rooms from in-memory database
    db.all('SELECT * FROM rooms', [], (err, rooms) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving rooms'
        });
      }

      // Apply filters in memory
      let filteredRooms = rooms.filter(room => {
        // Filter by guests
        if (guests && room.capacity < parseInt(guests)) {
          return false;
        }

        // Filter by room type
        if (room_type && room.room_type !== room_type) {
          return false;
        }

        // Filter by price range
        if (min_price && room.price_per_night < parseFloat(min_price)) {
          return false;
        }

        if (max_price && room.price_per_night > parseFloat(max_price)) {
          return false;
        }

        return true;
      });

      // Apply availability filter if dates are provided
      if (check_in && check_out) {
        // For now, we'll assume all rooms are available
        // In a real implementation, you'd check against existing bookings
        filteredRooms = filteredRooms.filter(room => room.is_available);
      }

      // Apply pagination
      const totalRooms = filteredRooms.length;
      const totalPages = Math.ceil(totalRooms / limit);
      const offset = (page - 1) * limit;
      const paginatedRooms = filteredRooms.slice(offset, offset + parseInt(limit));

      // Parse amenities for each room
      const roomsWithParsedAmenities = paginatedRooms.map(room => ({
        ...room,
        amenities: room.amenities ? room.amenities.split(', ') : []
      }));

      res.json({
        rooms: roomsWithParsedAmenities,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_rooms: totalRooms,
          limit: parseInt(limit)
        }
      });
    });
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving rooms'
    });
  }
};

// Get room by ID
const getRoomById = (req, res) => {
  try {
    const { id } = req.params;

    db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, room) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving room'
        });
      }

      if (!room) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'The requested room does not exist'
        });
      }

      // Parse amenities
      const roomWithParsedAmenities = {
        ...room,
        amenities: room.amenities ? room.amenities.split(', ') : []
      };

      res.json(roomWithParsedAmenities);
    });
  } catch (error) {
    console.error('Error getting room by ID:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving room'
    });
  }
};

// Get room types
const getRoomTypes = (req, res) => {
  try {
    db.all('SELECT DISTINCT room_type FROM rooms', [], (err, types) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving room types'
        });
      }

      const roomTypes = types.map(type => type.room_type);
      res.json(roomTypes);
    });
  } catch (error) {
    console.error('Error getting room types:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving room types'
    });
  }
};

// Get room amenities
const getRoomAmenities = (req, res) => {
  try {
    db.all('SELECT amenities FROM rooms', [], (err, rooms) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving amenities'
        });
      }

      // Extract all unique amenities
      const allAmenities = new Set();
      rooms.forEach(room => {
        if (room.amenities) {
          const amenities = room.amenities.split(', ');
          amenities.forEach(amenity => allAmenities.add(amenity.trim()));
        }
      });

      res.json(Array.from(allAmenities));
    });
  } catch (error) {
    console.error('Error getting amenities:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving amenities'
    });
  }
};

// Create new room (admin only)
const createRoom = (req, res) => {
  try {
    const {
      name,
      description,
      price_per_night,
      capacity,
      room_type,
      amenities,
      image_url
    } = req.body;

    // Validate required fields
    if (!name || !price_per_night || !capacity || !room_type) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, price, capacity, and room type are required'
      });
    }

    const insertQuery = `
      INSERT INTO rooms (name, description, price_per_night, capacity, room_type, amenities, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const amenitiesString = Array.isArray(amenities) ? amenities.join(', ') : amenities;

    db.run(insertQuery, [
      name,
      description,
      parseFloat(price_per_night),
      parseInt(capacity),
      room_type,
      amenitiesString,
      image_url
    ], function(err) {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error creating room'
        });
      }

      // Get the created room
      db.get('SELECT * FROM rooms WHERE id = ?', [this.lastID], (err, room) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error retrieving created room'
          });
        }

        const roomWithParsedAmenities = {
          ...room,
          amenities: room.amenities ? room.amenities.split(', ') : []
        };

        res.status(201).json({
          message: 'Room created successfully',
          room: roomWithParsedAmenities
        });
      });
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error creating room'
    });
  }
};

// Update room (admin only)
const updateRoom = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price_per_night,
      capacity,
      room_type,
      amenities,
      image_url,
      is_available
    } = req.body;

    // Check if room exists
    db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, existingRoom) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking room existence'
        });
      }

      if (!existingRoom) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'The requested room does not exist'
        });
      }

      // Build update query
      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }

      if (price_per_night !== undefined) {
        updateFields.push('price_per_night = ?');
        updateValues.push(parseFloat(price_per_night));
      }

      if (capacity !== undefined) {
        updateFields.push('capacity = ?');
        updateValues.push(parseInt(capacity));
      }

      if (room_type !== undefined) {
        updateFields.push('room_type = ?');
        updateValues.push(room_type);
      }

      if (amenities !== undefined) {
        updateFields.push('amenities = ?');
        updateValues.push(Array.isArray(amenities) ? amenities.join(', ') : amenities);
      }

      if (image_url !== undefined) {
        updateFields.push('image_url = ?');
        updateValues.push(image_url);
      }

      if (is_available !== undefined) {
        updateFields.push('is_available = ?');
        updateValues.push(is_available);
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      const updateQuery = `UPDATE rooms SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(updateQuery, updateValues, function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error updating room'
          });
        }

        // Get the updated room
        db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, room) => {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error retrieving updated room'
            });
          }

          const roomWithParsedAmenities = {
            ...room,
            amenities: room.amenities ? room.amenities.split(', ') : []
          };

          res.json({
            message: 'Room updated successfully',
            room: roomWithParsedAmenities
          });
        });
      });
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error updating room'
    });
  }
};

// Delete room (admin only)
const deleteRoom = (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, room) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking room existence'
        });
      }

      if (!room) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'The requested room does not exist'
        });
      }

      // Delete the room
      db.run('DELETE FROM rooms WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error deleting room'
          });
        }

        res.json({
          message: 'Room deleted successfully'
        });
      });
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error deleting room'
    });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  getRoomTypes,
  getRoomAmenities,
  createRoom,
  updateRoom,
  deleteRoom
};
