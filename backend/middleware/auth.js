const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, require('../config/appli.json').token/*TODO: remplacer le token en production par un truc bien long comme il faut :)*/,);
        const userEmail = decodeToken.userEmail;
        const userGroupe = decodeToken.userGroupe;
        const droitsUser = decodeToken.droitsUser;

        req.auth = {
            userEmail: userEmail,
            userGroupe: userGroupe,
            droitsUser: droitsUser
        };

        next();
    }catch(error){
        return res.status(401).json(error);
    }
};