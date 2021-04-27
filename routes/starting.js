const express = require('express');

const router = express.Router();
const fs = require('fs');
const user = require('../models/User');
const map = require('../models/Map');
const question = require('../models/Question');

// ------------------------Starting Node route----------------------------------------------
router.get('/', async (req, res) => {
    const { quesId } = req.body;
    const { uname } = req.body;// as a string
    const { ans } = req.body; // as a string in a list
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
    const obj = JSON.parse(await readfile('./models/questions.json'));
    const r = obj[quesId.toString()].starting;
    
    var starting=[37,38,39]
    if(starting.includes(quesId))
    {
        nodeInfo.unlockedNodes.push(quesId)
    }
    if(nodeInfo.unlockedNodes.includes(quesId))
    {
        if (result.answer[0].includes(ans[0])) {

            nodeInfo.currentNode = r[0];
            nodeInfo.startingNode = quesId;
            player.currentPosition = quesId;
            player.save();
            nodeInfo.save();
        } else {
            res.redirect('/map');
        }
    }else{
        res.json({
        message: "node not unlocked",
        });
    }
});

// ------------------------Starting Node route----------------------------------------------

module.exports = router;
