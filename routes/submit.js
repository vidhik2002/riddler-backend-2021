const express = require("express");

const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { authUserSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");
const {
  error_codes,
  logical_errors,
  success_codes,
} = require("../tools/error_codes");

router.post("/", validator.body(authUserSchema), async (req, res) => {
  try {
    const { quesId } = req.body;
    const { username } = req.participant;
    const { answer } = req.body; // as a string in list

    const result = await question.findOne({ questionId: quesId });
    const nodeInfo = await map.findOne({ username: username });
    const player = await user.findOne({ username: username });

    if (!result || !nodeInfo || !player) {
      logger.error(error_codes.E3);
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
          logger.info(obj[quesId.toString()].portal);
        } else if (
          nodeInfo.portalNodes[quesId.toString()].ans.length === 1 &&
          !nodeInfo.unlockedNodes.includes(quesId)
        ) {
          nodeInfo.unlockedNodes.push(quesId);
        }
      }
      for (let i = 0; i < q.length; i++) {
        logger.info(q[i]);
        if (checked.includes(q[i])) {
          logger.info(`already checked${q[i]}`);
        } else if (!nodeInfo.solvedNodes.includes(q[i])) {
          logger.info(`unlocked${q[i]}`);
          nodeInfo.unlockedNodes.push(q[i]);
          checked.push(q[i]);
        } else if (nodeInfo.solvedNodes.includes(q[i])) {
          logger.info(`solved${q[i]}`);
          checked.push(q[i]);
          await recursion(q[i]);
        } else {
          logger.info(`${q[i]}couldnot be processed`);
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
      logger.error(logical_errors.L3);
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
      logger.error(logical_errors.L7);
      return res.json({
        code: "L7",
      });
    } else if (result.answer.includes(answer)) {
      if (!nodeInfo.solvedNodes.includes(quesId)) {
        nodeInfo.solvedNodes.push(quesId);
      }
      if (
        result.isPortal &&
        !nodeInfo.portalNodes[quesId.toString()].ans.includes(answer)
      ) {
        nodeInfo.portalNodes[quesId.toString()].ans.push(answer);
      }

      switch (result.pointType) {
        case 1:
          player.score += process.env.NORMAL_QUES_POINTS
          break;
        case 2:
          player.score += process.env.PORTAL_QUES_POINTS
          break;
        case 3:
          player.score += process.env.BRIDGE_QUES_POINTS
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
          nodeInfo.save()
          logger.warn(success_codes.S0);
          return res.json({
            code: "S0",
          });
        }
      }
      nodeInfo.save();
      player.currentTrack = result.track;
      player.save();
      logger.warn(success_codes.S2);
      return res.json({
        code: "S2",
      });
    } else {
      logger.error(logical_errors.L8);
      return res.json({
        code: "L8",
      });
    }
  } catch (e) {
    logger.error(error_codes.E0);
    return res.status(500).json({
      code: "E0",
      error: e,
    });
  }
});

module.exports = router;
