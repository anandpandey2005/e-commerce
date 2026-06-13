import express, { Application, Request, Response } from 'express';
const app: Application = express();

//inital routing
app.get('/', (req: Request, res: Response) => {
    const initialUptime = Math.floor(process.uptime());
    res.send(`
        <html>
         <head>
          <title>server home page</title>
         </head>
         <body>
          <h1>Server Status : running</h1>
          <h2>Running from: <span id="uptime">${initialUptime}</span> seconds</h2>

          <script>
            // Get the starting uptime passed from the server
            let uptime = ${initialUptime};
            const uptimeElement = document.getElementById('uptime');

            // Update the HTML text every 1 second locally in the browser
            setInterval(() => {
                uptime++;
                uptimeElement.textContent = uptime;
            }, 1000);
          </script>
         </body>
        </html>
    `);

})


export { app };