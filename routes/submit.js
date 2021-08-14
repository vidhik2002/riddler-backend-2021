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

  // async function recursion(quesId) {
  //   const obj = JSON.parse(await readfile("./models/questions.json"));

  //   if (result.isPortal === true) {
  //     if (
  //       result.answer[0].includes(ans[0]) &&  // ask addi abt this
  //       result.answer[1].includes(ans[1])
  //     ) {
  //       console.log("both correct ans");
  //       console.log(quesId);
  //       const p = obj[quesId.toString()].portal;
  //       console.log(p);
  //       async function gotoPortal(quesId) {
  //         for (let i = 0; i < p.length; i++) {
  //           if (isChecked.includes(p[i])) {
  //             console.log(`already checked${p[i]}`);
  //           } else if (!nodeInfo.solvedNodes.includes(p[i])) {
  //             console.log(`unlocked${p[i]}`);
  //             nodeInfo.unlockedNodes.push(p[i]);
  //             isChecked.push(p[i]);
  //           } else if (nodeInfo.solvedNodes.includes(p[i])) {
  //             console.log(`solved${p[i]}`);
  //             isChecked.push(p[i]);
  //           } else {
  //             console.log(`${p[i]}couldnot be processed`);
  //           }
  //         }
  //       }
  //       await gotoPortal(quesId);
  //       console.log("end of portal recursion");
  //     }
  //   }

  //   const q = obj[quesId.toString()].adjacent;

  //   for (let i = 0; i < q.length; i++) {
  //     console.log(q[i]);
  //     if (isChecked.includes(q[i])) {
  //       console.log(`already checked${q[i]}`);
  //     } else if (!nodeInfo.solvedNodes.includes(q[i])) {
  //       console.log(`unlocked${q[i]}`);
  //       nodeInfo.unlockedNodes.push(q[i]);
  //       isChecked.push(q[i]);
  //     } else if (nodeInfo.solvedNodes.includes(q[i])) {
  //       console.log(`solved${q[i]}`);
  //       isChecked.push(q[i]);
  //       await recursion(q[i]);
  //     } else {
  //       console.log(`${q[i]}couldnot be processed`);
  //     }
  //   }
  // }

  let checked = [];

  async function recursion(quesId) {
    const obj = JSON.parse(await readfile("./models/questions.json"));
    const sawal = await question.findOne({ questionId: quesId });
    let q = obj[quesId.toString()].adjacent;
    if (sawal.isPortal && nodeInfo.portalNodes[quesId.toString()].ans.length === 2) {
      q.push(obj[quesId.toString()].portal[0])
      q.push(obj[quesId.toString()].portal[1])
      console.log(obj[quesId.toString()].portal)
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

  // if(!nodeInfo.solvedNodes.includes(quesId) || result.isPortal){

  if (quesId === nodeInfo.lockedNode || (result.isStarting && nodeInfo.solvedNodes.length === 0)) {
    if (
      (nodeInfo.solvedNodes.includes(quesId) && !result.isPortal) ||
      (result.isPortal && nodeInfo.portalNodes[quesId.toString()].ans.length === 2)
    ) {
      res.json({
        message: "node already solved",
      });
    } else if (result.answer.includes(answer[0])) {
      //not starting node 37,38,39
      // if(!result.isStarting){
      //     for (let i = 0; i < p.length; i++) {
      //         nodeInfo.unlockedNodes.push(p[i]);
      //     }
      // }else{
      //     console.log("starting node")

      //     var starting = [37, 38, 39];
      //     starting.map((id) => {
      //         if (id != quesId) {
      //         nodeInfo.unlockedNodes.pop(id);
      //         }
      //     });
      //     nodeInfo.unlockedNodes.pop(quesId);
      //     for (let i = 0; i < p.length; i++) {
      //         nodeInfo.unlockedNodes.push(p[i]);
      //     }
      //     console.log(nodeInfo.unlockedNodes);
      // }
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
      nodeInfo.unlockedNodes = []
      nodeInfo.lockedNode=0;
      player.save();
      await recursion(quesId);
      nodeInfo.save()
      
      res.json({
        message: "answer correct question solved"
      })

      //}
    } else {
      res.json({
        message: "answer not correct",
      });
    }
  } else {
    res.json({
      message: "the current question is not frozen",
    });
  }
  // }else{
  //     res.json({
  //         message: "the current question is already solved"
  //     })
  // }
});
module.exports = router;
