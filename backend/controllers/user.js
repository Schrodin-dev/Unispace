const bcrypt = require('bcrypt');
const db = require('../models/index');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');
const randomUUID = crypto.randomUUID;

/*
* BUT: enregister un nouvel étudiant
*
* paramètres: email (=emailUser), nom (=nomUser), prenom (=prenomUser), password (=mdpUser), groupe (=groupe.nomGroupe)
*
* droits requis: AUCUN
* */
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

    const uuid = randomUUID();

    bcrypt.hash(req.body.password, 10)
        .then(async hash => {
            const user = db.user.build({
                emailUser: req.body.email,
                nomUser: req.body.nom,
                prenomUser: req.body.prenom,
                mdpUser: hash,
                nomGroupe: req.body.groupe,
                codeVerification: uuid,
                expirationCodeVerification: new Date(Date.now()).getTime() + 24*60*60*1000
            });

            await user.save()
                .then(() => {
                    require('../mailsender').envoyerMailPersonne(req.body.email, 'Vérification de votre compte', '<p>Afin d\'accéder à Noobnotes, veuillez vérifier votre compte. Pour ce faire, cliquez sur ce lien (ou copiez-le dans votre navigateur) : <a href="' + require('../config/appli.json').lienVerification + uuid + '">' + require('../config/appli.json').lienVerification + uuid + '</a></p>');
                })
                .then(() => res.status(201).json({message: 'Un email a été envoyé pour valider la création de votre compte.'}))
                .catch(error => {
                    console.log(error)
                    res.status(400).json({error})
                });
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

/*
* BUT: mettre à jour les données de l'utilisateur avec les nouvelles données saisies
*
* paramètres: nom (=nomUser), prenom (=prenomUser), groupe (=groupe.nomGroupe), annonces (=accepteRecevoirAnnonces), password (=mdpUser)
*
* droits requis: AUCUN
* */
exports.changementsDonneesCompte = async (req, res, next) => {
    //règle numéro 1 : ne jamais faire confiance à l'utilisateur 😇
    //vérification des données avant insertion
    db.user.findOne({where: {emailUser: req.auth.userEmail}})
        .then(async (user) => {
            if (user === null) {
                throw(Error('Vous n\'êtes pas inscrit, veuillez vous inscrire d\'abord.'));
            }
            // vérification du format des données fournies par l'utilisateur
            if (req.body.nom.length > 40) {
                throw(Error('Le nouveau nom est trop long (40 caractères maximum).'));
            }
            if (req.body.prenom.length > 40) {
                throw(Error('Le nouveau prénom est trop long (40 caractères maximum).'));
            }

            if (req.body.nom.length > 0) user.set({nomUser: req.body.nom});
            if (req.body.prenom.length > 0) user.set({prenomUser: req.body.prenom});
            if(req.body.annonces !== undefined){
                user.set({accepteRecevoirAnnonces: req.body.annonces});
            }
            return user;
        })
        .then(user => {
            if (req.body.groupe.length <= 0) return user;

            return db.groupe.findOne({where: {nomGroupe: req.body.groupe}}).then(groupe => {
                if(!groupe) throw(Error('Le nouveau groupe renseigné n\'existe pas.'));

                return db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
                    .then(userGroupe => {
                        if(groupe.nomClasse !== userGroupe.nomClasse && (req.auth.droitsUser === 'délégué' || req.auth.droitsUser === 'publicateur')){
                            user.set({droitsUser: 'élève'});
                        }

                        user.set({nomGroupe: req.body.groupe});

                        return user;
                    })
            })
        })
        .then(async user => {
            console.log(req.body.password);
            if(req.body.password.length === 0) return user;

            return bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    user.set({mdpUser: hash});
                    console.log(user);
                    return user;
                })
                .catch(error => {
                    throw(error);
                });
        })
        .then(user => {
            user.save()
                .then(() => {
                    res.status(201).json({message: 'Les modifications ont été prises en compte.'})
                })
                .catch(error => {throw(error)});
        })
        .catch(error => {
            res.status(500).json({message: error.message});
        });

};

/*
* BUT: connecter l'utilisateur et lui fournir son token de connexion
*
* paramètres: email (=emailUser), password (=mdpUser)
*
* droits requis: AUCUN
* */
exports.login = (req, res, next) => {
    db.user.findOne({
        where: {emailUser: req.body.email},
        include: {
            model: db.theme,
            required: true
        }
    })
        .then(user => {
            if(!user){
                return res.status(400).json({message: 'paire email/mot de passe incorrecte'});
            }

            if(user.droitsUser === 'non validé'){
                return this.renvoyerCodeVerification(req, res, next);
                //return res.status(401).json({message: "Veuillez vérifier votre compte avant de vous connecter."});
            }

            bcrypt.compare(req.body.password, user.mdpUser)
                .then(valide => {
                    if(!valide){
                        return res.status(400).json({message: 'paire email/mot de passe incorrecte'});
                    }

                    res.status(201).json({
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
                            require('../config/appli.json').token,//TODO: remplacer le token en production par un truc bien long comme il faut :)
                            {expiresIn: '24h'}
                        ),
                        theme: user.theme.idTheme,
                        sourceImageTheme: user.theme.sourceTheme,
                        couleurPrincipale: user.theme.couleurPrincipaleTheme,
                        couleurFond: user.theme.couleurFond
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

/*
* BUT: supprimer un utilisateur et toutes ses données
*
* paramètres: AUCUN
*
* droits requis: AUCUN
* */
exports.supprimerCompte = (req , res, next) => {
    db.user.findOne({where: {emailUser: req.auth.userEmail}})
        .then(user => {
           user.destroy()
               .then(() => {
                   res.status(201).json({message: 'Votre compte a bien été supprimé'})
               })
               .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

/*
* BUT: vérifier le compte d'un utilisateur (et notamment que l'email fournie est bien un email universitaire)
*
* paramètres: codeVerification
*
* droits requis: AUCUN
* */
exports.validerCompte = (req, res, next) => {
  db.user.findOne({where: {codeVerification: req.body.codeVerification}})
      .then(user => {
          if(user.expirationCodeVerification === null || user.expirationCodeVerification < new Date(Date.now()).getTime()){
              return res.status(400).json({message: 'Le code de vérification est expiré.'});
          }
          if(user.droitsUser === 'non validé'){
              user.set({droitsUser: "élève", expirationCodeVerification: null});
          }else{
              return res.status(400).json({message: 'Votre compte est déjà validé.'});
          }


          user.save()
              .then(() => {
                  res.status(201).json({message: 'Votre compté a bien été validé'});
              })
              .catch(error => res.status(500).json({error}));
      })
      .catch(error => res.status(500).json({error}));
};

/*
* BUT: envoyer ou renvoyer un code de vérification pour vérifier le compte ou réinitialiser le mot de passe, en fonction de si le compte est déjà vérifié ou non
*
* paramètres: email (=emailUser)
*
* droits requis: AUCUN
* */
exports.renvoyerCodeVerification = (req, res, next) => {
  db.user.findOne({where: {emailUser: req.body.email}})
      .then(async user => {
          const uuid = randomUUID();
          user.set({codeVerification: uuid, expirationCodeVerification: new Date(Date.now()).getTime() + 24*60*60*1000})

          await user.save()
              .then(() => {
                  if(user.droitsUser === 'non validé'){
                      require('../mailsender').envoyerMailPersonne(req.body.email, 'Vérification de votre compte', '<p>Afin d\'accéder à Noobnotes, veuillez vérifier votre compte. Pour ce faire, cliquez sur ce lien (ou copiez-le dans votre navigateur) : <a href="' + require('../config/appli.json').lienVerification + uuid + '">' + require('../config/appli.json').lienVerification + uuid + '</a></p>');
                  }else{
                      require('../mailsender').envoyerMailPersonne(req.body.email, 'Mot de passe oublié', '<p>Afin de modifier votre mot de passe, cliquez sur ce lien (ou copiez-le dans votre navigateur) : <a href="' + require('../config/appli.json').lienMdpOublie + uuid + '">' + require('../config/appli.json').lienMdpOublie + uuid + '</a></p>');
                  }
              })
              .then(() => {
                  if(user.droitsUser === 'non validé'){
                      res.status(201).json({message: 'Un email a été envoyé pour valider votre compte.'});
                  }else{
                      res.status(201).json({message: 'Un email a été envoyé pour modifier votre mot de passe.'});
                  }
              })
              .catch(error => {
                  res.status(400).json({error});
              });
      })
      .catch(error => res.status(500).json({error}));
};

/*
* BUT: changer son mot de passe à l'aide d'un code de vérification
*
* paramètres: codeVerification
*
* droits requis: AUCUN
* */
exports.changerMotDePasse = (req, res, next) => {
    db.user.findOne({where: {codeVerification: req.body.codeVerification}})
        .then(async user => {
            if (user.droitsUser === 'non validé') {
                return res.status(400).json({message: 'veuillez valider votre compte d\'abord.'});
            }

            if (user.expirationCodeVerification === null || user.expirationCodeVerification < new Date(Date.now()).getTime()) {
                return res.status(400).json({message: 'Le code de vérification est expiré.'})
            }

            await bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    user.set({mdpUser: hash, expirationCodeVerification: null});
                    user.save()
                        .then(() => {
                            res.status(201).json({message: 'Votre nouveau mot de passe a été pris en compte.'});
                        })
                        .catch(error => res.status(500).json({error}));
                })
                .catch(error => {
                    res.status(500).json({error});
                });

        })
        .catch(error => res.status(500).json({error}));
};

/*
* BUT: afficher la liste des utilisateurs de l'application, seulement ceux de la classe pour un délégué et tous pour un admin
*
* paramètres: AUCUN
*
* droits requis: délégué, admin
* */
exports.afficherUtilisateurs = (req, res, next) => {
    switch(req.auth.droitsUser){
        case 'admin':
            db.user.findAll({
                attributes: ['emailUser', 'nomUser', 'prenomUser', 'droitsUser', 'nomGroupe']
            })
                .then(users => {
                    return res.status(200).json(users);
                })
                .catch(error => {return res.status(500).json(error);});
            break;
        case 'délégué':
            db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
                .then(userGroupe => {
                    db.user.findAll({
                        attributes: ['emailUser', 'nomUser', 'prenomUser', 'droitsUser', 'nomGroupe'],
                        include: {
                            model: db.groupe,
                            required: true,
                            where: {nomClasse: userGroupe.nomClasse},
                            attributes: []
                        }
                    })
                        .then(users => {
                            return res.status(200).json(users);
                        })
                        .catch(error => {return res.status(500).json(error);});
                })
                .catch(error => {return res.status(500).json(error);});
            break;
        default:
            return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour afficher les autres utilisateurs."});
    }
};

/*
* BUT: modifier les droits d'un utilisateur
*
* paramètres: user (=emailUser), droits (=droitsUser)
*
* droits requis: délégué, admin
* */
exports.modifierDroits = (req, res, next) => {
    switch(req.auth.droitsUser){
        case 'admin':
            db.user.findOne({where: {emailUser: req.body.user}})
                .then(user => {
                    if(!user){
                        return res.status(400).json({message: "Impossible de trouver l'utilisateur."});
                    }

                    user.droitsUser = req.body.droits;
                    user.save()
                        .then(() => {
                            return res.status(200).json({message: "Les droits de l'utilisateur ont bien été mis à jour."});
                        })
                        .catch(error => {return res.status(500).json(error);});
                })
                .catch(error => {return res.status(500).json(error);});
            break;
        case 'délégué':
            if(req.body.droits === 'admin' || req.body.droits === 'délégué' || req.body.droits === 'non validé'){
                return res.status(401).json({message: "Vous ne pouvez pas donner ces droits avec vos droits actuels."});
            }

            db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
                .then(userGroupe => {
                    db.user.findOne({
                        include: {
                            model: db.groupe,
                            required: true,
                            where: {nomClasse: userGroupe.nomClasse},
                            attributes: []
                        },
                        where: {emailUser: req.body.user}
                    })
                        .then(user => {
                            if(!user){
                                return res.status(400).json({message: "Impossible de trouver l'utilisateur."});
                            }

                            if(user.droitsUser === 'admin' || user.droitsUser === 'délégué' || user.droitsUser === 'non validé'){
                                return res.status(401).json({message: "Vous ne pouvez pas modifier les droits de cet utilisateur."});
                            }

                            user.droitsUser = req.body.droits;
                            user.save()
                                .then(() => {
                                    return res.status(200).json({message: "Les droits de l'utilisateur ont bien été mis à jour."});
                                })
                                .catch(error => {return res.status(500).json(error);});
                        })
                        .catch(error => {return res.status(500).json(error);});
                })
                .catch(error => {return res.status(500).json(error);});
            break;
        default:
            return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier les droits d'autres utilisateurs."});
    }
};

/*
* BUT: afficher la liste des classes-->groupes lors du register ou de la modification des informations d'un utilisateur
*
* paramètres: AUCUN
*
* droits requis: AUCUN
* */
exports.visualiserClasses = (req, res, next) => {
  db.classe.findAll({
      include: {
          model: db.groupe,
          attributes: ["nomGroupe"],
          required: true
      },
      attributes: ["nomClasse"]
  })
      .then(classes => {
          if(!classes){
              return res.status(500).json({message: "Impossible de trouver les classes."});
          }

          return res.status(200).json(classes);
      })
      .catch(error => {return res.status(500).json(error);});
};

/*
* BUT: retourne si l'utilisateur accepte de recevoir des annonces par mail ou non
*
* paramètres: AUCUN
*
* droits requis: AUCUN
* */
exports.voirAccepteAnnonces = (req, res, next) => {
    db.user.findOne({
        where: {emailUser: req.auth.userEmail},
        attributes: ['accepteRecevoirAnnonces']
    })
        .then(user => {
            return res.status(200).json({accepteRecevoirAnnonces: user.accepteRecevoirAnnonces});
        })
        .catch(error => {return res.status(500).json(error);});
};

/*
* BUT: afficher la liste des thèmes
*
* paramètres: AUCUN
*
* droits requis: AUCUN
* */
exports.recupererThemes = (req, res, next) => {
    db.theme.findAll({
        attributes: ['idTheme']
    })
        .then(themes => {
            return res.status(200).json(themes);
        })
        .catch(error => {return res.status(500).json(error);});
}

/*
* BUT: modifier le thème que l'utilisateur utilise
*
* paramètres: theme (=idTheme)
*
* droits requis: AUCUN
* */
exports.modifierTheme = (req, res, next) => {
    db.user.findOne({where: {emailUser: req.auth.userEmail}})
        .then(user => {
            if(!user) throw(Error("Impossible de trouver l'utilisateur."));

            db.theme.findOne({where: {idTheme: req.body.theme}, attributes: ['idTheme', 'sourceTheme', 'couleurPrincipaleTheme', 'couleurFond']})
                .then(theme => {
                    if(!theme) throw(Error("Impossible de trouver le thème."));

                    user.set('idTheme', theme.idTheme);

                    user.save()
                        .then(() => {
                            return res.status(200).json({message: "Le thème a été mis à jour.", theme: theme});
                        })
                        .catch(error => {
                            return res.status(500).json({message: error.message});
                        })
                })
                .catch(error => {
                    return res.status(500).json({message: error.message});
                })
        })
        .catch(error => {
            return res.status(500).json({message: error.message});
        })
}

/*
* BUT: afficher la liste des thèmes détaillée
*
* paramètres: AUCUN
*
* droits requis: admin
* */
exports.recupererThemesAdmin = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin') return res.status(500).json({message: "Vous n'avez pas les droits nécessaires pour afficher le détail des thèmes."});

    db.theme.findAll()
        .then(themes => {
            return res.status(200).json(themes);
        })
        .catch(error => {return res.status(500).json(error);});
}

/*
* BUT: ajouter un nouveau thème à la liste des thèmes
*
* paramètres: source (=sourceTheme), couleurPrincipale (=couleurPrincipaleTheme), couleurFond (=couleurFond)
*
* droits requis: admin
* */
exports.ajouterTheme = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin') return res.status(500).json({message: "Vous n'avez pas les droits nécessaires pour ajouter un thème."});

    const theme = db.theme.build({
        sourceTheme: req.body.source,
        couleurPrincipaleTheme: req.body.couleurPrincipale,
        couleurFond: req.body.couleurFond
    });

    theme.save()
        .then(() => {
            return res.status(200).json({message: "Le thème a bien été ajouté"})
        })
        .catch(error => {return res.status(500).json(error);});
}

/*
* BUT: supprimer un thème de la liste des thèmes
*
* paramètres: theme (=idTheme)
*
* droits requis: admin
* */
exports.supprimerTheme = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin') return res.status(500).json({message: "Vous n'avez pas les droits nécessaires pour supprimer un thème."});

    db.theme.findOne({where: {idTheme: req.body.theme}})
        .then(theme => {
            return theme.destroy()
        })
        .then(() => {
            return res.status(200).json({message: "Le thème a bien été supprimé."});
        })
        .catch(error => {return res.status(500).json(error);});
}