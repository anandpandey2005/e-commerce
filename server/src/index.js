import "dotenv/config";
import { app } from "./app.js";
import { databaseConnection } from "./config/databaseConnection.js";

const PORT = process.env.PORT || 8000;

async function Server() {
  try {
    await databaseConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

Server();
