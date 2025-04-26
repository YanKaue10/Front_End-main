let indiceEdicaoProfessor = null;

document.addEventListener("DOMContentLoaded", () => {
    const softwareForm = document.getElementById("software-form");
    const solicitacaoForm = document.getElementById("solicitacao-form");
    const professorForm = document.getElementById("professor-form");
    const softwareSelect = document.getElementById("software");
    const lista = document.getElementById("lista-softwares");
    const paginaAtual = window.location.pathname.split("/").pop(); // pega só o nome do arquivo 
    const isAdminPage = paginaAtual === "admin-lista.html";
    const listaSolicitacoes = document.getElementById("lista-solicitacoes");
    const listaProfessores = document.getElementById("lista-professores");
    let softwares = JSON.parse(localStorage.getItem("softwares")) || [];
    let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    const professores = JSON.parse(localStorage.getItem("professores")) || [];

    atualizarLista(); //atualiza a lista que mostra os professores cadastrados


     // preenche o select de software na solicitação
     if (softwareSelect) {
        softwareSelect.innerHTML = softwares.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    }

    //permite excluir, editar ou marcar como indisponivel o software desejado
 // Função para renderizar a lista de softwares
function renderizarListaSoftwares() {
    if (!listaAdmin) return;

    listaAdmin.innerHTML = '';
    const softwares = JSON.parse(localStorage.getItem("softwares")) || [];

    softwares.forEach((soft, index) => {
        const li = document.createElement("li");
        
        // Verifica se está na página admin-lista.html antes de mostrar os botões
        const isAdminPage = window.location.pathname.includes("admin-lista.html");
        
        li.innerHTML = `
            <strong>${soft.nome}</strong> — Versão: ${soft.versao} — Tipo: ${soft.tipo} — Data: ${soft.data}
            ${isAdminPage ? `
                <button class="editar" data-index="${index}">Editar</button>
                <button class="excluir" data-index="${index}">Excluir</button>
                <button class="indisponivel" data-index="${index}">
                    ${soft.indisponivel ? "Disponível" : "Indisponível"}
                </button>
            ` : ''}
        `;

        // Aplica estilo apenas se o botão existir (página admin)
        if (isAdminPage) {
            const botaoIndisponivel = li.querySelector(".indisponivel");
            if (soft.indisponivel) {
                botaoIndisponivel.style.backgroundColor = "#ffcccc"; // vermelho claro
            }
        }

        listaAdmin.appendChild(li);
    });
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", renderizarListaSoftwares);
    
    // EVENTO ÚNICO PARA INTERAÇÕES COM BOTÕES
    if (listaAdmin) {
        listaAdmin.addEventListener("click", (e) => {
            const target = e.target;
            const index = parseInt(target.dataset.index);
    
            if (target.classList.contains("excluir")) {
                const confirmacao = confirm("Tem certeza que deseja excluir este software?");
                if (confirmacao) {
                    excluirSoftware(index);
                }
            }
    
            if (target.classList.contains("editar")) {
                window.location.href = `admin-cadastro.html?editar=${index}`;
            }
    
            if (target.classList.contains("indisponivel")) {
                marcarIndisponivel(index);
            }
        });
    }
    
    function marcarIndisponivel(index) {
        softwares[index].indisponivel = !softwares[index].indisponivel;
        localStorage.setItem("softwares", JSON.stringify(softwares));
        renderizarListaSoftwares(); // RE-RENDERIZA
    }
    
    function excluirSoftware(index) {
        softwares.splice(index, 1);
        localStorage.setItem("softwares", JSON.stringify(softwares));
        renderizarListaSoftwares();
    }
    
    // INICIALIZA A LISTA
    renderizarListaSoftwares();
    



  
    // cadastro e edição de software
    if (softwareForm) {
        softwareForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome").value;
            const link = document.getElementById("link").value;
            const versao = document.getElementById("versao").value;
            const tipo = document.getElementById("tipo").value;
            const data = document.getElementById("data").value;
            const indexEdicao = document.getElementById("index-edicao").value;

            const novoSoftware = { nome, link, versao, tipo, data, disponivel: true };

            if (indexEdicao === "") {
                // novo cadastro
                softwares.push(novoSoftware);
                document.getElementById("mensagem").innerText = "Software cadastrado com sucesso!";
            } else {
                // atualização de software
                softwares[indexEdicao] = novoSoftware;
                document.getElementById("mensagem").innerText = "Software atualizado com sucesso!";
                document.getElementById("index-edicao").value = "";
                document.querySelector("button[type='submit']").textContent = "Cadastrar";
            }

            localStorage.setItem("softwares", JSON.stringify(softwares));
            softwareForm.reset();
    });

    // verifica se a página tem parâmetro para editar e preenche o formulário
    const params = new URLSearchParams(window.location.search);
    if (params.has("editar")) {
        const index = params.get("editar");
        const softwares = JSON.parse(localStorage.getItem("softwares")) || [];
        const software = softwares[index];
        if (software) {
            document.getElementById("nome").value = software.nome;
            document.getElementById("link").value = software.link;
            document.getElementById("versao").value = software.versao;
            document.getElementById("tipo").value = software.tipo;
            document.getElementById("data").value = software.data;
            document.getElementById("index-edicao").value = index;
            const botao = document.querySelector("#software-form button[type='submit']");
            if (botao) {
                botao.textContent = "Atualizar";
            }
            }
        }

    }

    // cadastro de Professor
    if (professorForm) {
        professorForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome-prof").value.trim();
            const escola = document.getElementById("escola").value.trim();
            const mensagem = document.getElementById("mensagem-professor");
            let professores = JSON.parse(localStorage.getItem("professores")) || [];

            if (!nome || !escola) {
                mensagem.innerText = "Preencha todos os campos.";
                mensagem.style.color = "red";
                return;
            }

            if (indiceEdicaoProfessor !== null) {
                // atualizar professor existente
                professores[indiceEdicaoProfessor] = { nome, escola };
                indiceEdicaoProfessor = null; // reseta o índice
                mensagem.innerText = "Professor atualizado com sucesso!";
                document.querySelector("#professor-form button[type='submit']").textContent = "Cadastrar";
            } else {
                // novo cadastro
                professores.push({ nome, escola });
                mensagem.innerText = "Professor cadastrado com sucesso!";
            }

            localStorage.setItem("professores", JSON.stringify(professores));
            professorForm.reset();

            atualizarLista(); // função para atualizar
        });
    }
});

// exibir lista de softwares na página admin-lista.html
    const listaAdmin = document.getElementById("lista-softwares");
    if (listaAdmin) {
    listaAdmin.innerHTML = '';
    softwares.forEach((soft, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <strong>${soft.nome}</strong> — Versão: ${soft.versao} — Tipo: ${soft.tipo} — Data: ${soft.data}
                    <button onclick="editarSoftware(${index})">Editar</button>
                    <button onclick="excluirSoftware(${index})">Excluir</button>
                    <button onclick="marcarIndisponivel(${index})">Indisponível</button>
                `;
        listaAdmin.appendChild(li);
    });

}


//solicitações de software(página do admin)
    const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    const tabelaSolicitacoes = document.getElementById("lista-solicitacoes");
    

    if (tabelaSolicitacoes) {
        if (solicitacoes.length === 0) { //se n tiver dados mostra uma mensagem 
        const linha = document.createElement("tr");
        linha.innerHTML = "<td colspan='5'>Nenhuma solicitação encontrada.</td>";
        tabelaSolicitacoes.appendChild(linha);
    } else {
        solicitacoes.forEach((solicitacao, index) => { //cria uma linha para cada solicitação 
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${solicitacao.professor || 'N/A'}</td>
                <td>${solicitacao.software}</td>
                <td>${solicitacao.laboratorio}</td>
                <td>${solicitacao.data}</td>
                <td>
                    <button class="aprovar">Aprovar</button>
                    <button class="alterar">Alterar</button>
                    <button class="excluir">Excluir</button>
                </td>
            `;

            // Botões
            const btnAprovar = linha.querySelector(".aprovar");
            const btnAlterar = linha.querySelector(".alterar");
            const btnExcluir = linha.querySelector(".excluir");

            if (solicitacao.status === "aprovado") {
                btnAprovar.disabled = true;
                btnAprovar.textContent = "Aprovado";
                linha.style.backgroundColor = "#d4edda";
            }
            btnAprovar.addEventListener("click", () => {
                let solicitacoesAtualizadas = JSON.parse(localStorage.getItem("solicitacoes")) || [];
                
                const solicitacaoIndex = solicitacoesAtualizadas.findIndex(s =>
                    s.software === solicitacao.software &&
                    s.professor === solicitacao.professor &&
                    s.laboratorio === solicitacao.laboratorio &&
                    s.data === solicitacao.data
                );
            
                if (solicitacaoIndex !== -1) {
                    const solicitacaoAprovada = solicitacoesAtualizadas[solicitacaoIndex];
                    solicitacaoAprovada.status = "aprovado";
            
                    // Salva no localStorage para a página do professor ver depois
                    let laboratorioData = JSON.parse(localStorage.getItem("laboratorioData")) || [];
                    laboratorioData.push(solicitacaoAprovada);
                    localStorage.setItem("laboratorioData", JSON.stringify(laboratorioData));
            
                    // Aqui adiciona o software aprovado ao professor
                    const professores = JSON.parse(localStorage.getItem("professores")) || [];
                    const professor = professores.find(p => p.nome === solicitacao.professor);
                    
                    if (professor) {
                        // Adiciona o software aprovado ao array de softwares do professor
                        if (!professor.softwares) {
                            professor.softwares = [];
                        }
                        professor.softwares.push(solicitacaoAprovada.software);
                        localStorage.setItem("professores", JSON.stringify(professores));
                    }
            
                    // Remove da lista de solicitações
                    solicitacoesAtualizadas.splice(solicitacaoIndex, 1);
                    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoesAtualizadas));
            
                    // Remove do DOM
                    linha.remove();
                }
            });
            
            
            
            
            btnAlterar.addEventListener("click", () => { //modifica o nome do software
                const novoSoftware = prompt("Editar nome do software:", solicitacao.software);
                if (novoSoftware !== null) {
                    solicitacoes[index].software = novoSoftware;
                    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
                    linha.children[1].textContent = novoSoftware;
                }
            });

            btnExcluir.addEventListener("click", () => { //remove o item do array e atualiza o localStorage
                if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
                    solicitacoes.splice(index, 1);
                    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
                    linha.remove();
                }
            });

            tabelaSolicitacoes.appendChild(linha);
        });

        
    }
}

// seleciona o elemento select
    const professorSelect = document.getElementById("professor");

// se o select de professor for encontrado
        if (professorSelect) {
    // recupera os professores do localStorage 
    const professores = JSON.parse(localStorage.getItem("professores")) || [];

    // limpa o conteúdo do select antes de adicionar as opções
    professorSelect.innerHTML = '';

    // verifica se há professores no localStorage
    if (professores.length > 0) {
        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        professorSelect.appendChild(optionDefault);

        // para cada professor, cria uma nova opção no select
        professores.forEach((prof) => {
            const option = document.createElement("option");
            option.value = prof.nome;  // o valor da opção será o nome do professor
            option.textContent = prof.nome;  // o texto visível será o nome do professor
            professorSelect.appendChild(option);  // adiciona a opção ao select
        });
    } else {
        // caso não haja professores, adicione uma opção informando ao usuário
        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        optionDefault.textContent = "Nenhum professor cadastrado";
        professorSelect.appendChild(optionDefault);
    }
} else {
    // console.error('O professor não foi encontrado.');

}


    // Preenche o select de software sem duplicar
    const softwareSelect = document.getElementById("softwareSelect");
    if (softwareSelect) {
        softwareSelect.innerHTML = ""; // Limpa para evitar duplicações

    softwares.forEach((soft) => {
        const option = document.createElement("option");
        option.value = soft.nome;
        option.text = soft.nome;
        softwareSelect.add(option);
    });
}

    // exibir lista de professores na página admin-lista.html
    const listaProfessores = document.getElementById("listaProfessores");

    if (listaProfessores) {
    listaProfessores.innerHTML = '';
    professores.forEach((prof, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
                ${prof.nome} — Escola: ${prof.escola}
                <button onclick="editarProfessor(${index})">Editar</button>
                <button onclick="excluirProfessor(${index})">Excluir</button>
            `;
        listaProfessores.appendChild(li);
    });
}
    //botoes de excluir e editar
    function excluirProfessor(index) {
        const professores = JSON.parse(localStorage.getItem("professores")) || [];
        professores.splice(index, 1);
        localStorage.setItem("professores", JSON.stringify(professores));
        location.reload(); // recarrega para atualizar a lista
}

    function editarProfessor(index) {
        const professores = JSON.parse(localStorage.getItem("professores")) || [];
        const prof = professores[index];

    document.getElementById("nome-prof").value = prof.nome;
    document.getElementById("escola").value = prof.escola;

    // define o índice que está sendo editado
    indiceEdicaoProfessor = index;

    // atualiza o texto do botão para "Atualizar"
    document.querySelector("#professor-form button[type='submit']").textContent = "Atualizar";
}
    //lista professores cadastrados
    function atualizarLista() {
        const listaProfessores = document.getElementById("lista-professores");
        const professores = JSON.parse(localStorage.getItem("professores")) || [];

    if (!listaProfessores) return;

    listaProfessores.innerHTML = '';
    professores.forEach((prof, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${prof.nome} — Escola: ${prof.escola}
            <button onclick="editarProfessor(${index})">Editar</button>
            <button onclick="excluirProfessor(${index})">Excluir</button>
        `;
        listaProfessores.appendChild(li);
    });
}
    function excluirSoftware(index) {
        const softwares = JSON.parse(localStorage.getItem("softwares")) || [];

    if (confirm("Tem certeza que deseja excluir este software?")) {
        softwares.splice(index, 1);
        localStorage.setItem("softwares", JSON.stringify(softwares));
        location.reload();
    }
    
    
    }



//confirmação de uso de software
function carregarConfirmacoesProfessor() {
    const listaConfirmacao = document.getElementById("lista-confirmacao");
    if (!listaConfirmacao) return;

    listaConfirmacao.innerHTML = ''; // Limpa a lista

    const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    const solicitacoesAprovadas = solicitacoes.filter(s => s.status === "aprovado");

    solicitacoesAprovadas.forEach((solicitacao, index) => {
        const div = document.createElement("div");
        div.className = "solicitacao-item";
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.borderRadius = "8px";
        div.style.backgroundColor = solicitacao.confirmado ? "#d4edda" : "#f8f9fa";

        div.innerHTML = `
            <strong>Professor:</strong> ${solicitacao.professor} <br>
            <strong>Software:</strong> ${solicitacao.software} <br>
            <strong>Laboratório:</strong> ${solicitacao.laboratorio} <br>
            <strong>Data:</strong> ${solicitacao.data} <br><br>
            <button onclick="confirmarUso(${index})" ${solicitacao.confirmado ? "disabled" : ""}>
                ${solicitacao.confirmado ? "Uso Confirmado" : "Confirmar Uso"}
            </button>
        `;

        listaConfirmacao.appendChild(div);

        
    });

    


    
}
