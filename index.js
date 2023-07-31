import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/train.js';
import cors from 'cors';
import cron from 'node-cron';
import { spawn } from 'child_process';

dotenv.config();

const app = express();


app.use(express.json());


app.use(
  cors({
    origin: [process.env.API_URL, 'http://localhost:3000'],
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('[DB] Connection Success');
  })
  .catch((err) => {
    console.log(err.message);
  });


app.use('/api/train', router);


cron.schedule('30 4 * * *', () => {

  console.log('Running seed.js file');
  const seed = spawn('node', ['seed.js']);

  seed.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  seed.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  seed.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
