const express = require('express');

const router = express.Router();
const user = require('../models/User');

router.get('/all', async (req, res, next) => {
    try {
    const allUsers = await user.find({});
    allUsers.sort((a, b) => b.score - a.score);
    const responseJSON = allUsers.map(({ username, score }) => ({
        username,
        score,
    }));
    res.status(200).json(responseJSON);
    } catch (e) {
    console.log(e);
    res.status(500).json({
        error: e,
    });
}
});

module.exports = router;
