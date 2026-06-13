import env from 'dotenv'
env.config()
import http, { Server } from 'node:http';
import { app } from './app.js';

// configuration
let PORT: number = Number(process.env.PORT) || 2005;
let server: Server = http.createServer(app);


app.listen(PORT, () => {
    console.log(`server start : http://localhost:${PORT}`);
})


