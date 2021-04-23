const express = require('express');

const router = express.Router();
const fs = require('fs');
const user = require('../models/User');
const map = require('../models/Map');
const question = require('../models/Question');

// -----------------------Recursive route-----------------------------------------------------
router.get('/', async (req, res) => {
  const { quesId } = req.body;
  const { uname } = req.body; // as a string
  const { ans } = req.body;// as a string in list
  const result = await question.findOne({ questionId: quesId });
  const nodeInfo = await map.findOne({ username: uname });
  const player = await user.findOne({ username: uname });
  function readfile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  nodeInfo.unlockedNodes = [];
  const isChecked = [];
  player.lockedNode = quesId;
  player.save();

  if (result.answer[0].includes(ans[0])) {
    if (nodeInfo.solvedNodes.includes(quesId)) {
      res.json({
        message: 'already solved',
      });
      return;
    }
    if (!nodeInfo.unlockedNode.includes(quesId)) {
      console.log('not unlocked node');
      res.redirect('/map');
    }
    if (nodeInfo.isBridge === true) {
      player.score += result.points - 10; // assuming points for a bridge node is 10 less than that of a normal node
    } else {
      player.score += result.points;
    }
    nodeInfo.solvedNodes.push(quesId);
    async function recursion(quesId) {
      const obj = JSON.parse(await readfile('./models/questions.json'));

      if (result.isPortal === true) {
        if (result.answer[0].includes(ans[0]) && result.answer[1].includes(ans[1])) {
          console.log('both correct ans');
          console.log(quesId);
          const p = obj[quesId.toString()].portal;
          console.log(p);
          async function gotoPortal(quesId) {
            for (let i = 0; i < p.length; i++) {
              if (isChecked.includes(p[i])) {
                console.log(`already checked${p[i]}`);
              } else if (!nodeInfo.solvedNodes.includes(p[i])) {
                console.log(`unlocked${p[i]}`);
                nodeInfo.unlockedNodes.push(p[i]);
                isChecked.push(p[i]);
              } else if (nodeInfo.solvedNodes.includes(p[i])) {
                console.log(`solved${p[i]}`);
                isChecked.push(p[i]);
              } else {
                console.log(`${p[i]}couldnot be processed`);
              }
            }
          }
          await gotoPortal(quesId);
          console.log('end of portal recursion');
        }
      }

      const q = obj[quesId.toString()].adjacent;

      for (let i = 0; i < q.length; i++) {
        console.log(q[i]);
        if (isChecked.includes(q[i])) {
          console.log(`already checked${q[i]}`);
        } else if (!nodeInfo.solvedNodes.includes(q[i])) {
          console.log(`unlocked${q[i]}`);
          nodeInfo.unlockedNodes.push(q[i]);
          isChecked.push(q[i]);
        } else if (nodeInfo.solvedNodes.includes(q[i])) {
          console.log(`solved${q[i]}`);
          isChecked.push(q[i]);
          await recursion(q[i]);
        } else {
          console.log(`${q[i]}couldnot be processed`);
        }
      }
    }
    await recursion(nodeInfo.currentNode);
    console.log('hi, end of recursion');
    console.log(isChecked);
    nodeInfo.currentNode = quesId;
    console.log(`current node${quesId}`);
    nodeInfo.save();
    res.json({
      message: nodeInfo.unlockedNodes,
    });
  } else {
    res.redirect('/map');
  }
});

// ------------------Recursive Route-------------------------------------

module.exports = router;
