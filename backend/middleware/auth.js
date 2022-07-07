const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, 'tokenMagique'/*TODO: remplacer le token en production par un truc bien long comme il faut :)*/);
        const userEmail = decodeToken.userEmail;
        const userGroupe = decodeToken.userGroupe;
        const userClasse = decodeToken.userClasse;

        req.auth = {
            userEmail: userEmail,
            userGroupe: userGroupe,
            userClasse: userClasse
        };

        next();
    }catch(error){
        res.status(401).json({error});
    }
};