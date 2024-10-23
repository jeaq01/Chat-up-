const Message = require('./db/models/message');
const User = require('./db/models/user');
const jwt = require('jsonwebtoken');


const createToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const root = {
  messages: async () => await Message.find().populate('sender'),
  
  addMessage: async ({ content, senderId }) => {
    const message = new Message({ content, sender: senderId });
    await message.save();
    return message;
  },
  
  register: async ({ username, password }) => {
    const newUser = new User({ username, password });
    await newUser.save();
    return newUser;
  },
  
  login: async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    return createToken(user);
  },

//   login: async (parent, { username, password }) => {
//     const profile = await Profile.findOne({ username });

//     if (!profile) {
//       throw AuthenticationError;
//     }

//     const correctPw = await profile.isCorrectPassword(password);

//     if (!correctPw) {
//       throw AuthenticationError;
//     }

//     const token = signToken(profile);
//     return { token, profile };
//   },
};

module.exports = root;