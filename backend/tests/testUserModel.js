import {createUser, getUserById, getUserByEmail, getAllUsers, updateUser, updateXP, updateLevel, changePassword, deleteUser} from '../models/userModel.js';

async function runTests() {
  try {
    await deleteUser(3);
     
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();