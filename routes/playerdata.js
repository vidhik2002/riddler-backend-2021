const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const ques = require("../models/Question");
const { logger } = require("../logs/logger");

router.get("/",async (req, res) => {
  try {
      const { username } = req.participant;
        const player = await user.findOne({ username: username });
        res.json(
          player
        )
    } catch (e) {
      res.status(500).json({
        error: e,
      });
      logger.error(`${e}`);
    }
});
module.exports = router;
