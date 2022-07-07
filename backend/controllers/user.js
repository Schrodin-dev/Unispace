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
            console.error(error);
            res.status(500).json({error});
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
                        email: user.email,
                        token: jsonwebtoken.sign(
                            {
                                userEmail : user.email,
                                userGroupe: user.userGroupe,
                                userClasse: user.userClasse,
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