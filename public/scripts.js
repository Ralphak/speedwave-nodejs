var usuario;

//Eventos que devem ocorrer assim que o site é carregado
document.addEventListener("DOMContentLoaded", async function(){
    //recuperar dados de usuário
    usuario = await recuperarDados("/api/dados/usuario");
    console.log(usuario);

    //alterar menus com base no login, exibindo a página ao finalizar
    if(usuario){
        document.getElementById("nome-usuario").innerHTML=`Entrou como ${usuario.razaoSocial}`;
        document.getElementById("div-menu").insertAdjacentHTML("beforeend", `
            <a href="#cadastro-socio">Cadastro de Sócios</a>
            <a href="#cadastro-embarcacao">Cadastro de Embarcações</a>
            <a href="/api/logout">Sair</a>
        `);
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
                document.getElementById("valores-salvos").innerHTML = await gerarTabela("/api/buscar/Empresa");
                break;
            case "cadastro-socio":
                document.getElementById("valores-salvos").innerHTML = await gerarTabela("/api/buscar/Socio?filtro=where cnpjEmpresa="+usuario.cnpj);
                document.getElementsByName("cnpjEmpresa")[0].value = usuario.cnpj;
                break;
            case "cadastro-embarcacao":
                document.getElementById("valores-salvos").innerHTML = await gerarTabela("/api/buscar/Embarcacao?filtro=where cnpjEmpresa="+usuario.cnpj);
                document.getElementsByName("cnpjEmpresa")[0].value = usuario.cnpj;
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
        case "#cadastro-embarcacao":
            if(!usuario){
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
            tabela += `<td>${dado[valor]}</td>`;
        });
        tabela += "</tr>";
    });
    tabela += "</table>";
    return tabela;
}