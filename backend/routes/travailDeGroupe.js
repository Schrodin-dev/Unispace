const express = require('express');
const router = express.Router();

const travailDeGroupeCtrl = require('../controllers/travailDeGroupe');

router.post('/ajouter', travailDeGroupeCtrl.creerTravail);
router.post('/supprimer', travailDeGroupeCtrl.supprimerTravail);
router.post('/modifier', travailDeGroupeCtrl.modifierTravail);
router.post('/groupe/ajouter', travailDeGroupeCtrl.creerGroupe);
router.post('/groupe/inviter', travailDeGroupeCtrl.inviterGroupe);
router.post('/groupe/accepterInvitation', travailDeGroupeCtrl.accepterInvitationGroupe);
router.post('/groupe/refuserInvitation', travailDeGroupeCtrl.refuserInvitationGroupe);
router.post('/groupe/quitter', travailDeGroupeCtrl.quitterGroupe);
router.get('/recuperer', travailDeGroupeCtrl.recupererGroupes);

module.exports = router;