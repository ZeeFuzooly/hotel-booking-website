const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// Create a new booking
const createBooking = (req, res) => {
  try {
    const userId = req.user.id;
    const { room_id, check_in_date, check_out_date, guest_count, special_requests } = req.body;

    // Generate unique booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // First, check if room exists and get its price
    const roomQuery = 'SELECT id, name, price_per_night, capacity FROM rooms WHERE id = ?';

    db.get(roomQuery, [room_id], (err, room) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking room availability'
        });
      }

      if (!room) {
        return res.status(404).json({
          error: 'Room not found',
          message: 'Room with the specified ID does not exist'
        });
      }

      // Check if room capacity is sufficient
      if (guest_count > room.capacity) {
        return res.status(400).json({
          error: 'Insufficient room capacity',
          message: `This room can accommodate maximum ${room.capacity} guests`
        });
      }

      // Check for conflicting bookings
      const conflictQuery = `
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

      db.get(conflictQuery, [room_id, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date], (err, conflictResult) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error checking booking conflicts'
          });
        }

        if (conflictResult.conflicting_bookings > 0) {
          return res.status(409).json({
            error: 'Room not available',
            message: 'Room is not available for the selected dates'
          });
        }

        // Calculate total price
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = room.price_per_night * nights;

        // Create booking
        const insertBookingQuery = `
          INSERT INTO bookings (
            booking_id, user_id, room_id, check_in_date, check_out_date, 
            guest_count, total_price, special_requests
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertBookingQuery, [
          bookingId,
          userId,
          room_id,
          check_in_date,
          check_out_date,
          guest_count,
          totalPrice,
          special_requests || null
        ], function(err) {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error creating booking'
            });
          }

          const bookingDbId = this.lastID;

          // Get the complete booking details
          const getBookingQuery = `
            SELECT 
              b.id, b.booking_id, b.user_id, b.room_id, b.check_in_date, 
              b.check_out_date, b.guest_count, b.total_price, b.status, 
              b.special_requests, b.created_at,
              r.name as room_name, r.room_type,
              u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ?
          `;

          db.get(getBookingQuery, [bookingDbId], (err, booking) => {
            if (err) {
              return res.status(500).json({
                error: 'Database error',
                message: 'Error retrieving booking details'
              });
            }

            res.status(201).json({
              message: 'Booking created successfully',
              booking: {
                id: booking.id,
                booking_id: booking.booking_id,
                room: {
                  id: booking.room_id,
                  name: booking.room_name,
                  type: booking.room_type
                },
                check_in_date: booking.check_in_date,
                check_out_date: booking.check_out_date,
                guest_count: booking.guest_count,
                total_price: booking.total_price,
                status: booking.status,
                special_requests: booking.special_requests,
                created_at: booking.created_at,
                user: {
                  name: `${booking.first_name} ${booking.last_name}`,
                  email: booking.email
                }
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error creating booking'
    });
  }
};

// Get user's bookings
const getUserBookings = (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build WHERE clause
    const whereConditions = ['b.user_id = ?'];
    const queryParams = [userId];

    if (status) {
      whereConditions.push('b.status = ?');
      queryParams.push(status);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Count total bookings for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM bookings b 
      ${whereClause}
    `;

    db.get(countQuery, queryParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error counting bookings'
        });
      }

      const totalBookings = countResult.total;
      const totalPages = Math.ceil(totalBookings / limit);
      const offset = (page - 1) * limit;

      // Get bookings with pagination
      const bookingsQuery = `
        SELECT 
          b.id, b.booking_id, b.room_id, b.check_in_date, b.check_out_date,
          b.guest_count, b.total_price, b.status, b.special_requests, b.created_at,
          r.name as room_name, r.room_type, r.image_url
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        ${whereClause}
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const finalParams = [...queryParams, parseInt(limit), offset];

      db.all(bookingsQuery, finalParams, (err, bookings) => {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error retrieving bookings'
          });
        }

        // Categorize bookings as past, upcoming, or current
        const now = new Date();
        const categorizedBookings = bookings.map(booking => {
          const checkIn = new Date(booking.check_in_date);
          const checkOut = new Date(booking.check_out_date);
          
          let category = 'upcoming';
          if (checkOut < now) {
            category = 'past';
          } else if (checkIn <= now && checkOut >= now) {
            category = 'current';
          }

          return {
            ...booking,
            category
          };
        });

        res.json({
          bookings: categorizedBookings,
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_bookings: totalBookings,
            bookings_per_page: parseInt(limit),
            has_next: page < totalPages,
            has_prev: page > 1
          },
          filters: {
            status: status || null
          }
        });
      });
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving bookings'
    });
  }
};

// Get booking by ID
const getBookingById = (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const bookingQuery = `
      SELECT 
        b.id, b.booking_id, b.user_id, b.room_id, b.check_in_date, 
        b.check_out_date, b.guest_count, b.total_price, b.status, 
        b.special_requests, b.created_at, b.updated_at,
        r.name as room_name, r.room_type, r.description, r.image_url,
        u.first_name, u.last_name, u.email, u.phone
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ? AND b.user_id = ?
    `;

    db.get(bookingQuery, [bookingId, userId], (err, booking) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving booking'
        });
      }

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found',
          message: 'Booking with the specified ID does not exist or does not belong to you'
        });
      }

      res.json({
        booking: {
          id: booking.id,
          booking_id: booking.booking_id,
          room: {
            id: booking.room_id,
            name: booking.room_name,
            type: booking.room_type,
            description: booking.description,
            image_url: booking.image_url
          },
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          guest_count: booking.guest_count,
          total_price: booking.total_price,
          status: booking.status,
          special_requests: booking.special_requests,
          created_at: booking.created_at,
          updated_at: booking.updated_at,
          user: {
            name: `${booking.first_name} ${booking.last_name}`,
            email: booking.email,
            phone: booking.phone
          }
        }
      });
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving booking'
    });
  }
};

// Cancel booking
const cancelBooking = (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    // First, check if booking exists and belongs to user
    const checkBookingQuery = `
      SELECT b.id, b.status, b.check_in_date, r.name as room_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ? AND b.user_id = ?
    `;

    db.get(checkBookingQuery, [bookingId, userId], (err, booking) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking booking'
        });
      }

      if (!booking) {
        return res.status(404).json({
          error: 'Booking not found',
          message: 'Booking with the specified ID does not exist or does not belong to you'
        });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({
          error: 'Booking already cancelled',
          message: 'This booking has already been cancelled'
        });
      }

      // Check if booking is in the past
      const checkInDate = new Date(booking.check_in_date);
      const now = new Date();
      
      if (checkInDate < now) {
        return res.status(400).json({
          error: 'Cannot cancel past booking',
          message: 'Cannot cancel a booking that has already started'
        });
      }

      // Update booking status to cancelled
      const updateQuery = `
        UPDATE bookings 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(updateQuery, [bookingId], function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error cancelling booking'
          });
        }

        res.json({
          message: 'Booking cancelled successfully',
          booking: {
            id: booking.id,
            room_name: booking.room_name,
            status: 'cancelled'
          }
        });
      });
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error cancelling booking'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
