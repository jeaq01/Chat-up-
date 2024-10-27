const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
const User = require('./db/models/user');
const Message = require('./db/models/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    }),
});

const LoginResponseType = new GraphQLObjectType({
    name: 'LoginResponse',
    fields: {
        user: { type: UserType },
        token: { type: GraphQLString }
    }
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        message: { type: GraphQLString },
        username: { type: GraphQLString },
        timestamp: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        messages: {
            type: new GraphQLList(MessageType),
            resolve() {
                return Message.find();
            },
        },
        user: {
            type: UserType,
            args: { username: { type: GraphQLString } },
            resolve(parent, args) {
                return User.findOne({ username: args.username });
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        register: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const hashedPassword = await bcrypt.hash(args.password, 10);
                const user = new User({ username: args.username, password: hashedPassword });
                return user.save();
            },
        },
        login: {
            type: LoginResponseType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const user = await User.findOne({ username: args.username });
                if (!user) throw new Error('User not found');
                const valid = await bcrypt.compare(args.password, user.password);
                if (!valid) throw new Error(`Invalid Credentials`);                
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return { user, token };
            },
        },
        addMessage: {
            type: MessageType,
            args: {
                message: { type: GraphQLString },
                username: { type: GraphQLString },
            },
            resolve(parent, args) {
                const message = new Message({
                    message: args.message,
                    username: args.username,
                    timestamp: new Date().valueOf().toString()
                });
                return message.save();
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});