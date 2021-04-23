const express = require('express');

const router = express.Router();
const user = require('../models/User');
const question = require('../models/Question');
const map = require('../models/Map');

// ------------------------------------Test Route--------------------------------------
router.get('/', (req, res) => {
  res.redirect('/map');
});

router.get('/test1', (req, res) => {
  const penaltyPoints = req.flash('points');
  console.log(penaltyPoints);
});

router.post('/send', async (req, res) => {
  try {
    console.log(req.body);
    const resp = await user.create(req.body);
    res.send(resp);
  } catch (e) {
    console.log(e);
  }
});

router.post('/post1', async (req, res) => {
  try {
    console.log(req.body);
    const resp = await question.create(req.body);
    res.send(resp);
  } catch (e) {
    console.log(e);
  }
});

router.post('/post2', async (req, res) => {
  try {
    console.log(req.body);
    const resp = await map.create(req.body);
    res.send(resp);
  } catch (e) {
    console.log(e);
  }
});
// ------------------------------------Test Route-------------------------------------------------

module.exports = router;
