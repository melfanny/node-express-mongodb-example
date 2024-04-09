const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * fungsi pengecekan email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function isEmailTaken(email) {
  const user = await User.findOne({ email: email });
  return user !== null && user !== undefined;
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} hashedPassword - New hashed password
 * @returns {Promise}
 */
async function updateUserPassword(id, hashedPassword) {
  return User.updateOne(
    { _id: id },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailTaken,
  updateUserPassword,
};
