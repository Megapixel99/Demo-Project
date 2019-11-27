'use strict';

const jwt = require('jsonwebtoken'); // import jsonwebtoken, to use for authentication
require('./env.js'); // import enviroment variables for the current file

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization; // get the request headers
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); // remove 'Bearer ' from the token
    }
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => { // compare the token to the secret
      if (err) {
        res.sendStatus(403); // return Unauthorized response
      } else { // user is authorized
        req.decoded = decoded;
        next(); // call the next item in the middleware
      }
    });
  } else {
    res.sendStatus(403); // return Unauthorized response
  }
};

module.exports = {
  checkToken: checkToken // export checkToken as checkToken
};
