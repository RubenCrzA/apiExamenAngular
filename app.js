const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('eb1481bd63774e5c89784fdd0bdb7824');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(cors());
app.use(express.json());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examenAngular'
});

app.get('/autenticar/:usr/:pass', (req, res) => {
  const usr = req.params.usr;
  const pass = req.params.pass;

  const query = `SELECT * FROM usuarios WHERE usuarios.usuario LIKE '${usr}' and usuarios.password LIKE '${pass}'`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json({ msg: 'No resultsd' });
    }
  });
});

app.post('/altaUsuario', (req, res) => {
  const query = 'INSERT INTO usuarios SET ?';

  const userObj = {
    usuario: req.body.usuario,
    email: req.body.email,
    password: req.body.password
  };

  console.log(userObj);
  connection.query(query, userObj, (err) => {
    if (err) throw err;
    res.json(userObj);
  });
});

app.get('/news/:contry/:lenguage/', (req, res) => {
  const contry = req.params.contry;
  const lenguage = req.params.lenguage;

  newsapi.v2
    .topHeadlines({
      category: 'general',
      language: lenguage,
      country: contry
    })
    .then((response) => {
      res.json(response);
    });
});

//check Connection
connection.connect((error) => {
  if (error) throw error;
  console.log('Database connection is success');
});

app.listen(PORT, () => console.log(`server run on port ${PORT}...`));
