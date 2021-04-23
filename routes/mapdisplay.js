const express = require('express');

const router = express.Router();

// ----------------------------Map Route-------------------------------
router.get('/', async (req, res) => {
  console.log('map route');
});
// ----------------------------Map Route-------------------------------

module.exports = router;
