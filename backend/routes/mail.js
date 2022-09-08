const express = require('express');
const router = express.Router();

const mailCtrl = require('../controllers/mail');

router.post('/annonce', mailCtrl.annonce);
router.get('/destinataires', mailCtrl.listeDestinataires);

module.exports = router;