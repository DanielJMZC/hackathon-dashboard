import { createUser} from '../models/userModel.js';

async function runTests() {
  try {
    const newUserId = await createUser('TestUser', 'test@example.com', 'password123');
    console.log('Created user ID:', newUserId);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();