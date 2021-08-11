const express = require("express");

const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { authUserSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});

router.get('/',validator.body(authUserSchema), async (req, res) => {
    const { quesId } = req.body;
    const { username } = req.body; // as a string
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

    if(quesId === nodeInfo.lockedNode){
        if(answer[0] === result.answer[0]){
            res.json({
                message: "answer correct"
            })
            const obj = JSON.parse(await readfile("./models/questions.json"));
            const p = obj[quesId.toString()].adjacent;
            
                nodeInfo.solvedNodes.push(quesId)
                //not starting node 37,38,39
                if(result.isStarting === false){
                    for (let i = 0; i < p.length; i++) {
                        nodeInfo.unlockedNodes.push(p[i]);
                    }
                }else{
                    console.log("starting node")
                    
                    var starting = [37, 38, 39];
                    starting.map((id) => {
                        if (id != quesId) {
                        nodeInfo.unlockedNodes.pop(id);
                        }
                    });
                    nodeInfo.unlockedNodes.pop(quesId);
                    for (let i = 0; i < p.length; i++) {
                        nodeInfo.unlockedNodes.push(p[i]);
                    }
                    console.log(nodeInfo.unlockedNodes);
                }
            
                player.score += result.points; //irrespective of being bridge question or not
                nodeInfo.save();
                player.save();
            
        }else{
            res.json({
                message: "answer not correct"
            })
        }
    } else {
        res.json({
            message: "the current question is not locked"
        })
    }
});
module.exports = router;
