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

// Room types endpoint
app.get('/', (req, res) => {
  try {
    const roomTypes = [...new Set(rooms.map(room => room.room_type))];
    res.json(roomTypes);
  } catch (error) {
    console.error('Error getting room types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the Express app
module.exports = app;
