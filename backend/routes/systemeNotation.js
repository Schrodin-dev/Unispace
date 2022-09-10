const express = require('express');
const router = express.Router();

const systemeNotationCtrl = require('../controllers/systemeNotation');

router.post('/UE/ajouter', systemeNotationCtrl.ajouterUE);
router.post('/UE/supprimer', systemeNotationCtrl.supprimerUE);
router.get('/UE/recuperer', systemeNotationCtrl.recupererUE);

router.post('/ressource/ajouter', systemeNotationCtrl.ajouterRessource);
router.post('/ressource/supprimer', systemeNotationCtrl.supprimerRessource);
router.get('/ressource/recuperer', systemeNotationCtrl.recupererRessource);

router.post('/ressourceUE/lier', systemeNotationCtrl.lierRessourceUE);
router.post('/ressourceUE/modifierCoeff', systemeNotationCtrl.modifierCoeffRessourceUE);
router.post('/ressourceUE/supprimer', systemeNotationCtrl.supprimerLienRessourceUE);
router.get('/ressourceUE/listeParcours', systemeNotationCtrl.listeParcours);
router.post('/ressourceUE/afficher', systemeNotationCtrl.afficherRessourcesUE);

router.post('/devoir/ajouter', systemeNotationCtrl.ajouterDevoir);
router.post('/devoir/modifier', systemeNotationCtrl.modifierDevoir);
router.post('/devoir/supprimer', systemeNotationCtrl.supprimerDevoir);

router.post('/note/ajouter', systemeNotationCtrl.ajouterNote);
router.post('/note/modifier', systemeNotationCtrl.modifierNote);
router.post('/note/supprimer', systemeNotationCtrl.supprimerNote);

router.get('/detail', systemeNotationCtrl.detailDesNotes);
router.get('/dernieresNotes', systemeNotationCtrl.dernieresNotes);

router.get('/parcours/afficher', systemeNotationCtrl.listeParcours);
router.post('/parcours/ajouter', systemeNotationCtrl.ajouterParcours);
router.post('/parcours/supprimer', systemeNotationCtrl.supprimerParcours);

module.exports = router;