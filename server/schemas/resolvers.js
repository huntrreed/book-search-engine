const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');



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
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);
        return { token, user };
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