var usuario, linkAtivo, linkRedirect, listaBarcos, listaSocios;


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
                    <a class="dropdown-item" href="#lista-socios">Meus Sócios</a>
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
                break;

            case "cadastro-embarcacao":
                document.getElementsByName("fk_empbarco")[0].value = usuario.id;
                break;

            case "lista-embarcacoes":
                if(!listaBarcos) listaBarcos = await recuperarDados(`/api/buscar/embarcacao?filtro=
                    join fotoembar on embarcacao.id=fotoembar.fk_embar 
                    where fk_empbarco=${usuario.id} 
                    order by nome, categoria`);
                //Encerra se a lista estiver vazia
                if(listaBarcos.length == 0){
                    document.getElementById("cards-barcos").innerHTML = "Nenhum registro encontrado.";
                    break;
                }
                //Insere o código HTML para cada card
                document.getElementById("cards-barcos").innerHTML = "";
                for(let i=0; i<listaBarcos.length; i++){
                    let extensao = `${listaBarcos[i].través}`.split(".");
                    document.getElementById("cards-barcos").insertAdjacentHTML("beforeend", `
                        <div class="card m-1" id="${i}">
                            <img class="card-img-top" src="data:${extensao[1]};base64, ${extensao[0]}">
                            <p class="card-text text-center">${listaBarcos[i].nome}<br><small class="text-muted">${listaBarcos[i].categoria}</small></p>
                        </div>
                    `);
                }
                //Cria um modal quando um dos cards é clicado
                document.querySelectorAll(".card").forEach(card =>{
                    card.addEventListener("click", (e)=>{
                        let i = e.currentTarget.id,
                            proa = `${listaBarcos[i].proa}`.split("."),
                            popa = `${listaBarcos[i].popa}`.split("."),
                            traves = `${listaBarcos[i].través}`.split("."),
                            interior1 = `${listaBarcos[i].interior1}`.split("."),
                            interior2 = `${listaBarcos[i].interior2}`.split("."),
                            interior3 = `${listaBarcos[i].interior3}`.split(".");
                        document.querySelector(".modal-body").innerHTML = `
                            <b>Nome:</b> ${listaBarcos[i].nome}<br>
                            <b>Categoria:</b> ${listaBarcos[i].categoria}<br>
                            <b>Número:</b> ${listaBarcos[i].numero}<br>
                            <b>Data de Registro:</b> ${formatarData(listaBarcos[i].data)}<br>
                            <b>Validade do Documento:</b> ${formatarData(listaBarcos[i].validade)}<br>
                            <b>Passageiros:</b> ${listaBarcos[i].capacidade}<br>
                            <b>Tripulantes:</b> ${listaBarcos[i].qtd_tripulantes}<br>
                            <b>Atividade:</b> ${listaBarcos[i].atividade}<br>
                            <b>Área de Navegação:</b> ${listaBarcos[i].area_nav}<br>
                            <b>Cidade:</b> ${listaBarcos[i].cidade}<br>
                            <b>Valor:</b> R$${listaBarcos[i].valor}<br>
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
                //Fitro da lista
                document.getElementsByName("filtroBarcos").forEach(radio =>{
                    radio.addEventListener("click", (e)=>{
                        for(let i=0; i<listaBarcos.length; i++){
                            if(e.target.value == "Todos" || listaBarcos[i].categoria == e.target.value){
                                document.getElementById(i).removeAttribute("hidden");
                            } else{
                                document.getElementById(i).setAttribute("hidden","");
                            }
                        }
                    });
                });
                break;

            case "lista-socios":
                if(!listaSocios) listaSocios = await recuperarDados(`/api/buscar/socio
                    ?colunas=id,nome,cpf,data_nasc,rua,bairro,cidade,estado,pais,cep,altoAcesso
                    &filtro=where fk_empresa=${usuario.id} 
                    order by nome`),
                    cabecalhos = ["Nome","CPF","Data Nasc.","Endereço","Bairro","Cidade","Estado","País","CEP","Alto Acesso"];
                document.getElementById("tabela-socios").innerHTML = gerarTabela(listaSocios, cabecalhos);
                break;

            case "login":
                if(linkRedirect){
                    document.getElementsByName("redirect_url")[0].value = linkRedirect;
                }
                let flash = await recuperarDados("/api/dados/flash");
                if(flash){
                    document.getElementById("msg-flash").innerHTML= flash.message;
                }
                break;

            case "pagina-inicial":
                $('.carousel').carousel()
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
        case "#cadastro-embarcacao":
        case "#cadastro-socio":
        case "#lista-embarcacoes":
        case "#lista-socios":
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


//Gera uma tabela
function gerarTabela (dados, cabecalhos){
    //Encerra se a lista estiver vazia
    if(dados.length == 0){
        return "<td>Nenhum registro encontrado.</td>";
    }
    //Cabeçalho
    let tabela=`<thead><tr><th></th>`;
    cabecalhos.forEach(nome =>{
        tabela+=`<th scope="col">${nome}</th>`;
    });
    tabela+="</tr></thead><tbody>";
    //Valores
    dados.forEach(dado =>{
        tabela+=`<tr><td><input type="checkbox" name="itensMarcados" value="${dado.id}"></td>`;
        Object.keys(dado).map(valor =>{
            switch(valor){
                case "id":
                    break;
                case "data_nasc":
                    tabela+=`<td>${formatarData(dado[valor])}</td>`;
                    break;
                case "altoAcesso":
                    if(dado[valor] == 1){
                        tabela+=`<td><i class="fas fa-check"></i></td>`;
                    } else{
                        tabela+=`<td></td>`;
                    }
                    break;
                default:
                    tabela+=`<td>${dado[valor]}</td>`;
                    break;
            }
        });
        tabela+="</tr>"
    });
    tabela+="</tbody>";
    return tabela;
}