import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import config from '../config';

export const connectToWebSocket = (username, setStompClient, setMessages, setConnected) => {
  // Fix here: Replace http:// with wss:// if on HTTPS
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const socket = new SockJS(`${protocol}${config.Backend_Api}/ws`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    setStompClient(client);
    client.subscribe('/topic/public', (payload) => onMessageReceived(payload, setMessages));
    client.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN' }));
    setConnected(true);
  }, onError);
};

const onError = () => {
  console.error('Could not connect to WebSocket server. Please refresh the page to try again.');
};

const fetchCurrentTime = async () => {
  try {
    const response = await fetch(`${config.Backend_Api}/time`);
    const data = await response.json();
    return data;  // "2025-02-02T15:47:07.656090481" style
  } catch (error) {
    console.error('Error fetching time:', error);
    return new Date().toISOString(); 
  }
};



const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const onMessageReceived = async (payload, setMessages) => {
  const message = JSON.parse(payload.body);
  
  const currentTime = await fetchCurrentTime();

  
  message.time = formatTime(currentTime);

  
  setMessages((prevMessages) => [...prevMessages, message]);
};

export const sendMessage = (messageContent, stompClient, username) => {
  if (messageContent && stompClient) {
    const chatMessage = { sender: username, content: messageContent, type: 'CHAT' };
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
  }
};
