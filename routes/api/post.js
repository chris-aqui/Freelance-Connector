/* eslint-disable eol-last */

const express = require('express');

const router = express.Router();

// @router  GET to /api/users/post
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

module.exports = router;