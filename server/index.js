const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const moviesRoute = require('./routes/movies.js')
const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');
const {queryType} = require('./query.js');
require('dotenv').config()

const DB_CONNECTION = process.env.DB_CONNECTION;

const app = express();

module.exports = app;

//middlewares
app.use(require('body-parser').json());
app.use('/movies',moviesRoute);
app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

//connect db
mongoose.connect(DB_CONNECTION,
{ useUnifiedTopology: true ,useNewUrlParser: true},
 () =>{
  console.log('connect to bd');
});

//graphql stuff
const schema = new GraphQLSchema({ query: queryType });
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
