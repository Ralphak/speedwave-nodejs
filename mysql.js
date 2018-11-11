const mysql = require('mysql'),
    connection = mysql.createPool({
        host     : 'sql141.main-hosting.eu',
        user     : 'u526894748_pic',
        password : process.env.MYSQL_PASS,
        database : 'u526894748_speed'
    });
    /* connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : "root",
        database : 'teste_speed'
    }); */

module.exports = connection;