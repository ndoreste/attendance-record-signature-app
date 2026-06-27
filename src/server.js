import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { createMongoStore } from './repositories/mongoStore.js';
import { createMemoryStore } from './repositories/memoryStore.js';

const PORT = process.env.PORT || 3000;
const useMemoryStore = process.env.USE_MEMORY_STORE === 'true' || !process.env.MONGODB_URI;

try {
  if (useMemoryStore) {
    const app = createApp({ store: createMemoryStore(), databaseLabel: 'memory-test-mode' });
    app.listen(PORT, () => console.log(`App lista en http://localhost:${PORT} con almacenamiento en memoria`));
  } else {
    await connectDatabase(process.env.MONGODB_URI);
    const app = createApp({ store: createMongoStore(), databaseLabel: 'mongodb' });
    app.listen(PORT, () => console.log(`App lista en http://localhost:${PORT} conectada a MongoDB`));
  }
} catch (error) {
  console.error('No se pudo arrancar la aplicación:', error.message);
  process.exit(1);
}
