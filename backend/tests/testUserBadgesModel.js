import { createUser } from '../models/userModel.js';
import * as badgesModel from '../models/badgesModel.js';
import * as badgeService from '../services/badgeService.js';
import * as userBadgeModel from '../models/userBadgeModel.js';


async function runBadgeServiceTest() {
  try {
    console.log('--- Creando usuario ---');
    const userId = await createUser({
      name: "Diego Test",
      email: "diegotest@example.com",
      password: "123456"
    });
    console.log('Usuario creado con ID:', userId);

    console.log('--- Creando badge ---');
    const badgeId = await badgesModel.createBadge(
      'Badge de prueba',
      'Completó su primera misión',
      null // icon_url
    );
    console.log('Badge creada con ID:', badgeId);

    console.log('--- Asignando badge al usuario ---');
    const awardResult = await badgeService.awardBadgeToUser(userId, badgeId);
    console.log('Resultado de asignación:', awardResult);

    console.log('--- Listando badges del usuario ---');
    const userBadges = await badgeService.getUserBadges(userId);
    console.log('Badges del usuario:', userBadges);

    console.log('--- Contando badges del usuario ---');
    const badgeCount = await badgeService.countUserBadges(userId);
    console.log('Cantidad de badges:', badgeCount);

  } catch (err) {
    console.error('Error en test de badge service:', err.message);
  }
}

runBadgeServiceTest();
