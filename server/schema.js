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

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        sender: { type: GraphQLString },
        timestamp: { type: GraphQLString },
    }),
});

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: () => ({
        user: { type: UserType },
        token: { type: GraphQLString }
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
                // const hashedPassword = await bcrypt.hash(args.password, 10);
                // const user = new User({ username: args.username, password: hashedPassword });
                const user = new User({ username: args.username, password: args.password });
                return user.save();
            },
        },
        login: {
            type: AuthType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const user = await User.findOne({ username: args.username });
                if (!user) throw new Error('User not found');
                console.log(user.password)
                console.log(args.password)
                // const valid = await bcrypt.compare(args.password, user.password);
                const valid = await user.comparePassword(args.password);
                console.log(valid)
                if (!valid) throw new Error('Invalid password');
                // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const JWT_SECRET = "putThisInYourENVFile"
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                return { ...user._doc, token };
            },
        },
        addMessage: {
            type: MessageType,
            args: {
                content: { type: GraphQLString },
                sender: { type: GraphQLString },
            },
            resolve(parent, args) {
                const message = new Message({
                    content: args.content,
                    sender: args.sender,
                    timestamp: new Date().toISOString(),
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


// const { buildSchema } = require('graphql');

// const schema = buildSchema(`
//     type User {
//         id: ID!
//         username: String!
//     }

//     type Message {
//         id: ID!
//         content: String!
//         sender: User!
//         timestamp: String!
//     }

//     type Query {
//         messages: [Message]
//         users: [User]
//     }

//     type Mutation {
//         register(username: String!, password: String!): String
//         login(username: String!, password: String!): String
//         sendMessage(content: String!): Message
//     }
// `);

// module.exports = schema;

// // const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
// // const User = require('./db/models/user');
// // const Message = require('./db/models/message');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // const UserType = new GraphQLObjectType({
// //     name: 'User',
// //     fields: () => ({
// //         id: { type: GraphQLString },
// //         username: { type: GraphQLString },
// //         password: { type: GraphQLString },
// //     }),
// // });

// // const MessageType = new GraphQLObjectType({
// //     name: 'Message',
// //     fields: () => ({
// //         id: { type: GraphQLString },
// //         content: { type: GraphQLString },
// //         sender: { type: GraphQLString },
// //         timestamp: { type: GraphQLString },
// //     }),
// // });

// // const RootQuery = new GraphQLObjectType({
// //     name: 'RootQueryType',
// //     fields: {
// //         messages: {
// //             type: new GraphQLList(MessageType),
// //             resolve(parent, args) {
// //                 return Message.find();
// //             },
// //         },
// //         user: {
// //             type: UserType,
// //             args: { username: { type: GraphQLString } },
// //             resolve(parent, args) {
// //                 return User.findOne({ username: args.username });
// //             },
// //         },
// //     },
// // });

// // const Mutation = new GraphQLObjectType({
// //     name: 'Mutation',
// //     fields: {
// //         register: {
// //             type: UserType,
// //             args: {
// //                 username: { type: new GraphQLNonNull(GraphQLString) },
// //                 password: { type: new GraphQLNonNull(GraphQLString) },
// //             },
// //             async resolve(parent, args) {
// //                 const hashedPassword = await bcrypt.hash(args.password, 10);
// //                 const user = new User({ username: args.username, password: hashedPassword });
// //                 return user.save();
// //             },
// //         },
// //         login: {
// //             type: UserType,
// //             args: {
// //                 username: { type: new GraphQLNonNull(GraphQLString) },
// //                 password: { type: new GraphQLNonNull(GraphQLString) },
// //             },
// //             async resolve(parent, args) {
// //                 const user = await User.findOne({ username: args.username });
// //                 if (!user) throw new Error('User not found');
// //                 const valid = await bcrypt.compare(args.password, user.password);
// //                 if (!valid) throw new Error('Invalid password');
// //                 const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //                 return { ...user._doc, token };
// //             },
// //         },
// //         addMessage: {
// //             type: MessageType,
// //             args: {
// //                 content: { type: GraphQLString },
// //                 sender: { type: GraphQLString },
// //             },
// //             resolve(parent, args) {
// //                 const message = new Message({
// //                     content: args.content,
// //                     sender: args.sender,
// //                     timestamp: new Date().toISOString(),
// //                 });
// //                 return message.save();
// //             },
// //         },
// //     },
// // });

// // module.exports = new GraphQLSchema({
// //     query: RootQuery,
// //     mutation: Mutation,
// // });

