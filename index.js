if (require('./config/env.conf') != "prod")
    require('dotenv').config();

const server = require('./src/server');

server.start(process.env.PORT);