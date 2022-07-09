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


module.exports = router;