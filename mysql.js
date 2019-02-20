const mysql = require('mysql'),
    cron = require('node-cron'),
    connection = mysql.createPool(process.env.DATABASE_URL);
    /* connection = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : "root",
        database : 'teste_speed'
    }); */

//Eventos agendados para ocorrer diariamente
cron.schedule('* 3 * * *', ()=>{
    connection.query(`update alugalancha set status="Terminado" where status!="Terminado" and date(data_aluguel) <= current_date()`);
    connection.query(`update aluguelbarco set status="Terminado" where status!="Terminado" and date(data_aluguel) <= current_date()`);
});

module.exports = connection;