/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let isConnected;

function connectToDatabase() {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(process.env.MONGODB_CLOUD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    })
    .catch((err) => {
      console.log('Cannot connect to the database!', err);
    });
}

module.exports = connectToDatabase;
