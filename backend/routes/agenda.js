const express = require('express');
const router = express.Router();

const agendaCtrl = require('../controllers/agenda');

router.get('/get', agendaCtrl.get);
router.post('/add', agendaCtrl.add);
router.post('/modify', agendaCtrl.modify);
router.post('/remove', agendaCtrl.remove);

module.exports = router;