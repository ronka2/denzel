const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config()
dotenv.config();

const DB_CONNECTION = process.env.DB_CONNECTION;

const app = express();

module.exports = app;

//middlewares
app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

//routes
app.get('/', (request, response) => {
  response.send({'ack': true});
});

//connect db
mongoose.connect(DB_CONNECTION,
{ useUnifiedTopology: true ,useNewUrlParser: true},
 () =>{
  console.log('connect to bd');
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
