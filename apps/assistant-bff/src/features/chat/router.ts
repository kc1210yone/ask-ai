import { Router } from 'express';
import { postChatHandler } from './post-chat-handler.js';

export const chatRouter = Router();
chatRouter.post('/chat/:sessionId', postChatHandler);
