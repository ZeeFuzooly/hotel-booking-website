const { db } = require('./src/config/database');

console.log('Checking database contents...');

// Check rooms
db.all('SELECT COUNT(*) as count FROM rooms', [], (err, result) => {
  if (err) {
    console.error('Error checking rooms:', err);
  } else {
    console.log('Total rooms:', result[0].count);
  }
});

// Check room types
db.all('SELECT DISTINCT room_type FROM rooms', [], (err, result) => {
  if (err) {
    console.error('Error checking room types:', err);
  } else {
    console.log('Room types:', result.map(r => r.room_type));
  }
});

// Check first few rooms
db.all('SELECT id, name, room_type, capacity FROM rooms LIMIT 5', [], (err, result) => {
  if (err) {
    console.error('Error checking room details:', err);
  } else {
    console.log('Sample rooms:', result);
  }
  
  // Close database
  db.close();
});
