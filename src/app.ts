 import express, { Router } from 'express';
import dotenv from 'dotenv';
import sequelizeDb from './db/database'
import { createServer } from 'http';
import cors from 'cors';
import userRouter from './routers/users';
import ResumeRouter from './routers/resume';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

const router = Router();

const PORT = Number(process.env.PORT || 5000);

const connectDB = async () => {
  try {
    await sequelizeDb.authenticate();
    console.log('Connection has been established successfully.');
    const data = await sequelizeDb.sync({ alter: true })
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);


app.use('/api/users', userRouter);
app.use('/api/resumes', ResumeRouter);

server.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${app.get('port')}`);
})