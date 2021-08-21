const express = require("express");

const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const Milestone = require("../models/milestone");
const { authUserSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");
const {
  error_codes,
  logical_errors,
  success_codes,
} = require("../tools/error_codes");
const emailthingie = require("../utils/email");
let j = require("../models/track.json")["j"];
const { loggertracker } = require("../logs/tracker");
require("dotenv").config();

router.post("/", validator.body(authUserSchema), async (req, res) => {
  try {
    const { quesId } = req.body;
    const { username } = req.participant;
    const { answer } = req.body; // as a string in list

    const playerInfo = {
      username:username,
      questionID:quesId,
    }

    const result = await question.findOne({ questionId: quesId });
    const nodeInfo = await map.findOne({ username: username });
    const player = await user.findOne({ username: username });
    const milestone = await Milestone.findOne({ })

    if (!result || !nodeInfo || !player) {
      logger.error(error_codes.E3, playerInfo);
      return res.json({
        code: "E3",
      });
    }

    function readfile(fileName) {
      return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    }

    let checked = [];

    async function recursion(quesId) {
      const obj = JSON.parse(await readfile("./models/questions.json"));
      const sawal = await question.findOne({ questionId: quesId });
      let q = obj[quesId.toString()].adjacent;
      if (sawal.isPortal) {
        if (nodeInfo.portalNodes[quesId.toString()].ans.length === 2) {
          q.push(obj[quesId.toString()].portal[0]);
          q.push(obj[quesId.toString()].portal[1]);
        } else if (
          nodeInfo.portalNodes[quesId.toString()].ans.length === 1 &&
          !nodeInfo.unlockedNodes.includes(quesId)
        ) {
          nodeInfo.unlockedNodes.push(quesId);
        }
      }
      for (let i = 0; i < q.length; i++) {
        if (checked.includes(q[i])) {
        } else if (!nodeInfo.solvedNodes.includes(q[i])) {
          nodeInfo.unlockedNodes.push(q[i]);
          checked.push(q[i]);
        } else if (nodeInfo.solvedNodes.includes(q[i])) {
          checked.push(q[i]);
          await recursion(q[i]);
        } else {
          logger.info(`${q[i]}couldnot be processed`, playerInfo);
        }
      }
    }

    if (
      !(
        quesId === nodeInfo.lockedNode ||
        (result.isStarting && nodeInfo.solvedNodes.length === 0) ||
        nodeInfo.solvedNodes.includes(quesId)
      )
    ) {
      logger.info(logical_errors.L3);
      return res.json({
        code: "L3",
      });
    }
    if (
      (nodeInfo.solvedNodes.includes(quesId) && !result.isPortal) ||
      (result.isPortal &&
        (nodeInfo.portalNodes[quesId.toString()].ans.length === 2 ||
          nodeInfo.portalNodes[quesId.toString()].ans.includes(answer)))
    ) {
      logger.info(logical_errors.L7);
      return res.json({
        code: "L7",
      });
    } else if (result.answer.includes(answer)) {
      if (!nodeInfo.solvedNodes.includes(quesId)) {
        nodeInfo.solvedNodes.push(quesId);
        const test = { username: `${username}`, solvedQuestion: `${quesId}` };
        loggertracker.info("", test);
        //email
        if (nodeInfo.solvedNodes.length == milestone.milestone) { 
          // emailthingie(username, i);
          loggertracker.warn("milestone reached!!",{
            username,
            numberOfQuestions: milestone.milestone
          })
          milestone.milestone +=10
          milestone.save()
        }
      }
      if (
        result.isPortal &&
        !nodeInfo.portalNodes[quesId.toString()].ans.includes(answer)
      ) {
        nodeInfo.portalNodes[quesId.toString()].ans.push(answer);
      }

      switch (result.pointType) {
        case 1:
          player.score += 100;
          break;
        case 2:
          player.score += 50;
          break;
        case 3:
          player.score += 70;
          break;
        default:
          break;
      }

      nodeInfo.unlockedNodes = [];
      if (
        !(
          result.isPortal &&
          nodeInfo.portalNodes[quesId.toString()].ans.length === 2
        )
      ) {
        nodeInfo.lockedNode = 0;
      }

      await recursion(quesId);
      if (nodeInfo.unlockedNodes.length === 0) {
        if (!nodeInfo.solvedNodes.includes(40)) {
          nodeInfo.unlockedNodes.push(40);
        } else {
          nodeInfo.save();
          logger.warn(success_codes.S0, playerInfo);
          return res.json({
            code: "S0",
          });
        }
      }
      nodeInfo.save();
      player.currentTrack = result.track;
      player.lastSolve = new Date().getTime()
      player.save();
      logger.warn(success_codes.S2, playerInfo);
      return res.json({
        code: "S2",
      });
    } else {
      logger.info(logical_errors.L8);
      return res.json({
        code: "L8",
      });
    }
  } catch (e) {
    logger.error(error_codes.E0, playerInfo);
    return res.status(500).json({
      code: "E0",
      error: e,
    });
  }
});

module.exports = router;
