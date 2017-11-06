"use strict";

var express = require('express');
var router = express.Router();
var categoriesRouter = require('./../routers/categoriesRouter.js');
var topicsRouter = require('./../routers/topicsRouter.js');
var postsRouter = require('./../routers/postsRouter.js');
var authRouter = require('./../routers/authRouter.js');
require('./../config/mongoose.js').connectToMongo();

module.exports = function(app, passport) {
    app.use(categoriesRouter);
    app.use(topicsRouter);
    app.use(postsRouter);
    app.use(authRouter(passport));
};
