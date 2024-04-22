const express = require('express');
const Router = express.Router();

Router
    .use('/test-route', require('./test-route'));

module.exports = Router;