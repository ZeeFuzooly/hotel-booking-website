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
    // Simple in-memory data store
    const rooms = [
      {
        id: 1,
        name: "Luxury Suite",
        room_type: "suite"
      },
      {
        id: 2,
        name: "Deluxe Room",
        room_type: "deluxe"
      },
      {
        id: 3,
        name: "Standard Room",
        room_type: "standard"
      }
    ];
    
    const roomTypes = [...new Set(rooms.map(room => room.room_type))];
    res.json(roomTypes);
  } catch (error) {
    console.error('Error getting room types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
