const { getBookings, addBooking } = require('../shared-data');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    if (req.method === 'GET') {
      // Get bookings with pagination
      const { page = 1, limit = 10 } = req.query;
      const bookings = getBookings();
      
      const totalBookings = bookings.length;
      const totalPages = Math.ceil(totalBookings / limit);
      const offset = (page - 1) * limit;
      const paginatedBookings = bookings.slice(offset, offset + parseInt(limit));
      
      res.json({
        bookings: paginatedBookings,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_bookings: totalBookings,
          limit: parseInt(limit)
        }
      });
    } else if (req.method === 'POST') {
      // Create new booking
      const { 
        room_id, 
        check_in_date, 
        check_out_date, 
        guest_count, 
        total_price, 
        additional_services, 
        special_requests, 
        contact_info, 
        marketing_emails 
      } = req.body;
      
      // Simple validation
      if (!room_id || !check_in_date || !check_out_date || !guest_count || !total_price) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Room ID, check-in date, check-out date, guest count, and total price are required'
        });
      }
      
      const bookings = getBookings();
      
      const newBooking = {
        id: bookings.length + 1,
        booking_id: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        room_id: parseInt(room_id),
        check_in_date,
        check_out_date,
        guest_count: parseInt(guest_count),
        total_price: parseFloat(total_price),
        additional_services: additional_services || [],
        special_requests: special_requests || '',
        contact_info: contact_info || {},
        marketing_emails: marketing_emails || false,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add booking to shared data store
      addBooking(newBooking);
      
      res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error with bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
