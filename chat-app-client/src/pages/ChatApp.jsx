import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log("Connected to WebSocket");
      client.subscribe("/topic/public", (message) => {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
      });
    });
    setStompClient(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({ sender: "John", content: message, roomId: "1234" })
      );
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;