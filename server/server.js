require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./db/models/message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatupDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {

    // Seed the database
    await Message.deleteMany({}); // erases all messages in db

    // adds these two messages in db
    await Message.create([
      {
        username: "test1",
        message: "Hello World!"
      },
      {
        username: "test2",
        message: "Hi there!!"
      }
    ])

    console.log('MongoDB connected')
  })
  .catch(err => console.log(err));

// Run when client connects 
io.on('connection', (socket) => {
  console.log('New client connected');
  

  // Fetch messages from the database
  Message.find().sort({ timestamp: 1 }).then(messages => {
    socket.emit('previousMessages', messages);
  });

  // Listen for new messages
  socket.on('sendMessage', (data) => {
    console.log(data)
    const newMessage = new Message(data);
    newMessage.save().then(() => {
      io.emit('newMessage', newMessage); // this is to broadcast new message to all clients
    });
  });

  //Runs when client diconnects 
  socket.on('disconnect', () => {
    console.log('Client disconnected');

  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

