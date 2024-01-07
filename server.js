const fs = require('fs');
const path = require('path');
const i18n = require('i18n');
const http = require('http');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');

// const bodyParser = require("body-parser")
const studentRouter = require('./routes/student.router');

require('dotenv').config();


i18n.configure({
    locales: ['en'],
    directory: path.join(__dirname, 'locales'),
    updateFiles: false,
});

// init middleware & creating a server.
const app = express();
const server = http.createServer(app)
app.use(i18n.init);
app.use(helmet());
app.use(express.json());

// --Routes--
app.use('/api/students', studentRouter);

async function startServer() {
    
    await mongoose.connect(process.env.MONGODB_URI);

    server.listen(process.env.PORT, () => {
        console.log(`Listing on PORT ${process.env.PORT}`);
    });

}

startServer();