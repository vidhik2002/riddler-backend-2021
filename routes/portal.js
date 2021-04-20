const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");


router.get("/portal", async (req, res) => {
    const result = req.body.result
    //if(result.questionId.includes(solvedNodes)){
    if (result.answer[1].includes(ans[1])) {

    const { nodeOpen } = req.body;
    const nodeInfo = await map.findOne({ username: uname });
    const player = await user.findOne({ username: uname });
    const x = nodeInfo.solvedNodes.includes(nodeOpen);
    if (x) {
    res.json({
        message: "already solved",
    });
    return;
    }

    nodeInfo.solvedNodes.push(nodeOpen);
    let obj;
    fs.readFile("./models/questions.json", "utf8", (err, data) => {
    console.log(err)
    if (err) throw err;
    console.log("here")
    obj = JSON.parse(data);
    const q = obj[nodeOpen.toString()].adjacent;
    const qw = nodeInfo.unlockedNodes.concat(q);
    console.log(q, qw);
    nodeInfo.unlockedNodes = qw;
    nodeInfo.unlockedNodes = nodeInfo.unlockedNodes.filter(
        (n) => !nodeInfo.solvedNodes.includes(n)
    );

    nodeInfo.currentNode = nodeOpen;
    nodeInfo.save();
    });

    player.currentPosition = nodeOpen;
    player.save();
    res.json(result);
}else{
    res.redirect("#")
}
});

module.exports = router;
