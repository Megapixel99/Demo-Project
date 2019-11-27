'use strict';

const express = require('express'); // import express to use the router
const mysql = require('mysql2'); // import mysql2 to access the database
const jwt = require('jsonwebtoken'); // import jsonwebtoken, to use for authentication
const middleware = require('./middleware'); // import middleware.js for the current file
require('./env.js'); // import enviroment variables for the current file

const connection = mysql.createConnection({ // new SQL connection
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

const router = express.Router(); // using the express router

router.get('/generate/auth/token', (req, res) => { // generate authentication token
  const token = jwt.sign({
      username: process.env.AUTH_USERNAME
    },
    process.env.AUTH_SECRET);
  res.status(200).send(token);
});

router.get('/ping', (req, res) => { // endpoint to test if server is live
  res.status(200).send('pong');
});

router.get('/students', middleware.checkToken, (req, res) => { // middleware.checkToken checks the Bearer Token for authorization
  connection.promise().query('SELECT * FROM students;').then((result) => { // SQL statement
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});

router.get('/staff', middleware.checkToken, (req, res) => {
  connection.promise().query('SELECT * FROM staff;').then((result) => {
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});

router.get('/faculty', middleware.checkToken, (req, res) => {
  connection.promise().query('SELECT * FROM faculty;').then((result) => {
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});

router.get('/terms', middleware.checkToken, (req, res) => {
  connection.promise().query('SELECT * FROM terms;').then((result) => {
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});

router.get('/schools', middleware.checkToken, (req, res) => {
  connection.promise().query('SELECT * FROM schools;').then((result) => {
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});

router.get('/scores', middleware.checkToken, (req, res) => {
  connection.promise().query('SELECT * FROM scores;').then((result) => {
    res.status(200).send(result[0]);
  }).catch((err) => {
    console.error('Error: ' + err);
    res.status(500).send(
      'Unknown error occurred, please try again later'
    );
  });
});
module.exports = router; // exporting the router so it can be used in the server
