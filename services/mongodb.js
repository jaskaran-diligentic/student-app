

// .............DB Connection.............
require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connection.once('open', () => {
    console.log("MongoDB Connection Ready!!!!");
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

module.exports = MONGODB_URI;