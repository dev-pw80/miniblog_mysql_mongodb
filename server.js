const express = require('express');
const app = express();

app.use('/', express.static('public'));
app.use(express.json());

const mysql = require('mysql');

const Post = require('./Post');

const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'patrick',
    password: 'password',
    database: 'miniblog'
});

app.get('/blogposts', async (req, res) => {

    let resultMysql = [];

    const query = `select * from blogpost order by id desc;`;

    connection.query(
        query,
        async (err, rows) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            
            resultMysql = rows;
            // return res.send(rows)
            
                const posts = await Post.find()
            
                let result = {
                    mysql: resultMysql,
                    mongodb: posts
                }
                 return res.json(result)
        });

});


app.post('/blogposts', async (req, res) => {
    if (!(req.body.titel && req.body.content)) {
        return res.send({
            error: 'titel and content required'
        });
    }

    const data = {
        titel: req.body.titel,
        content: req.body.content
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
        async (err, result) => {
            if (err) {
                console.log('Error: ' + err);
                return res.send({
                    error: err
                });
            }

            const createdPosts = await Post.insertMany(data);

            return res.send({
                error: 0,
                mysql: result.insertId,
                mongodb: createdPosts
            });
        });
});


console.log('Hallo World from Backend.');
app.listen(PORT);