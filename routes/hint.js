const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { authPenaltySchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});

// ------------------------------Penalty Route----------------------------------------
router.post("/", async (req, res) => {
    const { quesId } = req.body;
    const { username } = req.body;
    const nodeInfo = await map.findOne({ username: username });
    const player = await user.findOne({ username: username });
    const result = await question.findOne({ questionId: quesId });
    
    if(quesId === nodeInfo.lockedNode){
        if(result.isHint == false){
            if(player.score >= 5){
                player.score -= 5 //assuming 5 points are reduced in using a hint
                result.isHint = true
                console.log(result.isHint);
                res.json({
                    "hint": result.hint
                })
                player.save()
                result.save()
            }else{
                res.json({
                    "message": "not enough points"
                })
            }
        }else{
            res.json({
                hint: result.hint,
            });
        }
    }else{
        res.json({
            message : "current node not locked"
        })
    }

})
module.exports = router;