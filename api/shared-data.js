// Shared data store for all serverless functions
// Note: In production, this should be replaced with a proper database
// This is just for demonstration purposes

// Global variables to persist data across function calls
global.users = global.users || [];
global.bookings = global.bookings || [];
global.refreshTokens = global.refreshTokens || [];

// Helper functions
const getUsers = () => global.users || [];
const getBookings = () => global.bookings || [];
const getRefreshTokens = () => global.refreshTokens || [];

const addUser = (user) => {
  global.users = global.users || [];
  global.users.push(user);
  return user;
};

const addBooking = (booking) => {
  global.bookings = global.bookings || [];
  global.bookings.push(booking);
  return booking;
};

const addRefreshToken = (token) => {
  global.refreshTokens = global.refreshTokens || [];
  global.refreshTokens.push(token);
  return token;
};

const removeRefreshToken = (token) => {
  global.refreshTokens = global.refreshTokens || [];
  const index = global.refreshTokens.findIndex(t => t.token === token);
  if (index > -1) {
    global.refreshTokens.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  getUsers,
  getBookings,
  getRefreshTokens,
  addUser,
  addBooking,
  addRefreshToken,
  removeRefreshToken
};
