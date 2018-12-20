var usuario, linkAtivo, linkRedirect, listaAlugueis, listaBarcos, listaPasseios, listaSocios;


//Eventos que devem ocorrer assim que o site é carregado
document.addEventListener("DOMContentLoaded", async function(){
    //recuperar dados de usuário
    usuario = await recuperarDados("/api/dados/usuario");
    console.log(usuario);

    //alterar menus com base no login, exibindo a página ao finalizar
    let menuUsuario = document.getElementById("menu-usuario");
    if(usuario){
        menuUsuario.querySelector(".dropdown").removeAttribute("hidden");
        if(usuario.vinculo=="empresa" || usuario.vinculo=="socio"){
            //Insere a razão social no menu
            menuUsuario.querySelector(".dropdown-toggle").innerHTML = usuario.razao;
            //Itens do menu
            if(usuario.vinculo=="empresa"){
                menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                    <a class="dropdown-item" href="#lista-socios">Meus Sócios</a>
                `);
            }
            menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                <a class="dropdown-item" href="#lista-embarcacoes">Minhas Embarcações</a>
                <a class="dropdown-item" href="#lista-servicos">Meus Serviços</a>
            `);
        } else{
            //Insere o nome no menu
            menuUsuario.querySelector(".dropdown-toggle").innerHTML = usuario.nome;
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
            case "cadastro-embarcacao":
                document.getElementsByName("fk_empbarco")[0].value = usuario.id;
                break;

            case "cadastro-servico":
                let embarcacoesServico = await recuperarDados(`/api/buscar/embarcacao
                        ?colunas=id,nome,categoria,qtd_passageiros,qtd_tripulantes
                        &filtro=where fk_empbarco=${usuario.id} order by nome`),
                    opcoesEmbarcacao = document.getElementsByName("fk_embarcacao")[0],
                    formServico = document.getElementById("form-servico");
                //Encerra se a lista estiver vazia
                if(embarcacoesServico.length == 0){
                    document.getElementById("div-content").insertAdjacentHTML("beforeend", "<p>Você não possui nenhuma embarcação registrada.</p>");
                    break;
                }
                //Insere dados no formulário
                document.getElementsByName("fk_empresa")[0].value = usuario.id;
                embarcacoesServico.forEach(embarcacao =>{
                    let tipoServico = "";
                    if(embarcacao.categoria=="Barco"){
                        tipoServico = "Passeio de "+embarcacao.categoria;
                    } else{
                        tipoServico = "Aluguel de "+embarcacao.categoria;
                    }
                    opcoesEmbarcacao.insertAdjacentHTML("beforeend", `
                        <option value="${embarcacao.id}" data-categoria="${embarcacao.categoria}">${embarcacao.nome} - ${tipoServico} - ${embarcacao.qtd_passageiros} passageiros</option>
                    `);
                });
                formServico.removeAttribute("hidden");
                //Muda o URL do POST de acordo com a embarcação
                let setActionURL = function(){
                    let categoria = opcoesEmbarcacao.options[opcoesEmbarcacao.selectedIndex].dataset.categoria;
                    if(categoria == "Barco"){
                        formServico.action="/api/incluir/aluguelbarco?redirect=lista-servicos";
                    } else{
                        formServico.action="/api/incluir/alugalancha?redirect=lista-servicos";
                    }
                }
                setActionURL();
                opcoesEmbarcacao.addEventListener("change", setActionURL);
                //Validação da data
                document.getElementsByName("data_aluguel")[0].addEventListener("change", (e)=>{
                    if(new Date(e.currentTarget.value).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)){
                        document.getElementById("erro-data").removeAttribute("hidden","");
                        document.querySelector(".btn").setAttribute("disabled","");
                    } else{
                        document.getElementById("erro-data").setAttribute("hidden","");
                        document.querySelector(".btn").removeAttribute("disabled","");
                    }
                });
                break;    

            case "cadastro-socio":
                document.getElementsByName("fk_empresa")[0].value = usuario.id;
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
                gerarCards("cards-barcos", listaBarcos, "traves");
                //Cria um modal quando um dos cards é clicado
                document.querySelectorAll(".card").forEach(card =>{
                    card.addEventListener("click", (e)=>{
                        gerarModal(listaBarcos, e.currentTarget.id, {
                            nome: "Nome",
                            categoria: "Categoria",
                            numero: "Número",
                            data: "Data de Registro",
                            validade: "Validade do Documento",
                            qtd_passageiros: "Passageiros",
                            qtd_tripulantes: "Tripulantes",
                            atividade: "Atividade",
                            area_nav: "Área de Navegação",
                            cidade: "Cidade",
                            valor: "Valor"
                        }, ['proa', 'popa', 'traves', 'interior1', 'interior2', 'interior3']);
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

            case "lista-servicos":
                if(!listaAlugueis) listaAlugueis = await recuperarDados(`/api/buscar/alugalancha_empresa
                    ?filtro=where fk_empresa=${usuario.id}
                    order by data_aluguel`);
                if(!listaPasseios) listaPasseios = await recuperarDados(`/api/buscar/aluguelbarco_empresa
                    ?filtro=where fk_empresa=${usuario.id}
                    order by data_aluguel`);
                //Tabela de aluguéis
                let cabecalhosAlugueis = ["Embarcação","Comprador","Data do Evento","Preço unitário","Status"];
                document.getElementById("tabela-alugueis").innerHTML = gerarTabela(listaAlugueis, cabecalhosAlugueis);
                $("#tabela-alugueis").DataTable();
                //Tabela de passeios
                let cabecalhosPasseios = ["Embarcação","Passageiros","Data do Evento","Preço unitário","Status"];
                document.getElementById("tabela-passeios").innerHTML = gerarTabela(listaPasseios, cabecalhosPasseios);
                $("#tabela-passeios").DataTable();
                break;

            case "lista-socios":
                if(!listaSocios) listaSocios = await recuperarDados(`/api/buscar/socio
                    ?colunas=id,nome,cpf,data_nasc,rua,bairro,cidade,estado,pais,cep,altoAcesso
                    &filtro=where fk_empresa=${usuario.id} 
                    order by nome`);
                let cabecalhosSocios = ["Nome","CPF","Data Nasc.","Endereço","Bairro","Cidade","Estado","País","CEP","Alto Acesso"];
                document.getElementById("tabela-socios").innerHTML = gerarTabela(listaSocios, cabecalhosSocios);
                break;

            case "login":
                let flash = await recuperarDados("/api/dados/flash"),
                    labelLogin = document.getElementById("label-login"),
                    linkCadastro = document.getElementById("link-cadastro");
                if(linkRedirect){
                    document.getElementsByName("redirect_url")[0].value = linkRedirect;
                }
                if(flash){
                    document.getElementById("msg-flash").innerHTML= flash.message;
                }
                document.getElementById("opcao-vinculo").addEventListener("change", (e)=>{
                    switch(e.currentTarget.value){
                        case "empresa":
                            labelLogin.innerHTML = "CNPJ";
                            linkCadastro.innerHTML = `<a href="#cadastro-empresa">Cadastre a sua empresa</a>`;
                            break;
                        case "socio":
                            labelLogin.innerHTML = "CPF";
                            linkCadastro.innerHTML = ``;
                            break;
                        default:
                            labelLogin.innerHTML = "Login";
                            linkCadastro.innerHTML = `<a href="#cadastro-cliente">Cadastre-se!</a>`;
                            break;
                    }
                });
                break;

            case "pagina-inicial":
                $('.carousel').carousel()
                if(!usuario || usuario.vinculo=="cliente"){
                    document.getElementById("area-cliente").removeAttribute("hidden");
                    //Obtenção dos serviços do banco de dados
                    if(!listaAlugueis) listaAlugueis = await recuperarDados(`/api/buscar/alugalancha
                        ?colunas=alugalancha.*, embarcacao.nome, fotoembar.traves
                        &filtro=join embarcacao on fk_embarcacao=embarcacao.id 
                        join fotoembar on fk_embarcacao=fotoembar.fk_embar 
                        where status="Ativo"
                    `);
                    if(!listaPasseios) listaPasseios = await recuperarDados(`/api/buscar/aluguelbarco
                        ?colunas=aluguelbarco.*, embarcacao.nome, fotoembar.traves
                        &filtro=join embarcacao on fk_embarcacao=embarcacao.id 
                        join fotoembar on fk_embarcacao=fotoembar.fk_embar 
                        where status="Ativo"
                    `);
                    //Exibição dos aluguéis
                    if(listaAlugueis.length > 0){
                        gerarCards("cards-alugueis", listaAlugueis, "traves");
                    } else{
                        document.getElementById("cards-alugueis").innerHTML = "<p>Nenhum aluguel disponível no momento.</p>"
                    }
                    //Exibição dos passeios
                    if(listaPasseios.length > 0){
                        gerarCards("cards-passeios", listaPasseios, "traves");
                    } else{
                        document.getElementById("cards-passeios").innerHTML = "<p>Nenhum passeio disponível no momento.</p>"
                    }
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
        case "#cadastro-embarcacao":
        case "#cadastro-servico":
        case "#lista-embarcacoes":
        case "#lista-servicos":
            if(!usuario || usuario.vinculo=="cliente"){
                return false;
            }
            break;

        //Permissões somente para empresa
        case "#lista-socios":
        case "#cadastro-socio":
            if(!usuario || usuario.vinculo!="empresa"){
                return false;
            }
            break;

        //Impede que um usuário já logado acesse o login novamente
        case "#cadastro-cliente":
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
        console.log("AJAX " + msg.responseText);
    });
    return dados;
};


//Formatação de data
function formatarData(stringData, hora=false){
    stringData = new Date(stringData);
    let data = `${stringData.getDate()}/${stringData.getMonth()+1}/${stringData.getFullYear()}`;
    if(hora){
        let hh = stringData.getHours() < 10 ? '0'+stringData.getHours() : stringData.getHours(),
            mm = stringData.getMinutes() < 10 ? '0'+stringData.getMinutes() : stringData.getMinutes();
        data += ` ${hh}:${mm}`;
    }
    return data;
}

//Formatação de moeda
function formatarMoeda(stringMoeda){
    return `R$${stringMoeda.toFixed(2).replace(".",",")}`;
}


//Gera uma tabela com os dados e os nomes de cabeçalho recebidos
function gerarTabela (dados, cabecalhos){
    //Encerra se a lista estiver vazia
    if(dados.length == 0){
        return "<td>Nenhum registro encontrado.</td>";
    }
    //Cabeçalho
    //let tabela=`<thead><tr><th></th>`;
    let tabela=`<thead><tr>`;
    cabecalhos.forEach(nome =>{
        tabela+=`<th scope="col">${nome}</th>`;
    });
    tabela+="</tr></thead><tbody>";
    //Valores
    dados.forEach(dado =>{
        /* tabela+=`<tr><td>
            <i class="fas fa-edit" id="alterar-${dado.id}"></i>
            <i class="fas fa-times" id="excluir-${dado.id}"></i>
            </td>`; */
        tabela+=`<tr>`;
        Object.keys(dado).map(valor =>{
            switch(valor){
                case "id":
                case "fk_embarcacao":
                case "fk_empresa":
                case "fk_usuario":
                    break;
                case "data_nasc":
                    tabela+=`<td>${formatarData(dado[valor])}</td>`;
                    break;
                case "data_aluguel":
                    tabela+=`<td>${formatarData(dado[valor], true)}</td>`;
                    break;
                case "altoAcesso":
                    if(dado[valor] == 1){
                        tabela+=`<td><i class="fas fa-check"></i></td>`;
                    } else{
                        tabela+=`<td></td>`;
                    }
                    break;
                case "valor":
                    tabela+=`<td>${formatarMoeda(dado[valor])}</td>`;
                    break;
                default:
                    if(!dado[valor]){
                        tabela+=`<td>--</td>`;
                    } else{
                        tabela+=`<td>${dado[valor]}</td>`;
                    }
                    break;
            }
        });
        tabela+="</tr>"
    });
    tabela+="</tbody>";
    return tabela;
}


//Gera um grupo de cards e insere-o na página
function gerarCards(divID, lista, campoFoto){
    document.getElementById(divID).innerHTML = "";
    for(let i=0; i<lista.length; i++){
        let extensao = `${lista[i][campoFoto]}`.split("."),
            descricao;
        switch(divID){
            case "cards-barcos":
                descricao = lista[i].categoria;
                break;
            case "cards-alugueis":
            case "cards-passeios":
                descricao = `${formatarMoeda(lista[i].valor)}<br>${formatarData(lista[i].data_aluguel, true)}`;
                break;
        }
        document.getElementById(divID).insertAdjacentHTML("beforeend", `
            <div class="card m-1" id="${i}">
                <img class="card-img-top" src="data:${extensao[1]};base64, ${extensao[0]}">
                <p class="card-text text-center">${lista[i].nome}<br><small class="text-muted">${descricao}</small></p>
            </div>
        `);
    }
}


//Cria o corpo do modal e exibe-o na página
function gerarModal(lista, i, cabecalhos, fotos=[]){
    let modalBody="";
    //Inserir campos que não são imagens
    Object.keys(cabecalhos).map(objeto =>{
        let objetoValor = lista[i][objeto];
        switch(objeto){
            case "data":
            case "validade":
                objetoValor = formatarData(lista[i][objeto]);
                break;
            case "valor":
                objetoValor = formatarMoeda(lista[i][objeto]);
                break;
        }
        modalBody += `<b>${cabecalhos[objeto]}:</b> ${objetoValor}<br>`;
    });
    //Inserir imagens
    if(fotos.length > 0){
        modalBody += `<p><b>Fotos:</b></p><div class="row">`;
        fotos.forEach(foto =>{
            let fotoSplit = `${lista[i][foto]}`.split(".");
            modalBody += `<img class="img-anexo" src="data:${fotoSplit[1]};base64, ${fotoSplit[0]}">`;
        });
        modalBody += `</div>`;
    }
    //Exibir modal
    document.querySelector(".modal-body").innerHTML = modalBody;
    $('.modal').modal('show');
}