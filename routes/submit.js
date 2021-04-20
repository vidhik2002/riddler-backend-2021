const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");
const portalRoute = require("./portal");


//-----------------------Recursive route-----------------------------------------------------

router.get("/", async(req,res) => {
  const quesId = 2
  const uname = "Addi"
  const ans = ["false"];
  let result = await question.findOne({ questionId: quesId });
  let nodeInfo = await map.findOne({ username: uname });
  let player = await user.findOne({ username: uname });
  function readfile(fileName){
    return new Promise((resolve,reject) => {
      fs.readFile(fileName, "utf8",(err, data) => {
        if(err)
          reject(err)
        else
          resolve(data)
      })
    })
  }

  nodeInfo.unlockedNodes = [];
  var isChecked=[]
  //let quesId = nodeInfo.currentNode

  if (result.answer[0].includes(ans[0])) {
    const x = nodeInfo.solvedNodes.includes(quesId);
    if (x) {
      res.json({
        message: "already solved",
      });
      return;
    }
    player.score += result.points;
    nodeInfo.solvedNodes.push(quesId);
    async function recursion(quesId) {
        //console.log("currentNode "+ quesId);
        let obj = JSON.parse(await readfile("./models/questions.json"));
        
        if(result.isPortal === true)
          {
            if(result.answer[0].includes(ans[0]) && result.answer[1].includes(ans[1]))
            {
              console.log("both correct ans")
              console.log(quesId)
              let obj = JSON.parse(await readfile("./models/questions.json"));
              let p = obj[quesId.toString()].portal;
              console.log(p);
              async function gotoPortal(quesId) {
                
                
                for (var i = 0; i < p.length; i++) {
                  if (isChecked.includes(p[i])) {
                    console.log("already checked" + p[i]);
                  } else if (!nodeInfo.solvedNodes.includes(p[i])) {
                    console.log("unlocked" + p[i]);
                    nodeInfo.unlockedNodes.push(p[i]);
                    isChecked.push(p[i]);
                  } else if (nodeInfo.solvedNodes.includes(p[i])) {
                    console.log("solved" + p[i]);
                    isChecked.push(p[i]);
                  } else {
                    console.log(p[i] + "couldnot be processed");
                  }
                }
              }
              await gotoPortal(quesId);
              console.log("end of portal recursion")
            }
          }
        
        const q = obj[quesId.toString()].adjacent;

        for (var i = 0; i < q.length; i++) {
          console.log(q[i]);
          if (isChecked.includes(q[i])) {
            console.log("already checked"+q[i])
            //return;
          }
          else if (!nodeInfo.solvedNodes.includes(q[i])) {
            console.log("unlocked"+q[i])
            nodeInfo.unlockedNodes.push(q[i]);
            isChecked.push(q[i]);
            //return;
          } else if (nodeInfo.solvedNodes.includes(q[i])) {
            console.log("solved"+q[i])
            isChecked.push(q[i]);
            await recursion(q[i]);
          }else{
            console.log(q[i]+"couldnot be processed")
            //return ;
          }
        }
    }
    await recursion(nodeInfo.currentNode);
    console.log("hi, end of recursion")
    console.log(isChecked)
    nodeInfo.currentNode = quesId
    console.log("current node" +quesId)
    nodeInfo.save();
    res.json({
      message: nodeInfo.unlockedNodes
    })
    if(!nodeInfo.currentNode.includes(quesId))
    {
      console.log("not unlocked node")
      res.redirect("/map")
    }
  }else{
    res.redirect("/map")
  }
})

//------------------Recursive Route-------------------------------------


module.exports = router;










