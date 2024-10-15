import { jwtDecode } from 'jwt-decode';

/**
 * Checks if the JWT token is expired.
 * @param {string} token - The JWT token.
 * @returns {boolean} - True if expired or invalid, else false.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return true;
  }
};
