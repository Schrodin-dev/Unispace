const express = require('express');
const router = express.Router();

const notesCtrl = require('../controllers/notes');

router.post('/', notesCtrl.postNotes);
router.get('/', notesCtrl.getNotes);

module.exports = router;