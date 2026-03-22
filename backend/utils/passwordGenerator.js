import crypto from 'crypto';

// Generate a secure random password
export const generateSecurePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[crypto.randomInt(26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[crypto.randomInt(26)]; // Lowercase
  password += '0123456789'[crypto.randomInt(10)]; // Number
  password += '!@#$%^&*'[crypto.randomInt(8)]; // Special char
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[crypto.randomInt(charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
};
