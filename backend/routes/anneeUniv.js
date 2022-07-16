const express = require('express');
const router = express.Router();

const anneeUnivCtrl = require('../controllers/anneeUniv');

router.post('/ajouter', anneeUnivCtrl.creerAnneeUniv);
router.post('/supprimer', anneeUnivCtrl.supprimerAnneeUniv);

module.exports = router;