// Shared data store for all serverless functions
// Using a singleton pattern for better persistence in Vercel

class DataStore {
  constructor() {
    if (!DataStore.instance) {
      this.users = [];
      this.bookings = [];
      this.refreshTokens = [];
      DataStore.instance = this;
    }
    return DataStore.instance;
  }

  // User methods
  getUsers() {
    return this.users;
  }

  addUser(user) {
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserByCredentials(email, password) {
    return this.users.find(u => u.email === email && u.password === password);
  }

  // Booking methods
  getBookings() {
    return this.bookings;
  }

  addBooking(booking) {
    this.bookings.push(booking);
    return booking;
  }

  // Token methods
  getRefreshTokens() {
    return this.refreshTokens;
  }

  addRefreshToken(token) {
    this.refreshTokens.push(token);
    return token;
  }

  removeRefreshToken(token) {
    const index = this.refreshTokens.findIndex(t => t.token === token);
    if (index > -1) {
      this.refreshTokens.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Create singleton instance
const dataStore = new DataStore();

// Export helper functions
const getUsers = () => dataStore.getUsers();
const getBookings = () => dataStore.getBookings();
const getRefreshTokens = () => dataStore.getRefreshTokens();

const addUser = (user) => dataStore.addUser(user);
const addBooking = (booking) => dataStore.addBooking(booking);
const addRefreshToken = (token) => dataStore.addRefreshToken(token);
const removeRefreshToken = (token) => dataStore.removeRefreshToken(token);

const findUserByEmail = (email) => dataStore.findUserByEmail(email);
const findUserByCredentials = (email, password) => dataStore.findUserByCredentials(email, password);

module.exports = {
  getUsers,
  getBookings,
  getRefreshTokens,
  addUser,
  addBooking,
  addRefreshToken,
  removeRefreshToken,
  findUserByEmail,
  findUserByCredentials
};
