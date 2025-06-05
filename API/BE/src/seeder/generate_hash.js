const bcrypt = require('bcryptjs');

const plaintextPassword = "admin2060"; // Type this EXACTLY as you would type it in the login form

const saltRounds = 10; // Must be same as in your seed script and user.model
const generatedHash = bcrypt.hashSync(plaintextPassword, saltRounds);

console.log(`\n--- Generated Hash for "${plaintextPassword}" ---`);
console.log("Copy this ENTIRE string for your seed script:");
console.log(generatedHash);
console.log("--------------------------------------------------\n");