const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/modify', auth, userCtrl.changementsDonneesCompte);
router.post('/remove', auth, userCtrl.supprimerCompte);
router.post('/verify', userCtrl.validerCompte);
router.post('/renvoyerCode', userCtrl.renvoyerCodeVerification);
router.post('/changerMdp', userCtrl.changerMotDePasse);
router.get('/afficher', auth, userCtrl.afficherUtilisateurs);
router.post('/modifierDroits', auth, userCtrl.modifierDroits);
router.get('/visualiserClasses', userCtrl.visualiserClasses);
router.get('/accepteAnnonces', auth, userCtrl.voirAccepteAnnonces);
router.get('/themes', userCtrl.recupererThemes);
router.get('/themesAdmin', auth, userCtrl.recupererThemesAdmin);
router.post('/modifierTheme', auth, userCtrl.modifierTheme);
router.post('/ajouterTheme', auth, userCtrl.ajouterTheme);
router.post('/supprimerTheme', auth, userCtrl.supprimerTheme);

module.exports = router;