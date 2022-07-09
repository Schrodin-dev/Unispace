const express = require('express');
const router = express.Router();

const groupeCtrl = require('../controllers/groupe');

router.get('/recupererEdt', groupeCtrl.recupererEdt);

module.exports = router;