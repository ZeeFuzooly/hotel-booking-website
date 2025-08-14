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
const users = [];

// User registration endpoint
app.post('/', (req, res) => {
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

// Export the Express app
module.exports = app;
