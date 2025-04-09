import { Chat } from '../models/chat.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const createChat = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Current user ID
  const { participantId } = req.body; // Friend's ID

  if (!participantId) {
    return res.status(400).json({ message: 'Participant ID is required' });
  }

  // Check if a chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [userId, participantId] },
  });

  if (!chat) {
    // Create a new chat
    chat = new Chat({
      participants: [userId, participantId], // Ensure both participants are added
      messages: [],
    });
    await chat.save();
  }

  res.status(201).json({ data: chat });
});
// Fetch all chats for a user
export const getUserChats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const chats = await Chat.find({ participants: userId })
    .populate('participants', 'fullName username profilePicture')
    .populate('messages.sender', 'fullName username profilePicture');

  res.status(200).json(new ApiResponse(200, 'Chats fetched successfully', chats));
});

// Fetch messages for a specific chat
export const getChatMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId).populate('messages.sender', 'fullName username profilePicture');
  if (!chat) {
    return next(new ApiError(404, 'Chat not found'));
  }

  res.status(200).json(new ApiResponse(200, 'Chat messages fetched successfully', chat.messages));
});

// Send a message
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ApiError(404, 'Chat not found'));
  }

  const message = {
    sender: senderId,
    content,
    timestamp: Date.now(),
  };

  chat.messages.push(message);
  await chat.save();

  res.status(201).json(new ApiResponse(201, 'Message sent successfully', message));
});