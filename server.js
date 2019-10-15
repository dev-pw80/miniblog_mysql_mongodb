const express = require('express');
const app = express();

app.use('/', express.static('public'));
app.use(express.json());

const mysql = require('mysql');

const moment = require('moment-timezone');
moment().tz("Europe/Berlin").format();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'patrick',
    password: 'password',
    database: 'miniblog'
});

app.get('/blogposts', (req, res) => {

    const query1 = `select * from blogpost order by id desc;`;

    connection.query(
        query1,
        (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            return res.send(rows)
        });
});


app.post('/blogposts', (req, res) => {
    if (!(req.body.titel && req.body.content)) {
        return res.send({
            error: 'titel and content required'
        });
    }

    const query2 = `
            insert into blogpost (
                titel, 
                content 
            )
            values (?,?);
        `;

    connection.query(
        query2, [
            req.body.titel,
            req.body.content
        ],
        (err, result) => {
            if (err) {
                console.log('Error: ' + err);
                return res.send({
                    error: err
                });
            }

            return res.send({
                error: 0,
                result: result.id
            });
        });
});


console.log('Hallo World from Backend.');
app.listen(3000);