const usersRepository = require('./users-repository');
const { passwordMatched, hashPassword } = require('../../../utils/password');
const { errorTypes } = require('../../../core/errors');

/**
 * fungsi pengecekan email
 * @param {string} email - Email
 * @returns {boolean}
 */
async function isEmailTaken(email) {
  return usersRepository.isEmailTaken(email);
}

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} password_confirm - password_confirm
 * @returns {boolean}
 */
async function createUser(name, email, password, password_confirm) {
  //cek apakah password dan password confirm sama
  if (password != password_confirm) {
    throw new Error('INVALID_PASSWORD');
  }
  //cek email sudah ada atau belum
  const EmailExists = await isEmailTaken(email);
  if (EmailExists) {
    throw new errorTypes.EMAIL_ALREADY_TAKEN('EMAIL_ALREADY_TAKEN');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Change user password
 * @param {string} id - User ID
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {boolean}
 */
async function changePassword(id, oldPassword, newPassword, confirmPassword) {
  // Validasi apakah newPassword dan confirmPassword sama
  if (newPassword !== confirmPassword) {
    throw new errorTypes.INVALID_PASSWORD_CONFIRMATION(
      'Passwords do not match.'
    );
  }

  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    throw new Error('User not found');
  }

  // Periksa apakah oldPassword cocok dengan password yang ada di database
  const ispasswordMatched = await passwordMatched(oldPassword, user.password);
  if (!ispasswordMatched) {
    throw new Error('Old password is incorrect');
  }

  // Hash newPassword dan update di database
  const hashedNewPassword = await hashPassword(newPassword);
  try {
    await usersRepository.updateUserPassword(id, hashedNewPassword);
    return true;
  } catch (err) {
    throw err;
  }
}
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailTaken,
  changePassword,
};
