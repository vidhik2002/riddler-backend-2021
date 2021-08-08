const express = require("express");

const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");
const { authUserSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});

// ------------------------Starting Node route----------------------------------------------
router.post("/", validator.body(authUserSchema), async (req, res) => {
  const { quesId } = req.body; // as a number
  const { uname } = req.body; // as a string
  // const { ans } = req.body; // as a string in a list

  // const result = await question.findOne({ questionId: quesId });
  const nodeInfo = await map.findOne({ username: uname });
  const player = await user.findOne({ username: uname });

  // function readfile(fileName) {
  //   return new Promise((resolve, reject) => {
  //     fs.readFile(fileName, "utf8", (err, data) => {
  //       if (err) reject(err);
  //       else resolve(data);
  //     });
  //   });
  // }

    // const obj = JSON.parse(await readfile("./models/questions.json"));
    // const r = obj[quesId.toString()].starting;
    var starting = [37, 38, 39];

    // if (starting.includes(quesId)) {
    //   nodeInfo.unlockedNodes.push(quesId);
    // }
    if (starting.includes(quesId)) {
        nodeInfo.currentNode = quesId;
        nodeInfo.startingNode = quesId;
        nodeInfo.unlockedNodes.push(quesId);
        // nodeInfo.unlockedNodes = nodeInfo.unlockedNodes.filter(id => id!=quesId && !starting.includes(id))
        // nodeInfo.solvedNodes.push(quesId);
        starting.map(id => {
          if (id!=quesId) {
            nodeInfo.lockedNodes.push(id)
          }
        })
        // player.currentPosition = quesId;
        player.save();
        nodeInfo.save();
        res.json({
          message: "starting node chosen",
        });
      // } else {
      //   res.json({
      //     message: "answer not correct",
      //   });
      // }
      }else {
      res.json({
        message: "node not starting node",
      });
    }
});

// ------------------------Starting Node route----------------------------------------------

module.exports = router;
