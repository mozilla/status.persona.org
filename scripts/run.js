#!/usr/bin/env node

const express = require('express'),
         path = require('path');

var app = express()
  .use(express.static(path.join(__dirname, "..", "html")))
  .listen(process.env.PORT || 8080);
