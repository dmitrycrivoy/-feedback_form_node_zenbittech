const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const db = mysql.createPool({
    host: process.env.ALWAYSDATA_MYSQL_HOST,
    user: process.env.ALWAYSDATA_MYSQL_LOGIN,
    password: process.env.ALWAYSDATA_MYSQL_PASSWORD,
    database: process.env.ALWAYSDATA_MYSQL_DBNAME
})

app.get('/', (req, res) => {
    res.send("Helloooo!!!")
})

app.post('/api/insert', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    if (name && email && message) {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        let validEmail = emailRegex.test(email);
        if (!validEmail)
            res.send({"error": "Invalid email format", "status": [12]})

        const sqlInsert = "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)";
        db.query(sqlInsert, [name, email, message], (error, result) => {
            if (!error) {
                res.send({"success": "Data has been added", "status": 0})
            }
        });
    }
    let statuses = [];
    if (!name) {
        statuses.push(11);
    }
    if (!email) {
        statuses.push(12);
    }
    if (!message) {
        statuses.push(13);
    }
    if (statuses.length !== 0)
        res.send({"error": "No required field values", "status": statuses})
})

app.listen(8100, () => {
    // console.log("app is running on port 8100")
})