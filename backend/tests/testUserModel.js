import { createUser, getUserById} from '../models/userModel.js';

async function runTests() {
  try {
      const user = await getUserById(1);

  
    console.log(user.name);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();