import {createUser, getUserById, getUserByEmail, getAllUsers, updateUser, updateXP, updateLevel, changePassword, deleteUser} from '../models/userModel.js';

async function runTests() {
  try {
    const updates = {
      name: "Santa",
      email: "santaclaus@gmail.com",
    }
    updateUser(5, updates);
     
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();