const express = require('express');
const DATABASE = require('../database/connect')

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
    console.log(typeof DATABASE);
    response.send('Hellowy :3');
    response.end();
})

module.exports = ROUTER;