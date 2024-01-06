const fs = require('fs');
const path = require('path');
const i18n = require('i18n');
const https = require('https');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');

// const bodyParser = require("body-parser")
const studentRouter = require('./routes/student.router');

require('dotenv').config();

const PORT = 8000;

i18n.configure({
    locales: ['en'],
    directory: path.join(__dirname, 'locales'),
    updateFiles: false,
});

// init middleware & creating a server.
const app = express();
app.use(i18n.init);
app.use(helmet());
app.use(express.json());

// --Routes--
app.use('/api/students', studentRouter);

async function startServer() {
    await mongoose.connect(process.env.MONGODB_URI);
    https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }, app).listen(PORT, () => {
        console.log(`Listing on PORT ${PORT}`);
    });

}

startServer();