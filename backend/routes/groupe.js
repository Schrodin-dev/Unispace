const express = require('express');
const router = express.Router();

const groupeCtrl = require('../controllers/groupe');

router.post('/recupererEdt', groupeCtrl.recupererEdt);
router.post('/ajouter', groupeCtrl.creerGroupe);
router.post('/modifierICal', groupeCtrl.modifierLienICal);
router.post('/supprimer', groupeCtrl.supprimerGroupe);

module.exports = router;