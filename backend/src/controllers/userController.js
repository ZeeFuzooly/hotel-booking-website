const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

// Get user profile
const getProfile = (req, res) => {
  try {
    const userId = req.user.id;

    const getUserQuery = `
      SELECT id, email, first_name, last_name, phone, created_at, updated_at
      FROM users WHERE id = ?
    `;

    db.get(getUserQuery, [userId], (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving user profile'
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User profile not found'
        });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error retrieving profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, current_password, new_password } = req.body;

    // Get current user data
    const getUserQuery = 'SELECT * FROM users WHERE id = ?';

    db.get(getUserQuery, [userId], async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving user data'
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User not found'
        });
      }

      // If password change is requested, verify current password
      if (new_password) {
        if (!current_password) {
          return res.status(400).json({
            error: 'Current password required',
            message: 'Current password is required to change password'
          });
        }

        const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({
            error: 'Invalid current password',
            message: 'Current password is incorrect'
          });
        }
      }

      // Prepare update fields
      const updateFields = [];
      const updateValues = [];

      if (first_name) {
        updateFields.push('first_name = ?');
        updateValues.push(first_name);
      }

      if (last_name) {
        updateFields.push('last_name = ?');
        updateValues.push(last_name);
      }

      if (phone) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }

      if (new_password) {
        const hashedNewPassword = await bcrypt.hash(new_password, 12);
        updateFields.push('password = ?');
        updateValues.push(hashedNewPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          error: 'No updates provided',
          message: 'No fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(userId);

      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;

      db.run(updateQuery, updateValues, function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error updating user profile'
          });
        }

        // Get updated user data
        const getUpdatedUserQuery = `
          SELECT id, email, first_name, last_name, phone, created_at, updated_at
          FROM users WHERE id = ?
        `;

        db.get(getUpdatedUserQuery, [userId], (err, updatedUser) => {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error retrieving updated user data'
            });
          }

          res.json({
            message: 'Profile updated successfully',
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              first_name: updatedUser.first_name,
              last_name: updatedUser.last_name,
              phone: updatedUser.phone,
              created_at: updatedUser.created_at,
              updated_at: updatedUser.updated_at
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error updating profile'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password required',
        message: 'Password is required to delete account'
      });
    }

    // Get user data to verify password
    const getUserQuery = 'SELECT * FROM users WHERE id = ?';

    db.get(getUserQuery, [userId], async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error retrieving user data'
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User not found'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'Password is incorrect'
        });
      }

      // Delete user (cascade will handle related data)
      const deleteUserQuery = 'DELETE FROM users WHERE id = ?';

      db.run(deleteUserQuery, [userId], function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error deleting user account'
          });
        }

        res.json({
          message: 'Account deleted successfully'
        });
      });
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error deleting account'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
};
