// In-memory database for Vercel serverless environment
class InMemoryDatabase {
  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.bookings = new Map();
    this.refreshTokens = new Map();
    this.userIdCounter = 1;
    this.roomIdCounter = 1;
    this.bookingIdCounter = 1;
    this.tokenIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Add sample rooms
    const sampleRooms = [
      {
        id: this.roomIdCounter++,
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
        id: this.roomIdCounter++,
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
        id: this.roomIdCounter++,
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

    sampleRooms.forEach(room => {
      this.rooms.set(room.id, room);
    });
  }

  // User methods
  createUser(userData) {
    const user = {
      id: this.userIdCounter++,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  getUserById(id) {
    return this.users.get(parseInt(id));
  }

  updateUser(id, updates) {
    const user = this.users.get(parseInt(id));
    if (user) {
      Object.assign(user, updates, { updated_at: new Date().toISOString() });
      this.users.set(parseInt(id), user);
    }
    return user;
  }

  // Room methods
  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getRoomById(id) {
    return this.rooms.get(parseInt(id));
  }

  createRoom(roomData) {
    const room = {
      id: this.roomIdCounter++,
      ...roomData,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.rooms.set(room.id, room);
    return room;
  }

  updateRoom(id, updates) {
    const room = this.rooms.get(parseInt(id));
    if (room) {
      Object.assign(room, updates, { updated_at: new Date().toISOString() });
      this.rooms.set(parseInt(id), room);
    }
    return room;
  }

  deleteRoom(id) {
    const roomId = parseInt(id);
    if (this.rooms.has(roomId)) {
      this.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  updateRoomAvailability(id, isAvailable) {
    const room = this.rooms.get(parseInt(id));
    if (room) {
      room.is_available = isAvailable;
      room.updated_at = new Date().toISOString();
      this.rooms.set(parseInt(id), room);
    }
    return room;
  }

  // Booking methods
  createBooking(bookingData) {
    const booking = {
      id: this.bookingIdCounter++,
      booking_id: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...bookingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBookingsByUserId(userId) {
    return Array.from(this.bookings.values()).filter(booking => booking.user_id === parseInt(userId));
  }

  getBookingById(id) {
    return this.bookings.get(parseInt(id));
  }

  updateBooking(id, updates) {
    const booking = this.bookings.get(parseInt(id));
    if (booking) {
      Object.assign(booking, updates, { updated_at: new Date().toISOString() });
      this.bookings.set(parseInt(id), booking);
    }
    return booking;
  }

  // Refresh token methods
  storeRefreshToken(userId, token, expiresAt) {
    const tokenRecord = {
      id: this.tokenIdCounter++,
      user_id: parseInt(userId),
      token,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    };
    this.refreshTokens.set(tokenRecord.id, tokenRecord);
    return tokenRecord;
  }

  getRefreshToken(token) {
    for (const tokenRecord of this.refreshTokens.values()) {
      if (tokenRecord.token === token) {
        return tokenRecord;
      }
    }
    return null;
  }

  removeRefreshToken(token) {
    for (const [id, tokenRecord] of this.refreshTokens.entries()) {
      if (tokenRecord.token === token) {
        this.refreshTokens.delete(id);
        return true;
      }
    }
    return false;
  }

  removeExpiredTokens() {
    const now = new Date();
    for (const [id, tokenRecord] of this.refreshTokens.entries()) {
      if (new Date(tokenRecord.expires_at) < now) {
        this.refreshTokens.delete(id);
      }
    }
  }
}

// Create singleton instance
const db = new InMemoryDatabase();

// Simulate database methods for compatibility
const dbWrapper = {
  get: (query, params, callback) => {
    try {
      console.log('Database GET query:', query, 'params:', params);
      
      // Handle different query types
      if (query.includes('SELECT') && query.includes('users') && query.includes('email')) {
        const email = params[0];
        const user = db.getUserByEmail(email);
        console.log('Found user:', user);
        callback(null, user);
      } else if (query.includes('SELECT') && query.includes('users') && query.includes('id')) {
        const id = params[0];
        const user = db.getUserById(id);
        console.log('Found user by ID:', user);
        callback(null, user);
      } else if (query.includes('SELECT') && query.includes('refresh_tokens')) {
        const token = params[0];
        const tokenRecord = db.getRefreshToken(token);
        console.log('Found token record:', tokenRecord);
        callback(null, tokenRecord);
      } else if (query.includes('SELECT') && query.includes('rooms') && query.includes('id')) {
        const id = params[0];
        const room = db.getRoomById(id);
        console.log('Found room by ID:', room);
        callback(null, room);
      } else if (query.includes('SELECT') && query.includes('COUNT(*)')) {
        // Handle count queries
        if (query.includes('rooms')) {
          const rooms = db.getAllRooms();
          const result = { total: rooms.length };
          console.log('Room count result:', result);
          callback(null, result);
        } else {
          console.log('Unknown count query, returning 0');
          callback(null, { total: 0 });
        }
      } else {
        // Default case - return null for unknown queries
        console.log('Unknown GET query, returning null');
        callback(null, null);
      }
    } catch (error) {
      console.error('Database get error:', error);
      callback(error, null);
    }
  },

  run: (query, params, callback) => {
    try {
      console.log('Database RUN query:', query, 'params:', params);
      
      // Handle different query types
      if (query.includes('INSERT INTO users')) {
        const [email, password, first_name, last_name, phone] = params;
        const user = db.createUser({ email, password, first_name, last_name, phone });
        console.log('Created user:', user);
        callback(null, { lastID: user.id });
      } else if (query.includes('INSERT INTO refresh_tokens')) {
        const [userId, token, expiresAt] = params;
        const tokenRecord = db.storeRefreshToken(userId, token, expiresAt);
        console.log('Stored token record:', tokenRecord);
        callback(null, { lastID: tokenRecord.id });
      } else if (query.includes('DELETE FROM refresh_tokens')) {
        const token = params[0];
        const success = db.removeRefreshToken(token);
        console.log('Removed token:', success);
        callback(null, { changes: success ? 1 : 0 });
      } else if (query.includes('INSERT INTO rooms')) {
        // Handle room creation
        const [name, description, price_per_night, capacity, room_type, amenities, image_url] = params;
        const room = db.createRoom({ name, description, price_per_night, capacity, room_type, amenities, image_url });
        console.log('Created room:', room);
        callback(null, { lastID: room.id });
      } else if (query.includes('UPDATE rooms')) {
        // Handle room updates
        const id = params[params.length - 1]; // Last parameter is usually the ID
        const room = db.updateRoom(id, {});
        console.log('Updated room:', room);
        callback(null, { changes: room ? 1 : 0 });
      } else if (query.includes('DELETE FROM rooms')) {
        // Handle room deletion
        const id = params[0];
        const success = db.deleteRoom(id);
        console.log('Deleted room:', success);
        callback(null, { changes: success ? 1 : 0 });
      } else if (query.includes('INSERT INTO bookings')) {
        // Handle booking creation
        const [booking_id, user_id, room_id, check_in_date, check_out_date, guest_count, total_price, status, special_requests] = params;
        const booking = db.createBooking({ booking_id, user_id, room_id, check_in_date, check_out_date, guest_count, total_price, status, special_requests });
        console.log('Created booking:', booking);
        callback(null, { lastID: booking.id });
      } else {
        // Default case for other queries
        console.log('Unknown RUN query, returning changes: 0');
        callback(null, { changes: 0 });
      }
    } catch (error) {
      console.error('Database run error:', error);
      callback(error, null);
    }
  },

  all: (query, params, callback) => {
    try {
      console.log('Database ALL query:', query, 'params:', params);
      
      if (query.includes('SELECT') && query.includes('rooms')) {
        const rooms = db.getAllRooms();
        console.log('Found rooms:', rooms.length);
        callback(null, rooms);
      } else if (query.includes('SELECT') && query.includes('bookings') && query.includes('user_id')) {
        const userId = params[0];
        const bookings = db.getBookingsByUserId(userId);
        console.log('Found bookings for user:', bookings.length);
        callback(null, bookings);
      } else if (query.includes('SELECT DISTINCT room_type FROM rooms')) {
        const rooms = db.getAllRooms();
        const roomTypes = [...new Set(rooms.map(room => room.room_type))];
        const result = roomTypes.map(type => ({ room_type: type }));
        console.log('Found room types:', result);
        callback(null, result);
      } else if (query.includes('SELECT amenities FROM rooms')) {
        const rooms = db.getAllRooms();
        const result = rooms.map(room => ({ amenities: room.amenities }));
        console.log('Found amenities:', result);
        callback(null, result);
      } else if (query.includes('SELECT') && query.includes('bookings')) {
        // Handle other booking queries
        const bookings = Array.from(db.bookings.values());
        console.log('Found all bookings:', bookings.length);
        callback(null, bookings);
      } else {
        // Default case - return empty array for unknown queries
        console.log('Unknown ALL query, returning empty array');
        callback(null, []);
      }
    } catch (error) {
      console.error('Database all error:', error);
      callback(error, null);
    }
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    console.log('✅ In-memory database initialized successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return Promise.reject(error);
  }
};

// Close database connection (no-op for in-memory)
const closeDatabase = () => {
  return Promise.resolve();
};

module.exports = {
  db: dbWrapper,
  initializeDatabase,
  closeDatabase
};
