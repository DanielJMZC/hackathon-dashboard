import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js'
import missionRoutes from './routes/missionRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import badgesRoutes from './routes/badgesRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

//Mount routers
app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/badges', badgesRoutes);

// Root route explicitly sends index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Serve frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

