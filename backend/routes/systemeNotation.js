const express = require('express');
const router = express.Router();

const systemeNotationCtrl = require('../controllers/systemeNotation');

router.post('/UE/ajouter', systemeNotationCtrl.ajouterUE);
router.post('/UE/supprimer', systemeNotationCtrl.supprimerUE);
router.post('/ressource/ajouter', systemeNotationCtrl.ajouterRessource);
router.post('/ressource/supprimer', systemeNotationCtrl.supprimerRessource);
router.post('/devoir/ajouter', systemeNotationCtrl.ajouterDevoir);
router.post('/devoir/supprimer', systemeNotationCtrl.supprimerDevoir);
router.post('/note/ajouter', systemeNotationCtrl.ajouterNote);
router.post('/note/modifier', systemeNotationCtrl.modifierNote);
router.post('/note/supprimer', systemeNotationCtrl.supprimerNote);
router.get('/detail', systemeNotationCtrl.detailDesNotes);

module.exports = router;