const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");


//------------------------Starting Node route----------------------------------------------
router.get("/", async(req,res) =>{
    const quesId = 37
    const uname = "Addi"
    const ans = ["yes"]
    let result = await question.findOne({ questionId: quesId });
    let nodeInfo = await map.findOne({ username: uname });
    const player = await user.findOne({ username: uname });

    function readfile(fileName) {
        return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
        });
    }
    let obj = JSON.parse(await readfile("./models/questions.json"));
    let r = obj[quesId.toString()].starting;
    let o = obj[quesId.toString()].otherPortal;
    console.log(r)

    if (result.answer[0].includes(ans[0])){
        console.log("entered loop")
        for (var i = 0; i < o.length; i++) {
        nodeInfo.lockedNodes.push(o[i]);
        }
    nodeInfo.currentNode = r[0]
    nodeInfo.startingNode = quesId
    nodeInfo.save()
    }else{
        res.redirect("/map")
    }


})

//------------------------Starting Node route----------------------------------------------

module.exports = router;
