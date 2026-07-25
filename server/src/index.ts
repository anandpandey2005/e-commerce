import env from 'dotenv';
env.config();
import app from './app.js';

const PORT: string = process.env.PORT || '';

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
