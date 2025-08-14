const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory data store
const rooms = [
  {
    id: 1,
    name: "Luxury Suite",
    description: "Spacious luxury suite with ocean view",
    price_per_night: 299.99,
    capacity: 4,
    room_type: "suite",
    amenities: "WiFi, TV, Mini Bar, Ocean View",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Comfortable deluxe room with city view",
    price_per_night: 199.99,
    capacity: 2,
    room_type: "deluxe",
    amenities: "WiFi, TV, City View",
    image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Standard Room",
    description: "Cozy standard room for budget travelers",
    price_per_night: 99.99,
    capacity: 2,
    room_type: "standard",
    amenities: "WiFi, TV",
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const users = [];
const bookings = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Room types endpoint
app.get('/api/rooms/types', (req, res) => {
  try {
    const roomTypes = [...new Set(rooms.map(room => room.room_type))];
    res.json(roomTypes);
  } catch (error) {
    console.error('Error getting room types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rooms endpoint
app.get('/api/rooms', (req, res) => {
  try {
    const { page = 1, limit = 10, guests, room_type, min_price, max_price } = req.query;
    
    let filteredRooms = [...rooms];
    
    // Apply filters
    if (guests) {
      filteredRooms = filteredRooms.filter(room => room.capacity >= parseInt(guests));
    }
    
    if (room_type) {
      filteredRooms = filteredRooms.filter(room => room.room_type === room_type);
    }
    
    if (min_price) {
      filteredRooms = filteredRooms.filter(room => room.price_per_night >= parseFloat(min_price));
    }
    
    if (max_price) {
      filteredRooms = filteredRooms.filter(room => room.price_per_night <= parseFloat(max_price));
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
  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Room by ID endpoint
app.get('/api/rooms/:id', (req, res) => {
  try {
    const { id } = req.params;
    const room = rooms.find(r => r.id === parseInt(id));
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const roomWithParsedAmenities = {
      ...room,
      amenities: room.amenities ? room.amenities.split(', ') : []
    };
    
    res.json(roomWithParsedAmenities);
  } catch (error) {
    console.error('Error getting room by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, this should be hashed
      first_name,
      last_name,
      phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate simple tokens (in production, use JWT)
    const accessToken = `token_${Date.now()}_${Math.random()}`;
    const refreshToken = `refresh_${Date.now()}_${Math.random()}`;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    // Generate tokens
    const accessToken = `token_${Date.now()}_${Math.random()}`;
    const refreshToken = `refresh_${Date.now()}_${Math.random()}`;
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings endpoint
app.get('/api/bookings', (req, res) => {
  try {
    // For now, return empty array
    res.json([]);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking endpoint
app.post('/api/bookings', (req, res) => {
  try {
    const { room_id, check_in_date, check_out_date, guest_count, special_requests } = req.body;
    
    const room = rooms.find(r => r.id === parseInt(room_id));
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const newBooking = {
      id: bookings.length + 1,
      booking_id: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      room_id: parseInt(room_id),
      check_in_date,
      check_out_date,
      guest_count,
      total_price: room.price_per_night,
      status: 'confirmed',
      special_requests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

module.exports = app;
