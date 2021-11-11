app.post('/users', (req, res, next) => {
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

            db.query("INSERT INTO users VALUES('" + body.nom + "', '" + body.prenom + "', '" + body.email + "', '" + body.password + "', '" + body.classe + "', " + body.groupe + ");", (err) => {
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



});

app.use('/users', (req, res, next) => {
    db.query("SELECT * FROM users;", (err, result)=>{
        if(err) throw err;

        res.json(JSON.stringify(result));
        res.end();
        //console.log(result);
    });
});