const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
    Query: {
      me: async (_, args, context) => {
        if (context.user) {
          return User.findById(context.user._id);
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
    Mutation: {
        async login(_, { email, password }) {
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error('User not found');
          }
          return { user }; 
        },
    
        async addUser(_, { username, email, password }) {
            const user = await User.create({ username, email, password });
            return { user }; 
          },
      
          async saveBook(_, { bookData }, context) {
            if (!context.user) {
              throw new AuthenticationError('Not authenticated');
            }
            const updatedUser = await User.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { savedBooks: bookData } },
              { new: true }
            );
            return updatedUser;
          },
      
          async removeBook(_, { bookId }, context) {
            if (!context.user) {
              throw new AuthenticationError('Not authenticated');
            }
            const updatedUser = await User.findByIdAndUpdate(
              context.user._id,
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            );
            return updatedUser;
          },
        },
      };
      
      module.exports = resolvers;