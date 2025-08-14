const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

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

// Rooms endpoint
app.get('/', (req, res) => {
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
app.get('/:id', (req, res) => {
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

// Export the Express app
module.exports = app;
