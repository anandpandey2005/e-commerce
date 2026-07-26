import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';

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

app.get('/api/v1/health', (req: Request, res: Response): void => {
  res.status(200).json({
    uptime: `${process.uptime()}`,
    started_at: `${new Date().toLocaleString('en-in')}`,
  });
  return;
});

app.use('/api/v1/user/account', userRouter);

export default app;
