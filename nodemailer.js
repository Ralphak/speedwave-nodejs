const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'speedwave.suporte',
        pass: 'SpeedWave123'
    }
});

module.exports.enviarErro = (erro)=>{
    let mailOptions = {
        from: 'speedwave.suporte@gmail.com',
        to: 'speedwave.suporte@gmail.com',
        subject: 'Registro de Erro',
        html: erro
    };
    transporter.sendMail(mailOptions);
}