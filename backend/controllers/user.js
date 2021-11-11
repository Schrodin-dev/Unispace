const bcrypt = require('bcrypt');
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

exports.register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            db.query("SELECT * FROM users;", (err, users)=>{
                if(err) throw err;

                let body = req.body;
                console.log(body);
                let error = false;
                for(let user of users){
                    if((body.nom === user.nom && body.prenom === user.prenom) || body.email === user.email){
                        error = true;
                        break;
                    }
                }
                if(error === false){
                    res.status(201).json({
                        message: "utilisateur ajouté"
                    });

                    db.query("INSERT INTO users VALUES('" + body.nom + "', '" + body.prenom + "', '" + body.email + "', '" + hash + "', '" + body.classe + "', " + body.groupe + ");", (err) => {
                        if(err) throw err;
                    });

                    console.log("user added");
                }else{
                    res.status(409).json({
                        message: "Utilisateur déjà enregistré"
                    });
                    console.log("user not added");
                }
            });
        })
        .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res, next) => {
    db.query("SELECT * FROM users;", (err, users)=>{
        if(err) throw err;

        let userFound = false;
        for(let user of users){
            if(req.body.email === user.email){
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            return res.status(401).json({ error: 'Mot de passe incorrecte.' })
                        }
                        res.status(200).json({
                            userEmail: user.email,
                            token: jwt.sign({
                                userEmail: user.email,},
                                'KQ%osG9vkCiUt$GDWj5wYrXs9utwaYF^2%h63DZEJUfbbSTxw&**VmCsV2^5EEbqpN*pM!f22PZmiivkJyxDzfXsN!Ks65nu&bBNaQjudJXhyjF2Qq2Q9Z72b#Nrpkdu',
                                { expiresIn: '24h' }
                            )
                        })
                    })
                    .catch(error => res.status(500).json({ error }));
                userFound = true;
            }
        }
        if(!userFound) res.status(500).json({ error: 'Email invalide.'});
    });
}