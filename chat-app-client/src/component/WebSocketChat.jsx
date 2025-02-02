import React, { useState, useEffect } from 'react';
import { connectToWebSocket, sendMessage } from './chatService';

const ChatInput = ({ sendMessageHandler }) => (
  <form onSubmit={sendMessageHandler} className="bg-gray-100 p-2 flex gap-2 items-center">
    <input
      type="text"
      id="message"
      placeholder="Type a message"
      className="flex-1 p-2 px-4 rounded-full border focus:outline-none focus:border-green-500 bg-white"
    />
    <button
      type="submit"
      className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center hover:bg-green-600 focus:outline-none transition duration-200 ease-in-out"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    </button>
  </form>
);

const MessageList = ({ messages, currentUser }) => (
  <div className="flex-1 overflow-y-auto p-4 bg-chat-background bg-opacity-5 bg-repeat bg-contain" 
       style={{backgroundImage: 'url(https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e9969662c86da6b3f3d2e5.jpg)'}}>
    {messages.map((msg, idx) => (
      <div key={idx} className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-end gap-2 ${msg.sender === currentUser ? 'flex-row-reverse' : ''}`}>
          {msg.type === 'CHAT' && msg.sender !== currentUser && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              {msg.sender[0]}
            </div>
          )}
          <div className={`max-w-[100%] rounded-lg p-3 ${
            msg.sender === currentUser 
              ? 'bg-green-100 rounded-br-none' 
              : 'bg-white rounded-bl-none'
          } shadow-sm relative break-words`}>
            {msg.type === 'CHAT' && (
              <>
              
                <p className="text-xs text-gray-500 text-center">{msg.sender}</p>
                <p className={`text-sm ${msg.sender === currentUser ? 'text-gray-800' : 'text-gray-700'}`}>
                  {msg.content}
                </p>
                
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-gray-500">
                    {isNaN(new Date(msg.time)) 
                      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === currentUser && (
                    <span className="text-xs text-gray-500">✓✓</span>
                  )}
                </div>
              </>
            )}
            {msg.type === 'JOIN' || msg.type === 'LEAVE' ? (
              <div className="text-center text-gray-500 text-sm py-2">
                {msg.sender} {msg.type === 'JOIN' ? 'joined' : 'left'}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const UsernameInput = ({ setUsername, onSubmit }) => (
  <div className="bg-white shadow-lg p-8 rounded-lg max-w-sm w-full">
    <div className="text-center mb-6">
      <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">Welcome to ChatApp</h1>
      <p className="text-gray-600 mt-2">Please enter your name to start chatting</p>
    </div>
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        id="name"
        placeholder="Your name"
        className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-green-500 text-center text-lg"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 focus:outline-none"
      >
        Continue
      </button>
    </form>
  </div>
);

const WebSocketChat = () => {
  const [username, setUsername] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [usernamePageVisible, setUsernamePageVisible] = useState(true);
  const [users, setUsers] = useState([]);  

  const handleConnect = (e) => {
    e.preventDefault();
    if (username) {
      setUsernamePageVisible(false);
      setUsers(prevUsers => [...prevUsers, username]);  
      connectToWebSocket(username, setStompClient, setMessages, setConnected, setUsers); 
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageContent = e.target.elements.message.value.trim();
    sendMessage(messageContent, stompClient, username);
    e.target.elements.message.value = '';
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center items-center p-0 m-0">
      {usernamePageVisible ? (
        <UsernameInput setUsername={setUsername} onSubmit={handleConnect} />
      ) : (
        <div className="bg-white w-full h-full flex flex-col rounded-lg shadow-lg overflow-hidden p-0 m-0">
          {/* Header */}
          <div className="bg-green-500 p-4 flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                <span className="text-green-700 font-semibold">C</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">Chat - {users.join(', ')}</h2> {/* Display joined users */}
                <p className="text-green-100 text-sm">{connected ? 'online' : 'connecting...'}</p>
              </div>
            </div>
          </div>
          
          <MessageList messages={messages} currentUser={username} />


          <ChatInput sendMessageHandler={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default WebSocketChat;
