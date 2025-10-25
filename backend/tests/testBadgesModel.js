import { 
  createBadge, 
  getBadgeById, 
  getBadgesByUser, 
  getAllBadges, 
  hasUserBadge, 
  countUserBadges 
} from '../models/badgesModel.js';

async function runTests() {
    try {
    // Cambia el userId por uno que exista en tu tabla users
        const userId = 5;  
        const badgeId = await createBadge(
            userId,
            'Completó su primera misión',
            'Badge de prueba',
            null // icon_url
        );

    console.log('Badge creada con ID:', badgeId);

  } catch (err) {
    console.error('Error al crear badge:', err.message);
  }
}

runTests();
