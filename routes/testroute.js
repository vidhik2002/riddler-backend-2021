const express = require("express");

const router = express.Router();
const user = require("../models/User");
const question = require("../models/Question");
const map = require("../models/GameState");

// ------------------------------------Test Route--------------------------------------
router.get("/", (req, res) => {
  res.redirect("/map");
});

router.get("/test1", (req, res) => {
  const penaltyPoints = req.flash("points");
  console.log(penaltyPoints);
});

router.post("/send", async (req, res) => {
  try {
    console.log(req.body);
    const resp = await user.create(req.body);
    res.send(resp);
  } catch (e) {
    console.log(e);
  }
});

router.post("/post1", async (req, res) => {
  try {
    const { quesId } = req.body;
    const { username } = req.body; // as a string
    const { answer } = req.body; // as a string in list

    const result = await question.findOne({ questionId: quesId });
    const nodeInfo = await map.findOne({ username: username });
    const player = await user.findOne({ username: username });

    console.log(nodeInfo.portalNodes['9'])
    res.send('lol');
  } catch (e) {
    console.log(e);
  }
});

router.post("/post2", async (req, res) => {
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
