const mysql = require('mysql'),
    /* connection = mysql.createConnection({
        host     : 'sql141.main-hosting.eu',
        user     : 'u526894748_pic',
        password : process.env.MYSQL_PASS,
        database : 'u526894748_speed'
    }); */
    connection = mysql.createConnection({
        host     : 'db4free.net',
        user     : 'rafalves',
        password : process.env.MYSQL_PASS,
        database : 'teste_rafalves'
    });

module.exports = connection;