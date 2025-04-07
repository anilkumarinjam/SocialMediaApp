import express from 'express';
import { fetchUser } from '../middleware/fetchUser.js';
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  createChat
} from '../controllers/chat.controllers.js';

const router = express.Router();

// Fetch all chats for the logged-in user
router.get('/', fetchUser, getUserChats);

// Fetch messages for a specific chat
router.get('/:chatId', fetchUser, getChatMessages);

// Send a message in a chat
router.post('/:chatId/message', fetchUser, sendMessage);

router.post('/', fetchUser, createChat); 

export default router;