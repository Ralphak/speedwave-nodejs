const mysql = require('mysql'),
    connection = mysql.createConnection({
        host     : 'db4free.net',
        user     : 'rafalves',
        password : process.env.MYSQL_PASS,
        database : 'teste_rafalves'
    });

module.exports = connection;