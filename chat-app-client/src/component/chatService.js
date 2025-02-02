import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import config from '../ config';

// Connect to WebSocket
export const connectToWebSocket = (username, setStompClient, setMessages, setConnected) => {
  const socket = new SockJS(`${config.Backend_Api}/ws`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    setStompClient(client);
    client.subscribe('/topic/public', (payload) => onMessageReceived(payload, setMessages));
    client.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN' }));
    setConnected(true);
  }, () => {
    console.error('Could not connect to WebSocket. Retrying in 5 seconds...');
    setTimeout(() => connectToWebSocket(username, setStompClient, setMessages, setConnected), 5000);
  });
};

// Fetch current time from API
const fetchCurrentTime = async () => {
  try {
    const response = await fetch(`${config.Backend_Api}/time`);
    const data = await response.json();
    if (!data) throw new Error("Invalid time response");
    return formatTime(data);
  } catch (error) {
    console.error('Error fetching time:', error);
    return formatTime(new Date().toISOString()); // Fallback to system time
  }
};

// Format time as HH:mm
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "00:00" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Handle received messages
const onMessageReceived = async (payload, setMessages) => {
  const message = JSON.parse(payload.body);
  message.time = await fetchCurrentTime(); // Add formatted time to message
  setMessages((prevMessages) => [...prevMessages, message]);
};

// Send a message
export const sendMessage = (messageContent, stompClient, username) => {
  if (messageContent && stompClient) {
    const chatMessage = { sender: username, content: messageContent, type: 'CHAT' };
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  }
};
