require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./db/models/message');
const schema = require('./schema');
const app = express();

  // Create HTTP server
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/chatupDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

 // Socket.io events
  io.on('connection', (socket) => {
  console.log('New client connected');

  // Fetch messages from the database
  Message.find().sort({ timestamp: 1 }).then(messages => {
  socket.emit('previousMessages', messages);
  });

  // Listen for new messages
    socket.on('sendMessage', (data) => {
    const newMessage = new Message(data);
     newMessage.save().then(() => {
     io.emit('newMessage', newMessage); // this is to broadcast new message to all clients
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

