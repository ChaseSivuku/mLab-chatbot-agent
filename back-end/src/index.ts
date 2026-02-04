import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleChatRequest } from './routes/chat.js'; // Added .js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loads the .env file located in the main project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("mLab AI Agent Server is Online");
});

app.post('/api/chat', handleChatRequest);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});