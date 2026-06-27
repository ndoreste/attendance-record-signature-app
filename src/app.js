import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import recordRoutes from './routes/record.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp({ store, databaseLabel = 'mongodb' } = {}) {
  const app = express();
  app.locals.store = store;
  app.locals.databaseLabel = databaseLabel;

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', project: 'Attendance Record Signature App', database: databaseLabel });
  });

  app.use('/api/records', recordRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
