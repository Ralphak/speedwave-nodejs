var usuario, endereco, ftpPath, linkAtivo, linkRedirect, listaAlugueis, listaAlugueisCliente, listaBarcos, listaExtrato, listaPasseios, listaPasseiosCliente, listaSocios, detalhesServico, dadosCallback;


//Eventos que devem ocorrer assim que o site é carregado
document.addEventListener("DOMContentLoaded", async()=>{
    //recuperar dados
    usuario = await recuperarDados("/api/dados/usuario");
    ftpPath = await recuperarDados("/api/env/ftpPath");

    //alterar menus com base no login, exibindo a página ao finalizar
    let menuUsuario = document.getElementById("menu-usuario");
    if(usuario){
        menuUsuario.querySelector(".dropdown").removeAttribute("hidden");
        if(usuario.vinculo=="empresa" || usuario.vinculo=="socio"){
            //Insere a razão social no menu
            menuUsuario.querySelector(".dropdown-toggle").innerHTML = usuario.razao;
            //Itens do menu (empresa)
            if(usuario.vinculo=="empresa"){
                menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                    <a class="dropdown-item" href="#lista-socios">Meus Sócios</a>
                `);
            }
            menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                <a class="dropdown-item" href="#lista-embarcacoes">Minhas Embarcações</a>
                <a class="dropdown-item" href="#lista-servicos">Meus Serviços</a>
                <a class="dropdown-item" href="#extrato">Extrato de Vendas</a>
            `);
        } else{
            //Insere o nome no menu
            menuUsuario.querySelector(".dropdown-toggle").innerHTML = usuario.nome;
            //Itens do menu (cliente)
            menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
                <a class="dropdown-item" href="#lista-servicos-cliente">Meus Serviços</a>
                <a class="dropdown-item" href="#servicos">Serviços Disponíveis</a>
            `);
        }
        menuUsuario.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", `
            <a class="dropdown-item" href="#alterar-senha">Alterar Senha</a>
            <a class="dropdown-item" href="/api/logout">Sair</a>
        `);
    } else{
        menuUsuario.insertAdjacentHTML("beforeend", `
            <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                <a class="nav-link botao" href="#login">Login</a>
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

    //Marcação do link ativo no menu
    if(linkAtivo){
        linkAtivo.classList.remove("active");
    }
    linkAtivo = document.querySelector(`a[href='${location.hash}']`);
    if(linkAtivo){
        linkAtivo.classList.add("active");
    }

    //Carrega a página, adicionando parâmetros para páginas específicas
    $("#div-content").load(`${pagina}.html`, async()=>{
        switch(pagina){
            case "admin":
                document.getElementById("admin-senha").addEventListener("submit", async(e)=>{
                    e.preventDefault();
                    //Validar senha
                    let senhaAdmin = await recuperarDados("/api/env/admin");
                    if(e.target[0].value != senhaAdmin){
                        document.getElementById("erro-senha").removeAttribute("hidden","");
                        return;
                    }
                    //Obter dados
                    let empresasPendentes = await recuperarDados(`/api/buscar/empresabarco
                            ?filtro=join endemp on endemp.fk_empresa=empresabarco.id
                            where autorizado=0`),
                        barcosPendentes = await recuperarDados(`/api/buscar/embarcacao
                            ?filtro=where autorizado=0`),
                        cabecalhosEmpresas = [], cabecalhosBarcos = [];
                    //Empresas
                    if(empresasPendentes.length > 0){
                        Object.keys(empresasPendentes[0]).map(nome=>{
                            if(nome!="id" && nome!="fk_empresa" && nome!="autorizado"){
                                cabecalhosEmpresas.push(nome);
                            }
                        });
                        empresasPendentes.forEach(empresa=>{
                            empresa.campoAutorizar="";
                        });
                    }
                    //Barcos
                    if(barcosPendentes.length > 0){
                        Object.keys(barcosPendentes[0]).map(nome=>{
                            if(nome!="id" && nome!="fk_empbarco" && nome!="autorizado"){
                                cabecalhosBarcos.push(nome);
                            }
                        });
                        barcosPendentes.forEach(barco=>{
                            barco.campoAutorizar="";
                        });
                    }
                    //Geração das tabelas
                    document.getElementById("admin-tabelas").removeAttribute("hidden","");
                    document.getElementById("tabela-admin-empresas").innerHTML = gerarTabela(empresasPendentes, cabecalhosEmpresas);
                    document.getElementById("tabela-admin-barcos").innerHTML = gerarTabela(barcosPendentes, cabecalhosBarcos);
                    document.querySelectorAll("input[type=radio]").forEach(radio=>{
                        radio.addEventListener("click", (e)=>{
                            let justifDiv = document.getElementById(`espacoInput_${radio.name.split('_').pop()}`),
                                justifInput = `<input name="justificativa_${radio.name.split('_').pop()}" placeholder="Justificativa" maxlength="255" required>`;
                            if(e.currentTarget.value==0){
                                justifDiv.innerHTML = justifInput;
                            } else{
                                justifDiv.innerHTML = "";
                            }
                        });
                    });
                    document.getElementById("admin-senha").remove();
                });
                break;
            case "alterar-senha":
                let flashSenha = await recuperarDados("/api/dados/flash");
                if(flashSenha){
                    document.getElementById("msg-flash").innerHTML= flashSenha.message;
                }
                confirmarSenha();
                break;
            case "cadastro-cliente":
            case "cadastro-empresa":
                confirmarSenha();
                break;

            case "cadastro-embarcacao":
                document.getElementsByName("fk_empbarco")[0].value = usuario.id;
                break;

            case "cadastro-servico":
                let embarcacoesServico = await recuperarDados(`/api/buscar/embarcacao
                        ?colunas=id,nome,categoria,max_passageiros,max_tripulantes
                        &filtro=where autorizado=1 and fk_empbarco=${usuario.id} order by nome`),
                    selectEmbarcacao = document.getElementsByName("fk_embarcacao")[0],
                    formServico = document.getElementById("form-servico");
                //Encerra se a lista estiver vazia
                if(embarcacoesServico.length == 0){
                    document.getElementById("div-content").insertAdjacentHTML("beforeend", "<p>Você não possui nenhuma embarcação registrada e aprovada.</p>");
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
                    selectEmbarcacao.insertAdjacentHTML("beforeend", `
                        <option value="${embarcacao.id}" data-categoria="${embarcacao.categoria}" data-passageiros="${embarcacao.max_passageiros}">${embarcacao.nome} - ${tipoServico} - ${embarcacao.max_passageiros} passageiros</option>
                    `);
                });
                formServico.removeAttribute("hidden");
                //Muda o URL do POST de acordo com a embarcação. Também habilita o limite de passageiros em passeios de barco.
                let setActionURL = function(){
                    let categoria = selectEmbarcacao.options[selectEmbarcacao.selectedIndex].dataset.categoria;
                    if(categoria == "Barco"){
                        formServico.action="/api/incluir/aluguelbarco?redirect=lista-servicos";
                        //limite de passageiros
                        let passageiros = selectEmbarcacao.options[selectEmbarcacao.selectedIndex].dataset.passageiros;
                        document.getElementById("div-limite").innerHTML = `
                            <label for="lim_passageiros">Limite de Passageiros: </label>
                            <input name="lim_passageiros" type="number" min="1" max="${passageiros}" required>
                            <label for="lim_passageiros"> de ${passageiros}</label>
                        `;
                    } else{
                        formServico.action="/api/incluir/alugalancha?redirect=lista-servicos";
                        document.getElementById("div-limite").innerHTML = '';
                    }
                }
                setActionURL();
                selectEmbarcacao.addEventListener("change", setActionURL);
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
                confirmarSenha();
                break;            

            case "detalhes-pedido":
                if(!detalhesServico){ 
                    document.getElementById("exibicao-carregando").innerHTML = "Por favor clique/toque em Voltar e tente novamente."
                    break;
                }
                let apiGetnet = document.getElementById("api-getnet").dataset,
                    apiToken = await recuperarDados("/getnet/autenticar"),
                    orderID = await recuperarDados("/api/buscar/pagamentos?colunas=max(id) as id"),
                    nomeSplit = usuario.nome.split(" ", 2),
                    divFotos = "", nomesFotos = ["proa","popa","traves","interior1","interior2","interior3"],
                    porcAluguel = 0.1, porcPasseio = 0.172;
                if(!endereco) endereco = await recuperarDados(`/api/buscar/endereco?filtro=where fk_usuario=${usuario.id}`);
                orderID = orderID ? orderID[0].id + 1 : 1;
                //Valores iniciais
                apiGetnet.getnetToken = `${apiToken.token_type} ${apiToken.access_token}`;
                apiGetnet.getnetCustomerid = usuario.id;
                apiGetnet.getnetOrderid = orderID;
                apiGetnet.getnetCustomerAddressCity = endereco[0].cidade;
                apiGetnet.getnetCustomerAddressComplementary = endereco[0].complemento;
                apiGetnet.getnetCustomerAddressNeighborhood = endereco[0].bairro;
                apiGetnet.getnetCustomerAddressState = endereco[0].estado;
                apiGetnet.getnetCustomerAddressStreet = endereco[0].rua;
                apiGetnet.getnetCustomerAddressStreetNumber = endereco[0].numero;
                apiGetnet.getnetCustomerAddressZipcode = endereco[0].cep;
                apiGetnet.getnetCustomerCountry = "Brasil";
                apiGetnet.getnetCustomerDocumentNumber = usuario.cpf;
                apiGetnet.getnetCustomerEmail = usuario.email;
                apiGetnet.getnetCustomerFirstName = nomeSplit[0];
                apiGetnet.getnetCustomerLastName = nomeSplit[1];
                apiGetnet.getnetCustomerPhoneNumber = usuario.telefone;
                //Detalhes do Pedido
                document.getElementById("servico-nome").innerHTML = detalhesServico.nome;
                if(detalhesServico.categoria == "Lancha"){
                    document.getElementById("servico-passageiros").innerHTML = detalhesServico.max_passageiros + " passageiros";
                    document.getElementById("esconder-cap").removeAttribute("hidden");
                }
                document.getElementById("servico-preco").innerHTML = formatarMoeda(detalhesServico.valor);
                document.getElementById("servico-empresa").innerHTML = formatarMoeda(detalhesServico.razao);
                document.getElementById("servico-local").innerHTML = detalhesServico.cidade;
                document.getElementById("servico-data").innerHTML = formatarData(detalhesServico.data_aluguel, true);
                nomesFotos.forEach(foto=>{
                    divFotos += `<img class="img-anexo" src="${ftpPath + detalhesServico[foto]}">`;
                });
                document.getElementById("servico-fotos").innerHTML = divFotos;
                document.getElementById("servico-comprador").innerHTML = usuario.nome;
                document.getElementById("servico-endereco").innerHTML = `${endereco[0].rua} ${endereco[0].numero} ${endereco[0].complemento} ${endereco[0].bairro} ${endereco[0].cidade} ${endereco[0].estado}`;
                //Envia os valores para a API
                if(detalhesServico.categoria == "Barco"){
                    document.getElementById("form-pedido").insertAdjacentHTML("afterbegin", `
                        <label for="qtd_passageiros"><b>Nº de Pessoas: </b></label>
                        <input name="qtd_passageiros" type="number" min=1 max=${detalhesServico.lim_passageiros - detalhesServico.num_passageiros} value=1>
                        Máximo de ${detalhesServico.lim_passageiros - detalhesServico.num_passageiros}<br>
                        <b>Preço Total: </b>R$<span id="servico-preco-total">${detalhesServico.valor}</span><br><br>
                        <input name="nome" placeholder="Nome do Passageiro" maxlength="255" required><br>
                        <div id="passageiros-extras"></div><br>
                    `);
                    bloquearEnvio("form-pedido", "pay-button-getnet");
                    document.querySelector(".pay-button-getnet").disabled = true;
                    //Valor Inicial
                    apiGetnet.getnetAmount = (detalhesServico.valor * porcPasseio).toFixed(2);
                    apiGetnet.getnetItems = `[{"name": "${detalhesServico.nome}","description": "Passeio de Barco", "value": ${(detalhesServico.valor * porcPasseio).toFixed(2)}, "quantity": 1,"sku": ""}]`;
                    //Atualização do valor
                    let precoTotal = detalhesServico.valor;
                    document.getElementsByName("qtd_passageiros")[0].addEventListener("change", (e)=>{
                        precoTotal = (detalhesServico.valor * e.currentTarget.value).toFixed(2);
                        document.getElementById("servico-preco-total").innerHTML = precoTotal;
                        apiGetnet.getnetAmount = (precoTotal * porcPasseio).toFixed(2);
                        apiGetnet.getnetItems = `[{"name": "${detalhesServico.nome}","description": "Passeio de Barco", "value": ${(precoTotal * porcPasseio).toFixed(2)}, "quantity": ${e.currentTarget.value},"sku": ""}]`;
                        document.getElementById("passageiros-extras").innerHTML = "";
                        if(e.currentTarget.value >= 2){
                            for(let i=2; i<=e.currentTarget.value; i++){
                                document.getElementById("passageiros-extras").insertAdjacentHTML("beforeend", `
                                    <input name="nome" placeholder="Nome do Passageiro" maxlength="255" required><br>
                                `);
                            }
                        }
                        bloquearEnvio("form-pedido", "pay-button-getnet");
                    });
                    //Construção dos dados do callback
                    document.getElementById("form-pedido").addEventListener("change", ()=>{
                        let nomePassageiros = "";
                        document.getElementsByName("nome").forEach(nome =>{
                            nomePassageiros += nome.value.replace(",","") + ",";
                        });
                        //apiGetnet.getnetUrlCallback= `/getnet/registrar?bitmask=0,${orderID},${detalhesServico.fk_empresa},${precoTotal},${detalhesServico.id},${porcPasseio}&nome=${nomePassageiros}`;
                        dadosCallback = {
                            tipoServico: "Passeio de Barco",
                            id: orderID,
                            fk_empresa: detalhesServico.fk_empresa,
                            valor: precoTotal,
                            fk_aluguel: detalhesServico.id,
                            porcentagem: porcPasseio,
                            nomes: nomePassageiros
                        };
                    });
                } else{
                    apiGetnet.getnetAmount = (detalhesServico.valor * porcAluguel).toFixed(2);
                    apiGetnet.getnetItems = `[{"name": "${detalhesServico.nome}","description": "Aluguel de Lancha", "value": ${(detalhesServico.valor * porcAluguel).toFixed(2)}, "quantity": 1,"sku": ""}]`;
                    //apiGetnet.getnetUrlCallback = `/getnet/registrar?bitmask=1,${orderID},${detalhesServico.fk_empresa},${detalhesServico.valor},${detalhesServico.id},${porcAluguel}`;
                    dadosCallback = {
                        tipoServico: "Aluguel de Lancha",
                        id: orderID,
                        fk_empresa: detalhesServico.fk_empresa,
                        valor: detalhesServico.valor,
                        fk_aluguel: detalhesServico.id,
                        porcentagem: porcAluguel
                    };
                }
                //Exibir a página
                document.getElementById("exibicao-carregando").setAttribute("hidden","");
                document.getElementById("exibicao-pedido").removeAttribute("hidden");
                break;  
                
            case "extrato":
                if(!listaExtrato) listaExtrato = await recuperarDados(`/api/buscar/extrato
                    ?filtro=where fk_empresa=${usuario.id}
                    order by data_pagamento desc`);
                let cabecalhosExtrato = ["Valor Bruto","Data do Pagamento","Embarcação","Cliente"];
                document.getElementById("tabela-extrato").innerHTML = gerarTabela(listaExtrato, cabecalhosExtrato);
                if(listaExtrato.length > 0){
                    $("#tabela-extrato").DataTable();
                }
                break;

            case "getnet-sucesso":
                if(dadosCallback){
                    document.getElementById("div-content").insertAdjacentHTML("beforeend", `
                        <form id="getnet-post" action="/getnet/registrar" method="post" hidden>
                            <input name="tipoServico" value="${dadosCallback.tipoServico}" readonly>
                            <input name="id" value="${dadosCallback.id}" readonly>
                            <input name="fk_empresa" value="${dadosCallback.fk_empresa}" readonly>
                            <input name="valor" value="${dadosCallback.valor}" readonly>
                            <input name="fk_aluguel" value="${dadosCallback.fk_aluguel}" readonly>
                            <input name="porcentagem" value="${dadosCallback.porcentagem}" readonly>
                            <input name="nomes" value="${dadosCallback.nomes}" readonly>
                        </form>
                    `);
                    dadosCallback = null;
                    document.getElementById("getnet-post").submit();
                } else carregarPagina("");
                break;

            case "lista-embarcacoes":
                if(!listaBarcos) listaBarcos = await recuperarDados(`/api/buscar/embarcacao
                    ?filtro=join fotoembar on embarcacao.id=fotoembar.fk_embar
                    where autorizado=1 and fk_empbarco=${usuario.id} 
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
                        gerarModal(listaBarcos[e.currentTarget.id], {
                            nome: "Nome",
                            categoria: "Categoria",
                            numero: "Número",
                            data: "Data de Registro",
                            validade: "Validade do Documento",
                            max_passageiros: "Passageiros",
                            max_tripulantes: "Tripulantes",
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
                    order by data_aluguel desc`);
                if(!listaPasseios) listaPasseios = await recuperarDados(`/api/buscar/aluguelbarco_empresa
                    ?filtro=where fk_empresa=${usuario.id}
                    order by data_aluguel desc`);
                //Tabela de aluguéis
                let cabecalhosAlugueis = ["Embarcação","Comprador","Data do Evento","Preço unitário","Status"];
                document.getElementById("tabela-alugueis").innerHTML = gerarTabela(listaAlugueis, cabecalhosAlugueis);
                if(listaAlugueis.length > 0){
                    $("#tabela-alugueis").DataTable();
                }
                //Tabela de passeios
                let cabecalhosPasseios = ["Embarcação","Passageiros","Data do Evento","Preço unitário","Status"];
                document.getElementById("tabela-passeios").innerHTML = gerarTabela(listaPasseios, cabecalhosPasseios);
                if(listaPasseios.length > 0){
                    $("#tabela-passeios").DataTable();
                }
                //Exibir modal com os passageiros do passeio
                document.querySelectorAll(".ver-passageiros").forEach(botaoLista =>{
                    botaoLista.addEventListener("click", async(e)=>{
                        $('.modal').modal('show');
                        let passageirosEmpresa = await recuperarDados(`/api/buscar/passageiros
                            ?colunas=passageiros.nome, usuario.nome as comprador, usuario.cpf
                            &filtro=join usuario on fk_usuario=usuario.id
                            where fk_aluguelbarco=${e.currentTarget.id}
                            order by passageiros.nome`);
                        document.getElementById("tabela-passageiros").innerHTML = gerarTabela(passageirosEmpresa, ["Nome do Passageiro","Comprador","CPF do Comprador"]);
                    });
                });
                break;

            case "lista-servicos-cliente":
                if(!listaAlugueisCliente) listaAlugueisCliente = await recuperarDados(`/api/buscar/alugalancha_cliente
                    ?filtro=where fk_usuario=${usuario.id}
                    order by data_aluguel desc`);
                if(!listaPasseiosCliente) listaPasseiosCliente = await recuperarDados(`/api/buscar/aluguelbarco_cliente
                    ?filtro=where fk_usuario=${usuario.id}
                    order by data_aluguel desc`);
                //Tabela de aluguéis
                let clienteAlugueis = ["Embarcação","Cidade","Empresa","Valor Total","Valor a Pagar","Data do Evento"];
                document.getElementById("tabela-alugueis").innerHTML = gerarTabela(listaAlugueisCliente, clienteAlugueis);
                if(listaAlugueisCliente.length > 0){
                    $("#tabela-alugueis").DataTable();
                }
                //Tabela de passeios
                let clientePasseios = ["Embarcação","Cidade","Empresa","Nº de Pessoas","Valor Total","Valor a Pagar","Data do Evento"];
                console.log(listaPasseiosCliente);
                document.getElementById("tabela-passeios").innerHTML = gerarTabela(listaPasseiosCliente, clientePasseios);
                if(listaPasseiosCliente.length > 0){
                    $("#tabela-passeios").DataTable();
                }
                //Exibir modal com os passageiros do passeio
                document.querySelectorAll(".ver-pessoas").forEach(botaoLista =>{
                    botaoLista.addEventListener("click", async(e)=>{
                        document.querySelector(".modal-body").innerHTML = "Carregando...";
                        $('.modal').modal('show');
                        let passageirosCliente = await recuperarDados(`/api/buscar/passageiros
                            ?colunas=nome
                            &filtro=where fk_usuario=${usuario.id} and fk_aluguelbarco=${botaoLista.id} and fk_pagamento=${botaoLista.dataset.pagamento}
                            order by nome`);
                        document.querySelector(".modal-body").innerHTML = "";
                        passageirosCliente.forEach(pessoa =>{
                            document.querySelector(".modal-body").insertAdjacentHTML("beforeend", `<p>${pessoa.nome}</p>`)
                        });
                    });
                });
                break;

            case "lista-socios":
                if(!listaSocios) listaSocios = await recuperarDados(`/api/buscar/socio
                    ?colunas=id,nome,cpf,data_nasc,email,rua,bairro,cidade,estado,cep,altoAcesso
                    &filtro=where fk_empresa=${usuario.id} 
                    order by nome`);
                let cabecalhosSocios = ["Nome","CPF","Data Nasc.","Email","Endereço","Bairro","Cidade","Estado","CEP","Alto Acesso"];
                listaSocios.forEach(socio=>{
                    socio.botaoExcluir="";
                });
                document.getElementById("tabela-socios").innerHTML = gerarTabela(listaSocios, cabecalhosSocios);
                if(listaSocios.length < 5){
                    document.getElementById("div-content").insertAdjacentHTML("beforeend", `
                        <p><a href="#cadastro-socio">Cadastrar um Sócio</a></p>
                    `);
                }
                break;

            case "login":
                let flash = await recuperarDados("/api/dados/flash"),
                    labelLogin = document.getElementById("label-login"),
                    linkCadastro = document.getElementById("link-cadastro");
                if(linkRedirect && linkRedirect != "/#detalhes-pedido"){
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

            case "quem-somos":
                let quemsomosMenu = document.querySelectorAll(".quemsomos"),
                    quemsomosInfo = document.getElementById("quemsomos_info").querySelectorAll("div"),
                    quemsomosAtivo = 0;
                for(let i=0; i<quemsomosMenu.length; i++){
                    quemsomosMenu[i].addEventListener("click", (e)=>{
                        e.preventDefault();
                        quemsomosInfo[quemsomosAtivo].setAttribute("hidden","");
                        quemsomosInfo[i].removeAttribute("hidden");
                        quemsomosAtivo = i;
                    });
                }
                break;

            case "servicos":
                //Obtenção dos serviços do banco de dados
                if(!listaAlugueis) listaAlugueis = await recuperarDados(`/api/buscar/alugalancha
                    ?colunas=alugalancha.*, embarcacao.nome, embarcacao.categoria, embarcacao.cidade, embarcacao.max_passageiros, fotoembar.*, empresabarco.razao
                    &filtro=join embarcacao on fk_embarcacao=embarcacao.id
                    join fotoembar on fk_embarcacao=fotoembar.fk_embar
                    join empresabarco on fk_empresa=empresabarco.id
                    where status="Ativo"
                `);
                if(!listaPasseios) listaPasseios = await recuperarDados(`/api/buscar/aluguelbarco_empresa
                    ?colunas=aluguelbarco_empresa.*, embarcacao.nome, embarcacao.categoria, embarcacao.cidade, fotoembar.*, empresabarco.razao
                    &filtro=join embarcacao on fk_embarcacao=embarcacao.id
                    join fotoembar on fk_embarcacao=fotoembar.fk_embar
                    join empresabarco on fk_empresa=empresabarco.id
                    where status="Ativo"
                `);
                //Exibição dos aluguéis
                if(listaAlugueis.length > 0){
                    gerarCards("cards-alugueis", listaAlugueis, "traves", "detalhes-pedido");
                } else{
                    document.getElementById("cards-alugueis").innerHTML = "<p>Nenhum aluguel disponível no momento.</p>"
                }
                //Exibição dos passeios
                if(listaPasseios.length > 0){
                    gerarCards("cards-passeios", listaPasseios, "traves", "detalhes-pedido");
                } else{
                    document.getElementById("cards-passeios").innerHTML = "<p>Nenhum passeio disponível no momento.</p>"
                }
                //Ir para a compra ao clicar no card
                document.getElementById("cards-alugueis").querySelectorAll(".card").forEach(card =>{
                    card.addEventListener("click", (e)=>{
                        detalhesServico = listaAlugueis[e.currentTarget.id];
                    });
                });
                document.getElementById("cards-passeios").querySelectorAll(".card").forEach(card =>{
                    card.addEventListener("click", (e)=>{
                        detalhesServico = listaPasseios[e.currentTarget.id];
                    });
                });
                //Fitro da lista
                document.getElementsByName("filtroServicos").forEach(radio =>{
                    radio.addEventListener("click", (e)=>{
                        if(e.target.value == "Passeios"){
                            document.getElementById("titulo-passeios").removeAttribute("hidden","");
                            document.getElementById("cards-passeios").removeAttribute("hidden","");
                            document.getElementById("titulo-alugueis").setAttribute("hidden","");
                            document.getElementById("cards-alugueis").setAttribute("hidden","");
                        } else if(e.target.value == "Alugueis"){
                            document.getElementById("titulo-passeios").setAttribute("hidden","");
                            document.getElementById("cards-passeios").setAttribute("hidden","");
                            document.getElementById("titulo-alugueis").removeAttribute("hidden","");
                            document.getElementById("cards-alugueis").removeAttribute("hidden","");
                        } else{
                            document.getElementById("titulo-passeios").removeAttribute("hidden","");
                            document.getElementById("cards-passeios").removeAttribute("hidden","");
                            document.getElementById("titulo-alugueis").removeAttribute("hidden","");
                            document.getElementById("cards-alugueis").removeAttribute("hidden","");
                        }
                    });
                });
                //Busca nos cards
                document.getElementById("busca-cards").addEventListener("change", (e)=>{
                    document.querySelectorAll(".card-text").forEach(card=>{
                        let stringBusca = card.innerHTML;
                        [`<br>`, `<small class="text-muted">`, `</small>`].forEach(tag=>{
                            stringBusca = stringBusca.split(tag).join(" ");
                        });
                        if(e.target.value == "" || stringBusca.match(new RegExp(e.target.value,"i"))){
                            card.parentElement.removeAttribute("hidden");
                        } else{
                            card.parentElement.setAttribute("hidden","");
                        }
                    });
                });
                break;
        }
    });
}


//Verificar permissões de acesso
function permitirAcesso(pagina){
    switch(pagina){
        //Permissões para qualquer usuário logado
        case "#alterar-senha":
            if(!usuario){
                return false;
            }
            break;

        //Permissões para empresa e sócio
        case "#cadastro-embarcacao":
        case "#cadastro-servico":
        case "#lista-embarcacoes":
        case "#lista-servicos":
        case "#extrato":
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
            
        //Permissões somente para cliente
        case "#detalhes-pedido":
        case "#lista-servicos-cliente":
        case "#servicos":
            if(!usuario || usuario.vinculo!="cliente"){
                return false;
            }
            break;

        //Impede que um usuário já logado acesse o login novamente
        case "#cadastro-cliente":
        case "#cadastro-empresa":
        case "#esqueci-senha":
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
        console.log(`AJAX ${msg.responseText}`);
        $.post("/api/erro", {erro: `AJAX ${msg.responseText}`});
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
    if(typeof stringMoeda == "number"){
        return `R$${stringMoeda.toFixed(2).replace(".",",")}`;
    } else return stringMoeda;
}


//Gera uma tabela com os dados e os nomes de cabeçalho recebidos
function gerarTabela (dados, cabecalhos){
    //Encerra se a lista estiver vazia
    if(dados.length == 0){
        return "<td>Nenhum registro encontrado.</td>";
    }
    //Cabeçalho
    let tabela=`<thead><tr>`;
    cabecalhos.forEach(nome =>{
        tabela+=`<th scope="col">${nome}</th>`;
    });
    tabela+="</tr></thead><tbody>";
    //Valores
    dados.forEach(dado =>{
        tabela+=`<tr>`;
        Object.keys(dado).map(valor =>{
            switch(valor){
                case "autorizado":
                case "id":
                case "fk_embarcacao":
                case "fk_empresa":
                case "fk_empbarco":
                case "fk_usuario":
                case "fk_aluguelbarco":
                case "fk_pagamento":
                case "lim_passageiros":
                    break;
                case "botaoExcluir":
                    tabela+=`<td><form method="post" action="/api/excluir/socio">
                        <input name="id" value="${dado.id}" hidden>
                        <input name="url" value="/${location.hash}" hidden>
                        <button type="submit" class="btn btn-danger btn-sm">Remover</button>
                        </form></td>`;
                    break;
                case "campoAutorizar":
                    let urlArquivos = ftpPath, categoria;
                    if(dados[0].razao){
                        urlArquivos += "/empresas/" + dado.id;
                        categoria = "empresa";
                    } else{
                        urlArquivos += "/barcos/" + dado.id;
                        categoria = "barco";
                    }
                    tabela+=`<td>
                        <input type="radio" name="radio_${categoria}-${dado.id}" value=1> Sim
                        <input type="radio" name="radio_${categoria}-${dado.id}" value=0> Não
                        <div id="espacoInput_${categoria}-${dado.id}"></div>
                        <button type="button" class="btn btn-primary btn-sm" onclick="window.open('${urlArquivos}');" id="${dado.id}">Ver Documentação</button>
                        </td>`;
                    break;
                case "data":
                case "data_inicio":
                case "data_nasc":
                case "validade":
                    tabela+=`<td>${formatarData(dado[valor])}</td>`;
                    break;
                case "data_aluguel":
                case "data_pagamento":
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
                    tabela+=`<td>${formatarMoeda(dado.valor)}</td>`;
                    break;
                case "num_passageiros":
                    if(dado.num_passageiros > 0){
                        tabela+=`<td>${dado.num_passageiros} de ${dado.lim_passageiros} 
                            <button class="btn btn-primary btn-sm ver-passageiros" id="${dado.id}">Ver Lista</button>
                            </td>`;
                    } else{
                        tabela+=`<td>${dado.num_passageiros} de ${dado.lim_passageiros}</td>`;
                    }
                    break;
                case "num_pessoas":
                    tabela+=`<td>${dado.num_pessoas} 
                        <button class="btn btn-primary btn-sm ver-pessoas" id="${dado.id}" data-pagamento=${dado.fk_pagamento}>Ver Lista</button>
                        </td>`;
                    break;
                case "porcentagem":
                    tabela+=`<td>${formatarMoeda(dado.valor * (1-dado.porcentagem))}</td>`;
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
function gerarCards(divID, lista, campoFoto, link){
    document.getElementById(divID).innerHTML = "";
    for(let i=0; i<lista.length; i++){
        let titulo, descricao;
        switch(divID){
            case "cards-barcos":
                titulo = lista[i].nome;
                descricao = lista[i].categoria;
                break;
            case "cards-alugueis":
            case "cards-passeios":
                titulo = `${lista[i].nome}<br>${formatarMoeda(lista[i].valor)}`;
                descricao = `${lista[i].razao}<br>${lista[i].cidade}<br>${formatarData(lista[i].data_aluguel, true)}`;
                if(divID == "cards-alugueis"){
                    descricao += `<br>${lista[i].max_passageiros} passageiros`;
                }
                break;
        }
        if(link){
            link = `href=/#${link}`;
        }
        document.getElementById(divID).insertAdjacentHTML("beforeend", `
            <a ${link}><div class="card m-1" id="${i}">
                <img class="card-img-top img-cards" src="${ftpPath + lista[i][campoFoto]}">
                <p class="card-text text-center">${titulo}<br><small class="text-muted">${descricao}</small></p>
            </div></a>
        `);
    }
}


//Cria o corpo do modal e exibe-o na página
function gerarModal(objeto, cabecalhos, fotos=[]){
    let modalBody="";
    //Inserir campos que não são imagens
    Object.keys(cabecalhos).map(nome =>{
        switch(nome){
            case "data":
            case "validade":
                objeto[nome] = formatarData(objeto[nome]);
                break;
            case "valor":
                objeto[nome] = formatarMoeda(objeto[nome]);
                break;
        }
        modalBody += `<b>${cabecalhos[nome]}:</b> ${objeto[nome]}<br>`;
    });
    //Inserir imagens
    if(fotos.length > 0){
        modalBody += `<p><b>Fotos:</b></p><div class="row">`;
        fotos.forEach(foto =>{
            modalBody += `<img class="img-anexo" src="${ftpPath + objeto[foto]}">`;
        });
        modalBody += `</div>`;
    }
    //Exibir modal
    document.querySelector(".modal-body").innerHTML = modalBody;
    $('.modal').modal('show');
}


//Bloqueia o botão se houver campo vazio
function bloquearEnvio(classeForm, classeBtn="btn"){
    let form = document.getElementById(classeForm),
        botao = document.querySelector(`.${classeBtn}`);
    form.addEventListener("change", ()=>{
        botao.disabled = false;
        try{
            document.querySelectorAll("input[required]").forEach(campo =>{
                if(campo.value == ""){
                    throw vazio;
                }
            });
        }catch(vazio){
            botao.disabled = true;
        }
    });
}


//Confirmação de senha
function confirmarSenha(){
    document.querySelector("form").addEventListener("change", (e)=>{
        if(e.currentTarget.senha.value != document.querySelector(".confirmar_senha").value){
            document.getElementById("erro-senha").removeAttribute("hidden","");
            document.querySelector(".btn").setAttribute("disabled","");
        } else{
            document.getElementById("erro-senha").setAttribute("hidden","");
            document.querySelector(".btn").removeAttribute("disabled","");
        }
    });
}