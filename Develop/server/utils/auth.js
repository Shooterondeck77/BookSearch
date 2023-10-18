const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: async (context) => {
    const { req } = context;
    
    const token = req.headers.authorization || '';

    // ["Bearer", "<tokenvalue>"]
    if (!token) {
      throw new Error('You have no token!');
    }

    if (!token.startsWith('Bearer ')) {
      throw new Error('Invalid token format');
    }

    const tokenValue = token.split(' ')[1];
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(tokenValue, secret, { maxAge: expiration });
      context.user = data;
    } catch (error) {
      console.error('Invalid token', error);
      throw new Error('Invalid token');
    }

    // send to next endpoint
    return resolve();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
