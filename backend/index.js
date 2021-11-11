const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

db.connect((err) =>{
    if(err) throw err;
    console.log("connecté à la base de données");
    db.query("SELECT * FROM users;", (err, result)=>{
        if(err) throw err;
        console.log(result);
    })
});