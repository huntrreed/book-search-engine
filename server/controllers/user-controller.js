// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser(req, res) {
    // console.log(`req: ${req}`)
    const foundUser = await User.findById(req);

    if (!foundUser) {
      throw new Error('User not found');
    }
    // console.log(`foundUser: ${foundUser}`);
    return foundUser;
  },
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createNewUser(req, res) {
    // console.log(`req: ${req.username}, ${req.email}, ${req.password}`);
    const user = await User.create(req);

    if (!user) {
      throw new Error('User not created!');
    }
    const token = signToken({ email: user.email, name: user.username, _id: user._id });
    return { token, user };
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {req} is destructured req.req
  async login(req, res) {
    // console.log(`req: ${req.email}, ${req.password}`);
    const user = await User.findOne({email: req.email})
    if (!user) {
      throw new Error('User not found!');
    }

    const correctPw = await user.isCorrectPassword(req.password);

    if (!correctPw) {
      throw new Error('Incorrect credentials');
    }
    const token = signToken({ email: user.email, name: user.username, _id: user._id });
    // console.log(`token: ${token}, user: ${user}`)
    return { token, user };
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook({ user, book }, res) {
    // console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (err) {
      // console.log(err);
      throw new Error('Could not save book!');
    }
  },
  // remove a book from `savedBooks`
  async deleteBook({ user, bookId }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user },
      { $pull: { savedBooks: { bookId: bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('Could not delete book');
    }
    // console.log(`updatedUser: ${updatedUser}`);
    return updatedUser;
  },
};