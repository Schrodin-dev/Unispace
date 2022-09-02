const express = require('express');
const router = express.Router();

const groupeCtrl = require('../controllers/groupe');

router.post('/recupererEdt', groupeCtrl.recupererEdt);
router.post('/ajouter', groupeCtrl.creerGroupe);
router.post('/modifierICal', groupeCtrl.modifierLienICal);
router.post('/supprimer', groupeCtrl.supprimerGroupe);
router.get('/listeCours', groupeCtrl.recupererListeCours);
router.get('/detailGroupes', groupeCtrl.detailGroupes); //cette méthode n'est pas très explicite, mais elle permet d'affiche les classes de chaque année univ ainsi que les groupes de chaque classe.

module.exports = router;