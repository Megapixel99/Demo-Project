module.exports = require('dotenv').config({ // use dotenv so you can use different environment files for different enviroments, variables are stored in process.env
  path: '.dev.env' // enviroment file
}); // export the results of dotenv
