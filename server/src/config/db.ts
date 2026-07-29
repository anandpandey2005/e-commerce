import 'dotenv/config';
import mongoose, { Connection } from 'mongoose';

const dbUri = `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`;

export const user_db: Connection = mongoose.createConnection(dbUri, {
  minPoolSize: parseInt(process.env.DATABASE_MIN_USER_POOL_SIZE || '5', 10),
  maxPoolSize: parseInt(process.env.DATABASE_MAX_USER_POOL_SIZE || '100', 10),
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
});

export const admin_db: Connection = mongoose.createConnection(dbUri, {
  minPoolSize: parseInt(process.env.DATABASE_MIN_ADMIN_POOL_SIZE || '2', 10),
  maxPoolSize: parseInt(process.env.DATABASE_MAX_ADMIN_POOL_SIZE || '25', 10),
  maxIdleTimeMS: 60000,
  serverSelectionTimeoutMS: 5000,
});

export async function database_config(): Promise<void> {
  try {
    await Promise.all([user_db.asPromise(), admin_db.asPromise()]);

    if (user_db.readyState === 1 && admin_db.readyState === 1) {
      console.log('Customer DB & Admin DB pools connected successfully.');
    } else {
      throw new Error('One or more database connection pools failed.');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Database connection error: ${error.message}`);
    } else {
      console.log(
        'An unexpected system error occurred during database connection.'
      );
    }
    process.exit(1);
  }
}
