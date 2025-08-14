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
  
  // Only handle GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { id } = req.query; // Vercel dynamic routes use query.id
    
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
};
