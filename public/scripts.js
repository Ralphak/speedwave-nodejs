var usuario, linkAtivo, linkRedirect;


//Eventos que devem ocorrer assim que o site é carregado
document.addEventListener("DOMContentLoaded", async function(){
    //recuperar dados de usuário
    usuario = await recuperarDados("/api/dados/usuario");
    console.log(usuario);

    //alterar menus com base no login, exibindo a página ao finalizar
    let menuUsuario = document.getElementById("menu-usuario");
    if(usuario){
        menuUsuario.querySelector(".dropdown").removeAttribute("hidden");
        switch(usuario.vinculo){
            case "empresa":
                //Nome
                menuUsuario.querySelector(".dropdown-toggle").innerHTML = usuario.razao;
                //Itens do menu
                menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                    <a class="dropdown-item" href="#cadastro-socio">Cadastro de Sócios</a>
                    <a class="dropdown-item" href="#lista-embarcacoes">Minhas Embarcações</a>
                    `);
                break;
        }
        menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `<a class="dropdown-item" href="/api/logout">Sair</a>`);
    } else{
        menuUsuario.insertAdjacentHTML("beforeend", `
            <li class="nav-item">
                <a class="nav-link" href="#login">Login</a>
            </li>
        `);
    }
    document.body.removeAttribute("hidden");

    //Carrega a página citada no #
    carregarPagina(location.hash);
});


//Troca de página quando o # muda
window.onhashchange = function(){
    carregarPagina(location.hash);
};


//Função de carregamento de página
function carregarPagina(pagina){
    //Verifica se o usuário tem permissão
    if(!permitirAcesso(pagina)){
        if(!usuario){
            linkRedirect = '/' + pagina;
            pagina = "login";
        } else{
            pagina = "pagina-inicial";
        }
    } else if(pagina==""){
        pagina = "pagina-inicial";
    }
    else {
        pagina = pagina.replace("#", "");
    }

    //Carrega a página, adicionando parâmetros para páginas específicas
    $("#div-content").load(`${pagina}.html`, async()=>{
        switch(pagina){
            case "cadastro-socio":
                document.getElementsByName("fk_empresa")[0].value = usuario.id;
                //document.getElementById("valores-salvos").innerHTML = await gerarTabela(`/api/buscar/${tabela}?filtro=where ${chaveEstrangeira}=${usuario.id}`);
                break;

            case "cadastro-embarcacao":
                document.getElementsByName("fk_empbarco")[0].value = usuario.id;
                break;

            case "lista-embarcacoes":
                let lista = await recuperarDados("/api/buscar/embarcacao?filtro=join fotoembar on embarcacao.id=fotoembar.fk_embar where fk_empbarco="+usuario.id);
                //Encerra se a lista estiver vazia
                if(lista.length == 0){
                    document.getElementById("lista-cards").innerHTML = "Nenhum registro encontrado.";
                    break;
                }
                //Insere o código HTML para cada card
                document.getElementById("lista-cards").innerHTML = "";
                for(let i=0; i<lista.length; i++){
                    let extensao = `${lista[i].través}`.split(".");
                    document.getElementById("lista-cards").insertAdjacentHTML("beforeend", `
                        <div class="card m-1" id="${i}">
                            <img class="card-img-top" src="data:${extensao[1]};base64, ${extensao[0]}">
                            <p class="card-text text-center">${lista[i].nome}<br><small class="text-muted">${lista[i].categoria}</small></p>
                        </div>
                    `);
                }
                //Cria um modal quando um dos cards é clicado
                document.querySelectorAll(".card").forEach(card =>{
                    card.addEventListener("click", (e)=>{
                        let i = e.currentTarget.id,
                            proa = `${lista[i].proa}`.split("."),
                            popa = `${lista[i].popa}`.split("."),
                            traves = `${lista[i].través}`.split("."),
                            interior1 = `${lista[i].interior1}`.split("."),
                            interior2 = `${lista[i].interior2}`.split("."),
                            interior3 = `${lista[i].interior3}`.split(".");
                        document.querySelector(".modal-body").innerHTML = `
                            <b>Nome:</b> ${lista[i].nome}<br>
                            <b>Categoria:</b> ${lista[i].categoria}<br>
                            <b>Número:</b> ${lista[i].numero}<br>
                            <b>Data de Registro:</b> ${formatarData(lista[i].data)}<br>
                            <b>Validade do Documento:</b> ${formatarData(lista[i].validade)}<br>
                            <b>Passageiros:</b> ${lista[i].capacidade}<br>
                            <b>Tripulantes:</b> ${lista[i].qtd_tripulantes}<br>
                            <b>Atividade:</b> ${lista[i].atividade}<br>
                            <b>Área de Navegação:</b> ${lista[i].area_nav}<br>
                            <b>Cidade:</b> ${lista[i].cidade}<br>
                            <b>Valor:</b> R$${lista[i].valor}<br>
                            <p><b>Fotos:</b></p>
                            <div class="row">
                                <img class="img-anexo" src="data:${proa[1]};base64, ${proa[0]}">
                                <img class="img-anexo" src="data:${popa[1]};base64, ${popa[0]}">
                                <img class="img-anexo" src="data:${traves[1]};base64, ${traves[0]}">
                                <img class="img-anexo" src="data:${interior1[1]};base64, ${interior1[0]}">
                                <img class="img-anexo" src="data:${interior2[1]};base64, ${interior2[0]}">
                                <img class="img-anexo" src="data:${interior3[1]};base64, ${interior3[0]}">
                            </div>
                        `;
                        $('.modal').modal('show');
                    });
                });
                break;

            case "login":
                if(linkRedirect){
                    document.getElementsByName("redirect_url")[0].value = linkRedirect;
                    document.name
                }
                let flash = await recuperarDados("/api/dados/flash");
                if(flash){
                    document.getElementById("msg-flash").innerHTML= flash.message;
                }
                break;

        }
    });

    //Marcação do link ativo no menu
    if(linkAtivo){
        linkAtivo.classList.remove("active");
    }
    linkAtivo = document.querySelector(`a[href='${location.hash}']`);
    if(linkAtivo){
        linkAtivo.classList.add("active");
    }
    
}


//Verificar permissões de acesso
function permitirAcesso(pagina){
    switch(pagina){
        //Permissões para empresa e sócio
        case "#cadastro-socio":
        case "#cadastro-embarcacao":
        case "#lista-embarcacoes":
            if(!usuario || usuario.vinculo=="cliente"){
                return false;
            }
            break;

        //Impede que um usuário já logado acesse o login novamente
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


//Formatação de data
function formatarData(stringData){
    stringData = new Date(stringData);
    let data = `${stringData.getDate()}/${stringData.getMonth()+1}/${stringData.getFullYear()}`;
    return data;
}