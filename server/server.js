require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./db/models/message');
const myGraphQLSchema = require('./schema');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: myGraphQLSchema,
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
    io.emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

