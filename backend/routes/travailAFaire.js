const express = require('express');
const router = express.Router();

const travailAFaireCtl = require('../controllers/travailAFaire');

router.post('/ajouter', travailAFaireCtl.ajouterTravailAFaire);
router.post('/supprimer', travailAFaireCtl.supprimerTravailAFaire);
router.post('/modifier', travailAFaireCtl.modifierTravailAFaire);
router.post('/afficherEmbed', travailAFaireCtl.recupererEmbed);
router.post('/afficher', travailAFaireCtl.afficher);
router.post('/document/ajouter', travailAFaireCtl.ajouterDocument);
router.post('/document/supprimer', travailAFaireCtl.supprimerDocument);

module.exports = router;