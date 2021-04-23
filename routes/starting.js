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
    const o = obj[quesId.toString()].otherPortal;

    if (result.answer[0].includes(ans[0])) {
        console.log('entered loop');
        for (let i = 0; i < o.length; i++) {
            nodeInfo.lockedNodes.push(o[i]);
        }
        nodeInfo.currentNode = r[0];
        nodeInfo.startingNode = quesId;
        player.currentPosition = quesId;
        player.save();
        nodeInfo.save();
    } else {
        res.redirect('/map');
    }
});

// ------------------------Starting Node route----------------------------------------------

module.exports = router;
