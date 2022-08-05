const express = require('express');
const router = express.Router();

const travailDeGroupeCtrl = require('../controllers/travailDeGroupe');

router.post('/ajouter', travailDeGroupeCtrl.creerTravail);
router.post('/supprimer', travailDeGroupeCtrl.supprimerTravail);

module.exports = router;