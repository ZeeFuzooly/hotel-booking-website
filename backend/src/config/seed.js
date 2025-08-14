const bcrypt = require('bcryptjs');
const { db } = require('./database');

const seedDatabase = async () => {
  try {
    // Hash password for test user
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Sample rooms data
    const rooms = [
      {
        name: 'Deluxe King Room',
        description: 'Spacious room with a king-size bed, city view, and premium amenities',
        price_per_night: 299.99,
        capacity: 2,
        room_type: 'deluxe',
        amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Room Service', 'City View']),
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
      },
      {
        name: 'Executive Suite',
        description: 'Luxury suite with separate living area, premium furnishings, and panoramic views',
        price_per_night: 499.99,
        capacity: 4,
        room_type: 'suite',
        amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Room Service', 'Panoramic View', 'Living Room', 'Jacuzzi']),
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
      },
      {
        name: 'Standard Double Room',
        description: 'Comfortable room with two double beds, perfect for families or small groups',
        price_per_night: 199.99,
        capacity: 4,
        room_type: 'standard',
        amenities: JSON.stringify(['WiFi', 'TV', 'Coffee Maker', 'Work Desk']),
        image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
      },
      {
        name: 'Premium Queen Room',
        description: 'Elegant room with queen bed, modern amenities, and garden view',
        price_per_night: 249.99,
        capacity: 2,
        room_type: 'premium',
        amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Garden View', 'Balcony']),
        image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
      },
      {
        name: 'Family Suite',
        description: 'Large suite with multiple bedrooms, perfect for families',
        price_per_night: 399.99,
        capacity: 6,
        room_type: 'suite',
        amenities: JSON.stringify(['WiFi', 'TV', 'Mini Bar', 'Room Service', 'Multiple Bedrooms', 'Kitchenette']),
        image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
      },
      {
        name: 'Business Room',
        description: 'Professional room with work space, high-speed internet, and business amenities',
        price_per_night: 229.99,
        capacity: 2,
        room_type: 'business',
        amenities: JSON.stringify(['WiFi', 'TV', 'Work Desk', 'Business Center Access', 'Coffee Maker']),
        image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
      }
    ];

    // Insert test user
    const insertUser = `
      INSERT INTO users (email, password, first_name, last_name, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      db.run(insertUser, [
        'test@example.com',
        hashedPassword,
        'John',
        'Doe',
        '+1234567890'
      ], function(err) {
        if (err) {
          console.error('Error inserting test user:', err.message);
          reject(err);
        } else {
          console.log('Test user created successfully');
          resolve();
        }
      });
    });

    // Insert rooms
    const insertRoom = `
      INSERT INTO rooms (name, description, price_per_night, capacity, room_type, amenities, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      await new Promise((resolve, reject) => {
        db.run(insertRoom, [
          room.name,
          room.description,
          room.price_per_night,
          room.capacity,
          room.room_type,
          room.amenities,
          room.image_url
        ], function(err) {
          if (err) {
            console.error(`Error inserting room ${i + 1}:`, err.message);
            reject(err);
          } else {
            console.log(`Room "${room.name}" created successfully`);
            resolve();
          }
        });
      });
    }

    // Create some sample bookings for the test user
    setTimeout(() => {
      const insertBooking = `
        INSERT OR IGNORE INTO bookings (booking_id, user_id, room_id, check_in_date, check_out_date, guest_count, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Past booking
      const pastCheckIn = new Date();
      pastCheckIn.setDate(pastCheckIn.getDate() - 30);
      const pastCheckOut = new Date(pastCheckIn);
      pastCheckOut.setDate(pastCheckOut.getDate() + 3);

      // Upcoming booking
      const futureCheckIn = new Date();
      futureCheckIn.setDate(futureCheckIn.getDate() + 14);
      const futureCheckOut = new Date(futureCheckIn);
      futureCheckOut.setDate(futureCheckOut.getDate() + 2);

      // Insert past booking
      db.run(insertBooking, [
        'BK' + Date.now() + '1',
        1, // user_id
        1, // room_id
        pastCheckIn.toISOString().split('T')[0],
        pastCheckOut.toISOString().split('T')[0],
        2,
        899.97,
        'completed'
      ], function(err) {
        if (err) {
          console.error('Error inserting past booking:', err.message);
        } else {
          console.log('Past booking created successfully');
        }
      });

      // Insert upcoming booking
      db.run(insertBooking, [
        'BK' + Date.now() + '2',
        1, // user_id
        2, // room_id
        futureCheckIn.toISOString().split('T')[0],
        futureCheckOut.toISOString().split('T')[0],
        2,
        999.98,
        'confirmed'
      ], function(err) {
        if (err) {
          console.error('Error inserting upcoming booking:', err.message);
        } else {
          console.log('Upcoming booking created successfully');
        }
      });
    }, 1000);

    console.log('✅ Database seeded successfully');
    console.log('📧 Test user email: test@example.com');
    console.log('🔑 Test user password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
