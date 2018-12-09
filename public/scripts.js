var usuario, idUsuario="";

//Eventos que devem ocorrer assim que o site é carregado
document.addEventListener("DOMContentLoaded", async function(){
    //recuperar dados de usuário
    usuario = await recuperarDados("/api/dados/usuario");
    console.log(usuario);

    //obtendo o id do usuário conforme vínculo
    if(usuario){
        switch(usuario.vinculo){
            case "proprietario":
                idUsuario = usuario.id_empresa;
                break;
            case "vendedor":
                idUsuario = usuario.id_vendemp;
                break;
        }
    }

    //alterar menus com base no login, exibindo a página ao finalizar
    if(usuario){
        document.getElementById("nome-usuario").innerHTML=`Entrou como ${usuario.razao}`;
        switch(usuario.vinculo){
            case "proprietario":
                document.getElementById("div-menu").insertAdjacentHTML("beforeend", `
                    <a href="#cadastro-socio">Cadastro de Sócios</a>
                    <a href="#cadastro-embarcacao">Cadastro de Embarcações</a>
                    `);
                break;
            case "vendedor":
                document.getElementById("div-menu").insertAdjacentHTML("beforeend", `
                    <a href="#cadastro-socio">Cadastro de Sócios</a>
                    `);
                break;
        }
        document.getElementById("div-menu").insertAdjacentHTML("beforeend", `<a href="/api/logout">Sair</a>`);
    } else{
        document.getElementById("div-menu").insertAdjacentHTML("beforeend", `
            <a href="#cadastro-empresa">Cadastro de Empresa</a>
            <a href="#login">Login</a>
        `);
    }
    document.body.removeAttribute("hidden");

    //Troca de página segundo o #
    carregarPagina(location.hash);
});

//Troca de página quando o # muda
window.onhashchange = function(){
    carregarPagina(location.hash);
};

//Função de carregamento de página
function carregarPagina(pagina){
    if(pagina=="" || !permitirAcesso(pagina)){
        pagina = "pagina-inicial";
    }
    else {
        pagina = pagina.replace("#", "");
    }

    $("#div-content").load(`${pagina}.html`, async()=>{
        //Parâmetros para páginas específicas
        switch(pagina){
            case "cadastro-empresa":
                document.getElementById("valores-salvos").innerHTML = "Proprietários:<br>" + await gerarTabela("/api/buscar/empresabarco?filtro=join endemp on empresabarco.id_empresa=endemp.fk_empresa join bancoempbarco on empresabarco.id_empresa=bancoempbarco.fk_empresa");
                document.getElementById("valores-salvos").insertAdjacentHTML("beforeend", "<br>Vendedores:<br>" + await gerarTabela("/api/buscar/vendemp?filtro=join endvendemp on vendemp.id_vendemp=endvendemp.fk_vendemp join bancovendemp on vendemp.id_vendemp=bancovendemp.fk_vendemp"));
                break;

            case "cadastro-socio":
                document.getElementById("caixaAltoAcesso").addEventListener("click", (e)=>{
                    let valorCaixa = document.getElementById("altoAcesso");
                    if(e.target.checked){
                        valorCaixa.value = 1;
                    } else{
                        valorCaixa.value = 0;
                    }
                });

                let tabela, chaveEstrangeira;
                if(usuario.vinculo=="proprietario"){
                    tabela="socio";
                    chaveEstrangeira="fk_empresa";
                } else if(usuario.vinculo=="vendedor"){
                    tabela="sociovendemp";
                    chaveEstrangeira="fk_vendemp";
                }
                document.getElementById("form-socio").action = "/api/incluir/"+tabela;
                document.getElementById("id_empresa").value = idUsuario;
                document.getElementById("id_empresa").name = chaveEstrangeira;
                document.getElementById("valores-salvos").innerHTML = await gerarTabela(`/api/buscar/${tabela}?filtro=where ${chaveEstrangeira}=${idUsuario}`);

                break;

            case "cadastro-embarcacao":
                document.getElementsByName("fk_empbarco")[0].value = idUsuario;
                document.getElementById("valores-salvos").innerHTML = await gerarTabela("/api/buscar/embarcacao?filtro=join fotoembar on embarcacao.id_embarcacao=fotoembar.fk_embar where fk_empbarco="+idUsuario);
                break;

            case "login":
                let flash = await recuperarDados("/api/dados/flash");
                if(flash){
                    document.getElementById("msg-flash").innerHTML= flash.message;
                }
                break;
        }
    });
}

//Verificar permissões de acesso
function permitirAcesso(pagina){
    switch(pagina){
        //Permissões para usuário logado
        case "#cadastro-socio":
            if(!usuario){
                return false;
            }
            break;
        case "#cadastro-embarcacao":
            if(!usuario || usuario.vinculo=="vendedor"){
                return false;
            }
            break;

        //Permissões para visitante
        case "#cadastro-empresa":
        case "#login":
            if(usuario){
                return false;
            }
            break;
    }
    return true;
}

//Recupera dados do servidor.
async function recuperarDados (url) {
    let dados;
    await $.ajax({type: 'GET',
        url: `${url}`,
        dataType: "json"
    }).done(function(msg){
        dados = msg;
    }).fail(function(msg){
        console.log("Erro no AJAX: " + msg.data);
    });
    return dados;
};

//Gera uma tabela a partir dos dados recuperados
async function gerarTabela (url){
    let dados = await recuperarDados(url);
    if(dados.length==0){
        return "Nenhum registro encontrado.";
    }
    let tabela = "<table><tr>";
    //Cabeçalho
    Object.keys(dados[0]).forEach((nome) =>{
        tabela +=`<th>${nome}</th>`;
    });
    tabela += "</tr>";
    //Valores dos objetos
    dados.forEach(dado => {
        tabela += "<tr>";
        Object.keys(dado).map(valor => {
            let extensao = `${dado[valor]}`.split(".");
            if(extensao[1]=="image/jpeg" || extensao[1]=="image/png"){
                tabela += `<td><img class="img-anexo" src="data:${extensao[1]};base64, ${extensao[0]}"></td>`;
            } else{
                tabela += `<td>${dado[valor]}</td>`;
            }
        });
        tabela += "</tr>";
    });
    tabela += "</table>";
    return tabela;
}