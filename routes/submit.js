const express = require("express");

const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { authUserSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});

router.post("/", validator.body(authUserSchema), async (req, res) => {
  const { quesId } = req.body;
  const { username } = req.participant;
  const { answer } = req.body; // as a string in list

  const result = await question.findOne({ questionId: quesId });
  const nodeInfo = await map.findOne({ username: username });
  const player = await user.findOne({ username: username });

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
        console.log(obj[quesId.toString()].portal);
      } else if (
        nodeInfo.portalNodes[quesId.toString()].ans.length === 1 &&
        !nodeInfo.unlockedNodes.includes(quesId)
      ) {
        nodeInfo.unlockedNodes.push(quesId);
      }
    }
    for (let i = 0; i < q.length; i++) {
      console.log(q[i]);
      if (checked.includes(q[i])) {
        console.log(`already checked${q[i]}`);
      } else if (!nodeInfo.solvedNodes.includes(q[i])) {
        console.log(`unlocked${q[i]}`);
        nodeInfo.unlockedNodes.push(q[i]);
        checked.push(q[i]);
      } else if (nodeInfo.solvedNodes.includes(q[i])) {
        console.log(`solved${q[i]}`);
        checked.push(q[i]);
        await recursion(q[i]);
      } else {
        console.log(`${q[i]}couldnot be processed`);
      }
    }
  }

  if (
    quesId === nodeInfo.lockedNode ||
    (result.isStarting && nodeInfo.solvedNodes.length === 0) ||
    nodeInfo.solvedNodes.includes(quesId)
  ) {
    if (
      (nodeInfo.solvedNodes.includes(quesId) && !result.isPortal) ||
      (result.isPortal &&
        (nodeInfo.portalNodes[quesId.toString()].ans.length === 2 ||
          nodeInfo.portalNodes[quesId.toString()].ans.includes(answer[0])))
    ) {
      res.json({
        code: "L7",
      });
    } else if (result.answer.includes(answer[0])) {
      if (!nodeInfo.solvedNodes.includes(quesId)) {
        nodeInfo.solvedNodes.push(quesId);
      }
      if (
        result.isPortal &&
        !nodeInfo.portalNodes[quesId.toString()].ans.includes(answer[0])
      ) {
        nodeInfo.portalNodes[quesId.toString()].ans.push(answer[0]);
      }
      player.score += result.points; //irrespective of being bridge question or not
      nodeInfo.unlockedNodes = [];
      if (
        !(
          result.isPortal &&
          nodeInfo.portalNodes[quesId.toString()].ans.length === 2
        )
      ) {
        nodeInfo.lockedNode = 0;
      }
      player.save();
      await recursion(quesId);
      nodeInfo.save();

      res.json({
        code: "S2",
      });
    } else {
      res.json({
        code: "L8",
      });
    }
  } else {
    res.json({
      code: "L3",
    });
  }
});
module.exports = router;
