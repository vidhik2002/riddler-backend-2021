const express = require('express');

const router = express.Router();
const fs = require('fs');
const user = require('../models/User');
const map = require('../models/Map');
const question = require('../models/Question');
const portalRoute = require('./portal');

router.get('/node', async (req, res) => {
    const { ans } = req.body;
    const { uname } = req.body;
    const quesId = req.body.qId;
    const result = await question.findOne({ questionId: quesId });
    const nodeInfo = await map.findOne({ username: uname });
    const player = await user.findOne({ username: uname });

    if (result.answer[0].includes(ans[0])) {
    const x = nodeInfo.solvedNodes.includes(quesId);
    if (x) {
        res.json({
        message: 'already solved',
        });
        return;
    }
    player.score += result.points;
    nodeInfo.solvedNodes.push(quesId);
    let obj;
    fs.readFile('./models/questions.json', 'utf8', (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    const q = obj[quesId.toString()].adjacent;
    const qw = nodeInfo.unlockedNodes.concat(q);
    console.log(q, qw);
    nodeInfo.unlockedNodes = qw;
    nodeInfo.unlockedNodes = nodeInfo.unlockedNodes.filter(
        (n) => !nodeInfo.solvedNodes.includes(n),
    );

    nodeInfo.currentNode = quesId;
    nodeInfo.save();
    
    if (result.isPortal === true) {
        res.url = "/portal"
        // router.use("/portal",portalRoute)
        // res.status(200).send({
        //     message: "portal question unlocked, choose a portal or continue in this biome",
        //     isUnlocked: true
        
        } else {
        res.redirect('#');
        }
    
    });

    player.currentPosition = quesId;
    player.save();
    res.json(result);
    } else {
    res.redirect('#');
}
});

module.exports = router;
