const express = require('express');

const router = express.Router();
const user = require('../models/User');
const map = require('../models/Map');
const question = require('../models/Question');
const { authPenaltySchema } = require('../utils/validation_schema')
const validator = require("express-joi-validation").createValidator({});

// ------------------------------Penalty Route----------------------------------------
router.get('/',validator.body(authPenaltySchema), async (req, res) => {
    console.log('penalty route');
    const { newquesId } = req.body;
    const { uname } = req.body;
    const nodeInfo = await map.findOne({ username: uname });
    const player = await user.findOne({ username: uname });

    if (newquesId !== player.lockedNode) {
        if (!nodeInfo.unlockedNodes.includes(newquesId)) {
            let penaltyPoints = player.currentPenaltyPoints;
            const { condition } = req.body;
            if (condition === true) // user can move to another unlocked node using their penalty points
            {
                if (penaltyPoints !== 0) {
                    penaltyPoints -= 10;
                    nodeInfo.unlockedNodes.push(newquesId);
                    nodeInfo.currentNode = newquesId;
                    player.lockedNode = newquesId;
                    nodeInfo.save();
                } else {
                    res.json({
                        message: 'penalty points over',
                    });
                }
            } else {
                res.json({
                    message: 'node locked, use penalty points to unlock',
                });
            }
        } else if (nodeInfo.lockedNodes.includes(newquesId)) {
            res.json({
                message: 'node locked',
            });
        } else if (nodeInfo.solvedNodes.includes(newquesId)) {
            res.json({
                message: 'node already solved',
            });
        }
    }
});
// ------------------------------Penalty Route----------------------------------------

module.exports = router;
