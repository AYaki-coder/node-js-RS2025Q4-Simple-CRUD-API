import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: +(process.env.PORT ?? 5000),
  workerPort: +(process.env.WORKER_PORT ?? 5000),
  multi: !!process.env.multi,
  database: !!process.env.DATABASE,
};
