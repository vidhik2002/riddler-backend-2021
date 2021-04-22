const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bp = require('body-parser');
const rateLimit = require("express-rate-limit");
const cors = require("cors");
var cron = require("node-cron");

require('dotenv/config');

app.use(cors());
app.set("trust proxy", true);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const testRoute = require('./routes/testroute');
app.use('/test', testRoute);

const scoreRoute = require('./routes/leaderboard');
app.use('/score', scoreRoute);

const submitRoute = require('./routes/submit');
app.use('/submit', submitRoute, apiLimiter);

const startingRoute = require("./routes/starting");
app.use("/starting", startingRoute);

const mapRoute = require("./routes/mapdisplay");
app.use("/map", mapRoute);

const penaltyRoute = require("./routes/penalty");
app.use("/penalty", penaltyRoute);

app.get('/', (req, res) => {
  res.send('homepage');
});

// to update penalty points every 12 hours
app.get("/counter", (req, res) => {
  cron.schedule("0 */12 * * *", () => {
    player.currentPenaltyPoints = 20;
  });
  console.log("penalty");
});


  
//Connection to the database
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
