import 'dotenv/config';
import app from './app.js';
import { database_config, user_db, admin_db } from './config/db.js';

const PORT: string = process.env.PORT || '5000';

export { user_db, admin_db };

database_config().then(() => {
  app.listen(Number(PORT), () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
