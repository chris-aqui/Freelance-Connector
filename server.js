// require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// initilized
const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Make connection to Mongo on mlab
mongoose
.connect(db)
  .then(() => console.log('MongoDB COnnected'))
  .catch( err => console.log('MongoDB connection error: ',err))

app.get('/', (req, res) => res.send('Hello'));

app.listen(port, () => {
  console.log(`==> 🌎   Server running on port ${port}`);
});
