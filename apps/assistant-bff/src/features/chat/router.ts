import { Router } from 'express';
import { getChatHandler } from './get-chat-handler.js';
import { postChatHandler } from './post-chat-handler.js';

export const chatRouter = Router();
chatRouter.get('/chat/:sessionId', getChatHandler);
chatRouter.post('/chat/:sessionId', postChatHandler);
