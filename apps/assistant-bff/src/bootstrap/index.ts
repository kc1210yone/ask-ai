import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { chatRouter } from '#src/features/chat/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(chatRouter);

const port = 3000;
app.listen(port, () => {
  console.info(
    `Assistant BFF listening on http://localhost:${port.toString()}.`,
  );
});
