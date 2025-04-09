"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchChatMessages, sendMessage, createChat } from '@/redux/chats/chatSlice';
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
  const [activeTab, setActiveTab] = useState('chats'); // State for active tab
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
      }, 3000); // Fetch new messages every 3 seconds
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
    if (newMessage.trim() && activeChatId) {
      dispatch(sendMessage({ chatId: activeChatId, content: newMessage }))
        .unwrap()
        .then(() => {
          setNewMessage('');
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });
    }
  };

  const handleStartChat = async (friendId) => {
    try {
      if (!friendId) {
        console.error('Friend ID is missing');
        return;
      }
      const newChat = await dispatch(createChat({ friendId })).unwrap();
      setActiveChatId(newChat._id);
      setActiveTab('chats'); // Switch to chats tab after starting a chat
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const isSentByCurrentUser = (msg) => {
    return msg.sender === currentUserId || msg.sender?._id === currentUserId;
  };

  if (!currentUserId) {
    return <p>Loading user data...</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 border-r flex flex-col">
        {/* Tabs */}
        <div className="flex justify-around border-b">
          <button
            className={`flex-1 p-4 text-center ${
              activeTab === 'chats' ? 'bg-white font-bold' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`flex-1 p-4 text-center ${
              activeTab === 'friends' ? 'bg-white font-bold' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
        </div>

        {/* Content Based on Active Tab */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' ? (
            // Chat List
          <ul className="flex-1 overflow-y-auto list-none">
            {chats.length > 0 ? (
              chats.map((chat) => {
                const friend = chat.participants.find((p) => p._id !== currentUserId);
                const lastMessage = chat.messages?.[chat.messages.length - 1]; // Get the last message
                return (
                  <li
                    key={chat._id}
                    className={`p-4 cursor-pointer ${
                      activeChatId === chat._id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleChatClick(chat._id)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{friend?.fullName || 'Unknown Friend'}</span>
                      {lastMessage && (
                        <span className="text-sm text-gray-500">
                          {formatDate(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.content || 'No messages yet'}
                      </p>
                    )}
                  </li>
                );
              })
            ) : (
              <p className="p-4 text-gray-500">No chats found. Start a chat with a friend below:</p>
            )}
          </ul>
          ) : (
            // Friends List
          <ul className="flex-1 overflow-y-auto list-none">
            {friends.length > 0 ? (
              friends.map((friend) => {
                // Check if a chat already exists with this friend
                const existingChat = chats.find((chat) =>
                  chat.participants.some((p) => p._id === friend._id)
                );

                return (
                  <li
                    key={friend._id}
                    className="p-4 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span>{friend.fullName || 'Unknown Friend'}</span>
                      {!existingChat && (
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          onClick={() => handleStartChat(friend._id)}
                        >
                          Start Chat
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="p-4 text-gray-500">No friends found. Add some friends to start chatting!</p>
            )}
          </ul>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col h-full">
        {activeChatId ? (
          <>
        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : errorMessages ? (
            <p className="text-red-500">{errorMessages}</p>
          ) : (
            // Group and render messages by date
            Object.entries(groupMessagesByDate(messages[activeChatId] || [])).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="text-center text-gray-500 text-sm my-4">{date}</div>
                {msgs.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`mb-2 flex ${isSentByCurrentUser(msg) ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="max-w-xs flex items-center gap-2">
                      <p
                        className={`p-2 rounded-lg ${
                          isSentByCurrentUser(msg)
                            ? 'bg-blue-500 text-white text-left'
                            : 'bg-gray-200 text-gray-800 text-right'
                        }`}
                      >
                        {msg.content || 'Message content missing'}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

            {/* Input Bar */}
            <div className="border-t p-4 flex items-center bg-white sticky bottom-15">
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