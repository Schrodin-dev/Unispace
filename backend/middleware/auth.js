const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,'KQ%osG9vkCiUt$GDWj5wYrXs9utwaYF^2%h63DZEJUfbbSTxw&**VmCsV2^5EEbqpN*pM!f22PZmiivkJyxDzfXsN!Ks65nu&bBNaQjudJXhyjF2Qq2Q9Z72b#Nrpkdu');
        const userEmail = decodedToken.userEmail;
        if(req.body.userEmail && req.body.userEmail !== userEmail){
            throw 'userEmail non valable';
        }else{
            next();
        }
    }catch (error){
        res.status(401).json({error: error | 'Requête non authentifiée'});
    }
};