const bcrypt = require('bcrypt');
const db = require('../models/index');
const jsonwebtoken = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    //règle numéro 1 : ne jamais faire confiance à l'utilisateur 😇
    //vérification des données avant insertion
    if (await db.user.findOne({where: {emailUser: req.body.email}}) !== null) {
        return res.status(400).json({message: 'Vous êtes déjà inscrit, veuillez vous connecter.'});
    }
    if (!req.body.email.toString().includes('@etu.umontpellier.fr')) {
        return res.status(400).json({message: 'Vous devez utiliser un email étudiant universitaire de Montpellier afin de vous inscrire.'});
    }
    // vérification du format des données fournies par l'utilisateur
    if(req.body.email.length > 128){
        return res.status(400).json({message: 'Votre email est trop long (128 caractères maximum).'});
    }
    if(req.body.nom.length > 40){
        return res.status(400).json({message: 'Votre nom est trop long (40 caractères maximum).'});
    }
    if(req.body.prenom.length > 40){
        return res.status(400).json({message: 'Votre prénom est trop long (40 caractères maximum).'});
    }
    if(await db.groupe.findOne({where: {nomGroupe: req.body.groupe}}) === null){
        return res.status(400).json({message: 'Le groupe renseigné n\'existe pas.'});
    }


    bcrypt.hash(req.body.password, 10)
        .then(async hash => {
            const user = db.user.build({
                emailUser: req.body.email,
                nomUser: req.body.nom,
                prenomUser: req.body.prenom,
                mdpUser: hash,
                nomGroupe: req.body.groupe

            });

            await user.save()
                .then(() => res.status(201).json({message: 'Un email a été envoyé pour valider la création de votre compte.'})) //TODO: validation du compte par email avant de lui donner lde droit d'accéder au site
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

exports.changementsDonneesCompte = async (req, res, next) => {
    //règle numéro 1 : ne jamais faire confiance à l'utilisateur 😇
    //vérification des données avant insertion
    db.user.findOne({where: {emailUser: req.auth.userEmail}})
        .then(async (user) => {
            if (user === null) {
                return res.status(400).json({message: 'Vous n\'êtes pas inscrit, veuillez vous inscrire d\'abord.'});
            }
            // vérification du format des données fournies par l'utilisateur
            if (req.body.nom.length > 40) {
                return res.status(400).json({message: 'Le nouveau nom est trop long (40 caractères maximum).'});
            }
            if (req.body.prenom.length > 40) {
                return res.status(400).json({message: 'Le nouveau prénom est trop long (40 caractères maximum).'});
            }
            if (req.body.groupe.length > 0 && await db.groupe.findOne({where: {nomGroupe: req.body.groupe}}) === null) {
                return res.status(400).json({message: 'Le nouveau groupe renseigné n\'existe pas.'});
            }

            if (req.body.nom.length > 0) user.set({nomUser: req.body.nom});
            if (req.body.prenom.length > 0) user.set({prenomUser: req.body.prenom});
            if (req.body.groupe.length > 0) user.set({nomGroupe: req.body.groupe});
            if (req.body.password.length > 0) {
                await bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        user.set({mdpUser: hash});
                    })
                    .catch(error => {
                        res.status(500).json({error});
                    });
            }
            return user;
        })
        .then(user => {
            user.save()
                .then(() => {
                    res.status(201).json({message: 'Les modifications ont été prises en compte.'})
                })
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({error})
        });

};

exports.login = (req, res, next) => {
    db.user.findOne({where: {emailUser: req.body.email}})
        .then(user => {
            if(!user){
                return res.status(400).json({message: 'paire email/mot de passe incorrecte'});
            }

            bcrypt.compare(req.body.password, user.mdpUser)
                .then(valide => {
                    if(!valide){
                        return res.status(400).json({message: 'paire email/mot de passe incorrecte'});
                    }

                    res.status(200).json({
                        nom: user.nomUser,
                        prenom: user.prenomUser,
                        theme: user.idTheme,
                        groupe: user.nomGroupe,
                        droits: user.droitsUser,
                        token: jsonwebtoken.sign(
                            {
                                userEmail: user.emailUser,
                                userGroupe: user.nomGroupe,
                                droitsUser: user.droitsUser
                            },
                            'tokenMagique',//TODO: remplacer le token en production par un truc bien long comme il faut :)
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.supprimerCompte = (req , res, next) => {
    db.user.findOne({where: {emailUser: req.auth.userEmail}})
        .then(user => {
           user.destroy()
               .then(() => {
                   res.status(200).json({message: 'Votre compte a bien été supprimé'})
               })
               .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};