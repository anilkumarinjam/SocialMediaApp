"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchChatMessages, sendMessage } from '@/redux/chats/chatSlice';
import axiosInstance from '@/api/axiosInstance';

const ChatPage = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats.chats);
  const messages = useSelector((state) => state.chats.messages);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const currentUserId = useSelector((state) => state.auth.userDetails?._id);

  useEffect(() => {
    dispatch(fetchChats());
    fetchFriends();
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (activeChatId) {
      interval = setInterval(() => {
        dispatch(fetchChatMessages(activeChatId));
      }, 3000); // Fetch new messages every 5 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or when activeChatId changes
  }, [activeChatId, dispatch]);

  useEffect(() => {
    const chatWindow = document.querySelector('.overflow-y-auto');
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages[activeChatId]]);

  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get('/user/friends');
      setFriends(response.data.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleChatClick = async (chatId) => {
    setActiveChatId(chatId);
    if (!messages[chatId]) {
      setLoadingMessages(true);
      setErrorMessages(null);
      try {
        await dispatch(fetchChatMessages(chatId));
      } catch (error) {
        setErrorMessages('Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(sendMessage({ chatId: activeChatId, content: newMessage }));
      setNewMessage('');
    }
  };

  const isSentByCurrentUser = (msg) => {
    return msg.sender === currentUserId || msg.sender?._id === currentUserId;
  };

  if (!currentUserId) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar with Chat List */}
      <div className="w-1/3 bg-gray-100 border-r flex flex-col">
        <h2 className="text-lg font-bold p-4">Chats</h2>
        <ul className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => {
              // Display only the friend's name
              const friend = chat.participants.find((p) => p._id !== currentUserId);
              return (
                <li
                  key={chat._id}
                  className={`p-4 cursor-pointer ${activeChatId === chat._id ? 'bg-gray-200' : ''}`}
                  onClick={() => handleChatClick(chat._id)}
                >
                  {friend?.fullName || 'Unknown Friend'}
                </li>
              );
            })
          ) : (
            <p className="p-4 text-gray-500">No chats found. Start a chat with a friend below:</p>
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col">
        {activeChatId ? (
          <>
            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : errorMessages ? (
                <p className="text-red-500">{errorMessages}</p>
              ) : (
                messages[activeChatId]?.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`mb-2 flex ${isSentByCurrentUser(msg) ? 'justify-start' : 'justify-end'}`}
                  >
                    <p
                      className={`p-2 rounded-lg max-w-xs ${
                        isSentByCurrentUser(msg)
                          ? 'bg-blue-500 text-white text-left'
                          : 'bg-gray-200 text-gray-800 text-right'
                      }`}
                    >
                      {msg.content || 'Message content missing'}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t p-4 flex items-center bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded mr-2"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="p-4">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;