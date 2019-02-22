const ftp = require("basic-ftp"),
    fs = require("fs"),
    rimraf = require("rimraf");

module.exports.upload = async(arquivos, pasta)=>{
    let pastaTemp = "temp_" + Math.random().toString(36).substring(2);
    fs.mkdirSync(pastaTemp + pasta, { recursive: true });
    Object.values(arquivos).forEach(arquivo => {
        arquivo.mv(pastaTemp + pasta + arquivo.name);
    });

    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS
        });
        await client.uploadDir(pastaTemp);
    }
    catch(err) {
        console.log(err);
    }
    client.close();
    rimraf.sync(pastaTemp);
}