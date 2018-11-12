/* eslint-disable eol-last */
// auth for user

const express = require('express');

const router = express.Router();

// rout /api/users/test is not needed. only test as api/users is used in server.
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

module.exports = router;