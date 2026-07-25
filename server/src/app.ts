import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app: Application = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    uptime: `${process.uptime()}`,
    started_at: `${new Date().toLocaleString('en-in')}`,
  });
  return;
});

export default app;
