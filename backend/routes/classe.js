const express = require('express');
const router = express.Router();

const classeCtrl = require('../controllers/classe');

router.post('/ajouter', classeCtrl.creerClasse);
router.post('/supprimer', classeCtrl.supprimerClasse);

module.exports = router;