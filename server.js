'use strict';

const express = require('express'); // express is a popular web framework
const Router = require('./router.js'); // sets the variable Router to the file router.js

const app = express();

app.set('json spaces', 2); // this line makes JSON more readable to people
app.use(Router); // tells the server to use the router
const listener = app.listen(3000, () => { // tell the server to use port 3000 to host the server
  console.log(listener.address()); // outputs the port to the console
});
