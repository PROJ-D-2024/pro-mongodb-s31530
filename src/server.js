import dotenv from 'dotenv';
import app from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 3000;

async function start() {
  try {
    await connectDb(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`BookHub API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();