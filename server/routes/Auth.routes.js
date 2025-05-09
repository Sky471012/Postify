const express = require('express');
const linkedinCallback = require('../controller/Auth.controller');
require('dotenv').config();

const AuthRoutes = express.Router();

AuthRoutes.get('/callback', linkedinCallback)

module.exports = AuthRoutes;