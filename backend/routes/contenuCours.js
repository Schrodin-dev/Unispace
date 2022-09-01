const express = require('express');
const router = express.Router();

const contenuCoursCtrl = require('../controllers/contenuCours');

router.post('/ajouter', contenuCoursCtrl.ajouterContenuCours);
router.post('/supprimer', contenuCoursCtrl.supprimerContenuCours);
router.post('/modifier', contenuCoursCtrl.modifierContenuCours);
router.post('/document/ajouter', contenuCoursCtrl.ajouterDocument);
router.post('/document/modifier', contenuCoursCtrl.modifierDocument);
router.post('/document/supprimer', contenuCoursCtrl.supprimerDocument);
router.post('/afficher', contenuCoursCtrl.afficher);

module.exports = router;