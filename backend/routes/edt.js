const express = require('express');
const router = express.Router();

const edtCtrl = require('../controllers/edt');

router.get('/', edtCtrl.getEdt);

module.exports = router;