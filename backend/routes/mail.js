const express = require('express');
const router = express.Router();

const mailCtrl = require('../controllers/mail');

router.post('/annonce', mailCtrl.annonce);

module.exports = router;