/**
 * Validacija email adrese
 * @param {string} email
 * @returns {string}
 */
const validateEmail = (email) => {
  if (!email) return 'Email je obavezan';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

/**
 * Validacija lozinke
 * @param {string} password
 * @returns {string}
 */
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must have at least 6 characters';
  return '';
};

/**
 * Validacija korisničkog imena
 * @param {string} username
 * @returns {string}
 */
const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters long';
  return '';
};

export { validateEmail, validatePassword, validateUsername };