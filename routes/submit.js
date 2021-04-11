const express = require("express");
const router = express.Router();
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");
const fs = require('fs')

router.get("/addi", async (req, res) => {
    console.log(req.body)
    const ans = req.body.ans;
    const uname = req.body.uname;
    const quesId = req.body.qId;
    const result = await question.findOne({ questionId: quesId });
    let nodeInfo = await map.findOne({ username: uname})
    let player = await user.findOne({username: uname})
    
    if(result.answer.includes(ans)){
        
        
        player.score += result.points 
        let x = nodeInfo.solvedNodes.includes(quesId)
        if(x){
            res.json({
                message:"already solved"
            })
            return;
        }else{
            nodeInfo.solvedNodes.push(quesId)
            let obj;
            fs.readFile(
                "./models/questions.json",
                "utf8",
                function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);
                    let q = obj[quesId.toString()].adjacent;
                    let qw = nodeInfo.unlockedNodes.concat(q);
                    console.log(
                        q,
                        qw
                    );
                    nodeInfo.unlockedNodes = qw;
                    nodeInfo.unlockedNodes =
                        nodeInfo.unlockedNodes.filter(
                            (n) => !nodeInfo.solvedNodes.includes(n)
                        )
                    
                    
                    nodeInfo.currentNode = quesId
                    nodeInfo.save();
                
                }
            );
        }
        
        player.currentPosition = quesId
        player.save()
        console.log(result.points)
        console.log("true")
        res.json(result)
    }else{
        res.redirect("#")
        console.log("false")
    }
});

module.exports = router;
