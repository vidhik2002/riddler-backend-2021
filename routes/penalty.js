const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");



//------------------------------Penalty Route----------------------------------------
router.get("/", async (req, res) => {
    console.log("penalty route");
    const newquesId = 37;
    const uname = "Addi";
    const ans = ["yes"];
    let result = await question.findOne({ questionId: quesId });
    let nodeInfo = await map.findOne({ username: uname });
    const player = await user.findOne({ username: uname });

    if(newquesId !== player.lockedNode){
    if(!nodeInfo.unlockedNodes.includes(quesId))
    {   let penaltyPoints = player.currentPenaltyPoints
        const { condition } = req.body  
        if (condition === true) //user can move to another unlocked node using their penalty points
        {
            if(penaltyPoints != 0)
            {
                penaltyPoints -= 10
                nodeInfo.unlockedNodes.push(newquesId)
                nodeInfo.currentNode = newquesId
                player.lockedNode = newquesId
                nodeInfo.save()
            }else{
                res.json({
                message: "penalty points over",
                });
                return;
            }
        }else{
            res.json({
            message: "node locked, use penalty points to unlock",
            });
            return;
        }


    }else if(nodeInfo.lockedNodes.includes(newquesId)){
        res.json({
        message: "node locked",
        });
        return;
    }else if(nodeInfo.solvedNodes.includes(newquesId)){
        res.json({
        message: "node already solved",
        });
        return;
    }
    }
});
//------------------------------Penalty Route----------------------------------------

module.exports = router;