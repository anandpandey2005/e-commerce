import 'dotenv/config';
import app from './app.js';
import mongoose from 'mongoose';

const PORT: string = process.env.PORT || '5000';

async function database_config() {
  try {
    const connection = await mongoose.connect(
      `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`
    );

    if (connection.connection.readyState === 1) {
      console.log('Database connected successfully.');
    } else {
      throw new Error('Database connection failed.');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Database connection error: ${error.message}`);
    } else {
      console.log('An unexpected system error occurred during database connection.');
    }
    process.exit(1);
  }
}

database_config().then(() => {
  app.listen(Number(PORT), () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

});
