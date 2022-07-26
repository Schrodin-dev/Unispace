const express = require('express');
const router = express.Router();

const travailAFaireCtl = require('../controllers/travailAFaire');

router.post('/ajouter', travailAFaireCtl.ajouterTravailAFaire);

module.exports = router;