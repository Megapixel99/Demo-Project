'use strict';

// should only be run once
const mysql = require('mysql2'); // mysql2 to access the database
const axios = require('axios'); // axios to make https requests
require('./env.js'); // import enviroment variables for the current file

const types = ['schools', 'students', 'terms', 'staff', 'faculty', 'scores']; // All 6 of the items in the old database

function GetPromises(type) { // this function turns all of the http requests into promises
  const promises = []; // array to store the promises
  for (let i = 0; i < 10; i += 1) { // for loop goes to 10 because there are 10 pages in the API
    promises.push(new Promise(((resolve, reject) => {
      axios.get('https://temp-data.herokuapp.com/' + type + '?pageNum='
        + i, {
        headers: {
          Authorization: process.env.API_KEY // Using the Bearer Token for Authorization
        } // calling the API with axios
      }).then((response) => {
        resolve(response.data); // returning the data as a successful Promise
      }).catch((err) => {
        reject(err); // returning the error as a unsuccessful Promise
      });
    })));
  }
  return promises; // returning all of the promises
}

async function GetSqlRequests(connection) {
  const queryPromises = []; // array to store the promises
  for (let h = 0; h < types.length; h += 1) { // loop through each item in the old database
    await Promise.all(GetPromises(types[h])).then((values) => { // waits for all of the Promises from GetPromises to finish then executes the code for each item
      switch (types[h]) { // switch between the items from the old database
        case 'schools':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO schools (students, staff, faculty, facilities, Campuses, name, address)' // SQL INSERT statement
                + " VALUES ('" + JSON.stringify(values[i][j].Students)
                + "', '" + JSON.stringify(values[i][j].Staff) + "', '"
                + JSON.stringify(values[i][j].Faculty) + "', '" + JSON.stringify(
                  values[i][j].Facilites
                ) + "', '" + JSON.stringify(
                  values[i][j].Campuses
                ) + "', '" + values[i][j].Name + "', '" + values[i][j]
                  .Address + "');"
              ));
            }
          }
          break;
        case 'students':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO students (scholarships, parent1, parent2, name, grade, studnum, commuter, employed, school)' // SQL INSERT statement
                + " VALUES ('" + JSON.stringify(values[i][j].Scholarships)
                + "', '" + JSON.stringify(values[i][j].Parent1) + "', '"
                + JSON.stringify(values[i][j].Parent2) + "', '" + values[
                  i][j].Name + "', '" + values[i][j].Grade + "', '"
                + values[i][j].StudNum + "', '" + values[i][j].Commuter
                + "', '" + values[i][j].Employed + "', '" + JSON.stringify(
                  values[i][j].School
                ) + "');"
              ));
            }
          }
          break;
        case 'terms':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO terms (school, term, enrollment)' // SQL INSERT statement
                + " VALUES ('" + JSON.stringify(values[i][j].School)
                + "', '" + values[i][j].Term + "', '" + values[i][j].Enrollment
                + "');"
              ));
            }
          }
          break;
        case 'staff':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO staff (name, staffnum, department)' // SQL INSERT statement
                + " VALUES ('" + values[i][j].Name + "', '" + values[
                  i]
                  [j].StaffNum + "', '" + values[i][j].Departmant + "');"
              ));
            }
          }
          break;
        case 'faculty':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO faculty (name, facnum, department)' // SQL INSERT statement
                + " VALUES ('" + values[i][j].Name + "', '" + values[
                  i]
                  [j].FacNum + "', '" + values[i][j].Departmant + "');"
              ));
            }
          }
          break;
        case 'scores':
          for (let i = 0; i < values.length; i += 1) { // returns an array of arrays, hence the double for loops
            for (let j = 0; j < values[i].length; j += 1) {
              queryPromises.push(connection.promise().query( // the SQL statement returns a promise, so it is pushed to an array to proccess later
                'INSERT INTO scores (student, score)' // SQL INSERT statement
                + " VALUES ('" + JSON.stringify(values[i][j].Student)
                + "', '" + values[i][j].Score + "');"
              ));
            }
          }
          break;
        default:
          break;
      }
    }).catch((err) => {
      console.error(err);
    });
  }
  return queryPromises;
}

const connection = mysql.createConnection({ // connecting to SQL database
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect(async (err) => { // async is used so we can use await to execute code syncronisly
  if (err) {
    console.error('error connecting: ' + err.stack);
    process.exit(1);
  }
  const queryPromises = (await GetSqlRequests(connection)); // new array for promises, await is used to wait for the results of the function to be returned
  Promise.all(queryPromises).then(() => { // after all of the Promises form GetSqlRequests are proccessed
    console.log('Done');
    connection.close(); // closing the connection
  });
});
