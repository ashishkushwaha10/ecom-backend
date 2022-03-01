"use strict";

const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');

const app = express();



// enabling cors.
app.use(cors({
    "origin": "*",
    "Access-Control-Allow-Origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
  }));

// security protection.
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    // ...
  }));

app.use(express.static(path.join(__dirname,'..', 'public')));

app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024}
}))

// setting body-parser for parsing query params.
app.use(bp.json({limit: '50mb'}));
app.use(bp.urlencoded({ limit: '50mb', extended: true }));


//setting routes.
require('./routes')(app);

const start = (PORT) => {
    app.listen(PORT, () => {
        console.log(`project running at port:  ${PORT}`);
    })
}

module.exports = {
    start
}