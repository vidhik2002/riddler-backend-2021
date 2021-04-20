const express = require("express");
const router = express.Router();
const fs = require("fs");
const user = require("../models/User");
const map = require("../models/Map");
const question = require("../models/Question");
const portalRoute = require("./portal");


//----------------------------Map Route-------------------------------
router.get("/", async (req,res) => {
    console.log("map route")
})
//----------------------------Map Route-------------------------------

module.exports = router;
