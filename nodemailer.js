const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'speedwave.suporte',
        pass: process.env.EMAIL_PASS
    }
});

module.exports.enviarMensagem = (email, assunto, mensagem)=>{
    let mailOptions = {
        from: 'Speed Wave <speedwave.suporte@gmail.com>',
        to: email,
        subject: assunto,
        html: `<img src="cid:logo_speed" width=300>
            <p><font face="Segoe UI" size=3>${mensagem}</font></p>`,
        attachments: [{
            filename: 'logo.png',
            path: 'public/img/logo_email.jpg',
            cid: 'logo_speed'
        }]
    };
    transporter.sendMail(mailOptions);
}

module.exports.enviarErro = (erro)=>{
    let mailOptions = {
        from: 'speedwave.suporte@gmail.com',
        to: 'speedwave.suporte@gmail.com',
        subject: 'Registro de Erro',
        html: erro
    };
    transporter.sendMail(mailOptions);
}