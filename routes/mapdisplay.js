const express = require('express');

const router = express.Router();
const map = require("../models/GameState");

// ----------------------------Map Route-------------------------------
router.get('/', async (req, res) => {
    console.log('map route');
    const { username } = req.body;
    
    try {
        const nodeInfo = await map.findOne({ username: username });
        res.json({
            "player": nodeInfo
        })
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
});
// ----------------------------Map Route-------------------------------

module.exports = router;
