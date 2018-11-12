const mysql = require('mysql'),
    //connection = mysql.createPool(process.env.DATABASE_URL);
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : "root",
        database : 'teste_speed'
    });

module.exports = connection;