const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bp = require('body-parser');
require('dotenv/config');
// const User = require("../models/User");
// const Question = require("../models/Question");
// const Map = require("../models/Map");

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const testRoute = require('./routes/testroute');

app.use('/test', testRoute);

const scoreRoute = require('./routes/leaderboard');

app.use('/score', scoreRoute);

const submitRoute = require('./routes/submit');

app.use('/submit', submitRoute);

// const portalRoute = require("./routes/portal");
// app.use("/portal", portalRoute);

app.get('/', (req, res) => {
  res.send('homepage');
});

mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
	  useCreateIndex: true,
    useUnifiedTopology: true,
  },
);

mongoose.connection
  .once('open', () => {
    console.log('Connection to mongoDB established');
  })
  .on('error', (err) => {
    console.log('Error connecting to mongoDB:', err);
  });

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: ({
      message: error.message,
    }),
  });
});

app.listen(3000, () => {
  console.log('server started');
});
