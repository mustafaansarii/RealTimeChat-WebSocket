# Realtime Chat (WebSocket)

A real-time chat application built using WebSocket for seamless communication. The project consists of a frontend built with React (Vite) and a backend implemented in Spring Boot.

<div align="center">
  <img src="chat1.png" alt="Chat Screen" width="300"/>
  <img src="chat2.png" alt="Messages Screen" width="300"/>
</div>


## Features
- Real-time messaging with WebSocket
- User join/leave notifications
- Scalable backend using Spring Boot
- Docker support for deployment

## Tech Stack
### Frontend
- React (Vite)
- SockJS & StompJS for WebSocket communication
- Tailwind CSS (optional for styling)

### Backend
- Spring Boot (WebSocket & REST API)
- Jackson for JSON serialization
- PostgreSQL (or any SQL database)
- Docker

## Directory Structure
```
mustafaansarii-realtimechat-websocket/
├── chat-app-client/         # Frontend (React)
│   ├── src/
│   │   ├── component/
│   │   │   ├── WebSocketChat.jsx
│   │   │   ├── chatService.js
│   │   ├── config.js
│   │   ├── App.jsx
│   ├── vite.config.js
│   ├── package.json
├── chat-application-server/ # Backend (Spring Boot)
│   ├── src/main/java/com/chat/chat/application/
│   │   ├── ChatApplication.java
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   ├── pom.xml
│   ├── application.properties
│   ├── Dockerfile
```

## Installation
### Prerequisites
- Node.js (for frontend)
- Java 17+ (for backend)
- PostgreSQL (or any database)
- Docker (optional for containerization)

### Backend Setup
```sh
cd chat-application-server
mvn clean install
java -jar target/chat-application.jar
```

### Frontend Setup
```sh
cd chat-app-client
npm install
npm run dev
```

## WebSocket Endpoints
- `ws://localhost:8080/ws` → WebSocket Connection
- `/topic/public` → Public Chat Channel
- `/app/chat.addUser` → Add user event
- `/app/chat.sendMessage` → Send chat message

## Running with Docker
```sh
docker-compose up --build
```

## Contribution
Feel free to fork the repository, create a feature branch, and submit a pull request!


## Contact
For any queries, reach out at mustafaansari@mail.com.

