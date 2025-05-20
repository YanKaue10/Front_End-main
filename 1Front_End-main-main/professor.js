document.addEventListener("DOMContentLoaded", () => {
    const softwareForm = document.getElementById("software-form");
    const solicitacaoForm = document.getElementById("solicitacao-form");
    const professorForm = document.getElementById("professor-form");
    const softwareSelect = document.getElementById("software");
    const listaSoftwares = document.getElementById("lista-softwares");
    const professorSelect = document.getElementById("professor");
    const listaSolicitacoes = document.getElementById("lista-solicitacoes");
    const listaProfessores = document.getElementById("lista-professores");
    const BASE_URL = 'http://localhost:8080/api';

    // Carregar dados do localStorage
    document.addEventListener("DOMContentLoaded", () => {
        carregarSoftwares();
        carregarProfessores();

        const solicitacaoForm = document.getElementById("solicitacao-form");
        const reclamacaoForm = document.getElementById("reclamacao-form");

        if (solicitacaoForm) {
            solicitacaoForm.addEventListener("submit", enviarSolicitacao);
        }

        if (reclamacaoForm) {
            reclamacaoForm.addEventListener("submit", enviarReclamacao);
        }
    });

    // Carregar softwares para selects e listas
    async function carregarSoftwares() {
        try {
            const response = await fetch(`${BASE_URL}/softwares`);
            if (!response.ok) throw new Error('Erro ao carregar softwares');

            const softwares = await response.json();
            const softwareSelect = document.getElementById("software");

            // Preencher select
            if (softwareSelect) {
                softwareSelect.innerHTML = softwares.map(s =>
                    `<option value="${s.id}">${s.nome} (${s.versao})</option>`
                ).join("");
            }

            // Atualizar lista de visualização
            if (listaSoftwares) {
                listaSoftwares.innerHTML = softwares.map(software => `
                <li>
                    <strong>${software.nome}</strong> - v${software.versao} 
                    (${software.tipo}) - 
                    <span style="color: ${software.disponivel ? 'green' : 'red'}">
                        ${software.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                    ${software.descricao ? `<p>${software.descricao}</p>` : ''}
                </li>
            `).join("");
            }
        } catch (error) {
            console.error('Erro ao carregar softwares:', error);
            alert('Falha ao carregar lista de softwares');
        }
    }
    // Carregar professores para selects e listas
    async function carregarProfessores() {
        try {
            const response = await fetch(`${BASE_URL}/professores`);
            if (!response.ok) throw new Error('Erro ao carregar professores');

            const professores = await response.json();
            const professorSelect = document.getElementById("professor");

            // Preencher select
            if (professorSelect) {
                professorSelect.innerHTML = professores.map(p =>
                    `<option value="${p.id}">${p.nome} (${p.escola})</option>`
                ).join("");
            }

            // Atualizar lista de visualização
            if (listaProfessores) {
                listaProfessores.innerHTML = professores.map(professor => `
                <li>
                    ${professor.nome} - ${professor.escola}
                    <button onclick="editarProfessor(${professor.id})">Editar</button>
                    <button onclick="deletarProfessor(${professor.id})">Excluir</button>
                </li>
            `).join("");
            }
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
            alert('Falha ao carregar lista de professores');
        }
    }

    // Enviar solicitação de instalação
    async function enviarSolicitacao(event) {
        event.preventDefault();

        const solicitacao = {
            professorId: document.getElementById("professor").value,
            softwareId: document.getElementById("software").value,
            laboratorio: document.getElementById("laboratorio").value,
            data: document.getElementById("data").value,
            observacoes: document.getElementById("observacoes").value
        };

        try {
            const response = await fetch(`${BASE_URL}/solicitacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(solicitacao)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar solicitação');
            }

            document.getElementById("mensagem-solicitacao").innerHTML =
                "<span style='color: green;'>Solicitação enviada com sucesso!</span>";
            event.target.reset();
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            document.getElementById("mensagem-solicitacao").innerHTML =
                `<span style='color: red;'>Erro: ${error.message}</span>`;
        }
    }

    // Enviar reclamação
    async function enviarReclamacao(event) {
        event.preventDefault();

        const texto = document.getElementById("texto-reclamacao").value.trim();
        if (!texto) {
            document.getElementById("mensagem-reclamacao").innerHTML =
                "<span style='color: red;'>Digite sua reclamação!</span>";
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/reclamacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto })
            });

            if (!response.ok) throw new Error('Erro ao enviar reclamação');

            document.getElementById("mensagem-reclamacao").innerHTML =
                "<span style='color: green;'>Reclamação registrada com sucesso!</span>";
            event.target.reset();
        } catch (error) {
            console.error('Erro ao enviar reclamação:', error);
            document.getElementById("mensagem-reclamacao").innerHTML =
                `<span style='color: red;'>Erro: ${error.message}</span>`;
        }
    }

    // Função para carregar os softwares disponíveis
    function carregarSoftwaresDisponiveis() {
        const listaSoftwares = document.getElementById("lista-softwares");
        if (!listaSoftwares) {
            return;
        }

        // Carrega os softwares do localStorage
        let softwares = JSON.parse(localStorage.getItem("softwares")) || [];

        // Verifica se há softwares
        if (softwares.length > 0) {
            softwares.forEach(software => {
                const li = document.createElement("li");

                // Verifica se o software está indisponível
                const statusIndisponivel = software.indisponivel ? "<span style='color: red;'>Indisponível</span>" : "<span style='color: green;'>Disponível</span>";

                // Formato para exibição: Nome, Versão, Tipo, Laboratório, Status de disponibilidade
                const infoTexto = `
                    <strong>Nome:</strong> ${software.nome} <br>
                    <strong>Versão:</strong> ${software.versao || 'N/A'} — 
                    <strong>Tipo:</strong> ${software.tipo || 'N/A'} — 
                    <strong>Status:</strong> ${statusIndisponivel}
                `;

                li.innerHTML = infoTexto;
                listaSoftwares.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "Nenhum software disponível no laboratório.";
            listaSoftwares.appendChild(li);
        }
    }


    // Chama a função para carregar os softwares
    carregarSoftwaresDisponiveis();


    // Função de atualização da lista de professores
    function atualizarLista() {
        if (listaProfessores) {
            listaProfessores.innerHTML = professores.map(professor =>
                `<li>${professor.nome}</li>`).join("");
        } else {
            return;
        }
    }

    // Atualiza a lista de softwares no select de solicitacoes
    if (softwareSelect) {
        softwareSelect.innerHTML = softwares.map(s => `<option value="${s.nome}">${s.nome}</option>`).join("");
    }

    // EXIBIR SOFTWARES COMO CHECKBOXES (sem criar novo DOMContentLoaded)

    const checkboxesSoftwares = document.getElementById("checkboxes-softwares");

    function exibirSoftwaresComCheckboxes() {
        if (!checkboxesSoftwares) return;

        // Carrega de novo os softwares atualizados
        let softwares = JSON.parse(localStorage.getItem("softwares")) || [];

        // Filtra somente disponíveis
        let softwaresDisponiveis = softwares.filter(software => !software.indisponivel);

        if (softwaresDisponiveis.length > 0) {
            softwaresDisponiveis.forEach(software => {
                const div = document.createElement("div");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `software-${software.nome}`;
                checkbox.name = "softwaresUsados";
                checkbox.value = software.nome;

                const label = document.createElement("label");
                label.setAttribute("for", checkbox.id);
                label.textContent = software.nome;

                div.appendChild(checkbox);
                div.appendChild(label);
                checkboxesSoftwares.appendChild(div);
            });
        } else {
            checkboxesSoftwares.innerHTML = "<p>Nenhum software disponível para uso.</p>";
        }
    }

    // Depois de carregar a lista de softwares normais, exibe os checkboxes
    exibirSoftwaresComCheckboxes();


    // Preenche o select de professores
    if (professorSelect) {
        professorSelect.innerHTML = '';
        if (professores.length > 0) {
            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.textContent = "Selecione um Professor";
            professorSelect.appendChild(optionDefault);

            professores.forEach((prof) => {
                const option = document.createElement("option");
                option.value = prof.nome;
                option.textContent = prof.nome;
                professorSelect.appendChild(option);
            });
        } else {
            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.textContent = "Nenhum professor cadastrado";
            professorSelect.appendChild(optionDefault);
        }
    }

    // Solicitação de instalação
    if (solicitacaoForm) {
        solicitacaoForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const professor = document.getElementById("professor").value;
            const software = document.getElementById("software").value;
            const laboratorio = document.getElementById("laboratorio").value;
            const data = document.getElementById("data").value;

            const novaSolicitacao = { professor, software, laboratorio, data };

            // recupera solicitações anteriores (ou array vazio)
            const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

            // adiciona a nova
            solicitacoes.push(novaSolicitacao);

            // salva de volta
            localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));

            console.log("Solicitação registrada:", novaSolicitacao);
            document.getElementById("mensagem-solicitacao").innerText = "Solicitação registrada com sucesso!";
            solicitacaoForm.reset();
        });

        // Verifique se o localStorage já contém os dados de software
        if (!localStorage.getItem("softwares")) {
            console.log("localStorage vazio. Definindo dados de teste...");
            localStorage.setItem("softwares", JSON.stringify([
                { nome: "Arq.95" },
                { nome: "D.2" },
                { nome: "Software.90" }
            ]));
        } else {
            console.log("Dados de softwares encontrados no localStorage.");
        }

        // Função para carregar os softwares disponíveis
        function carregarSoftwaresDisponiveis() {
            const listaSoftwares = document.getElementById("lista-softwares");
            if (!listaSoftwares) {
                return;
            }

            // Carrega os softwares do localStorage
            let softwares = JSON.parse(localStorage.getItem("softwares")) || [];

            // Verifica se há softwares
            if (softwares.length > 0) {
                softwares.forEach(software => {
                    const li = document.createElement("li");

                    // Verifica se o software está indisponível
                    const statusIndisponivel = software.indisponivel ? "<span style='color: red;'>Indisponível</span>" : "<span style='color: green;'>Disponível</span>";

                    // Formato para exibição: Nome, Versão, Tipo, Laboratório, Status de disponibilidade
                    const infoTexto = `
                <strong>Nome:</strong> ${software.nome} <br>
                <strong>Versão:</strong> ${software.versao || 'N/A'} — 
                <strong>Tipo:</strong> ${software.tipo || 'N/A'} — 
                <strong>Laboratório:</strong> ${encontrarLaboratorio(software.nome) || 'N/A'} —
                <strong>Status:</strong> ${statusIndisponivel}
            `;

                    li.innerHTML = infoTexto;
                    listaSoftwares.appendChild(li);
                });
            } else {
                const li = document.createElement("li");
                li.textContent = "Nenhum software disponível no laboratório.";
                listaSoftwares.appendChild(li);
            }

            function encontrarLaboratorio(softwareNome) {
                // Carrega os dados do localStorage onde os softwares estão armazenados por laboratório
                const laboratorioData = JSON.parse(localStorage.getItem("laboratorioData")) || {};

                // Verifica se o software existe no laboratório
                for (let laboratorio in laboratorioData) {
                    if (laboratorioData[laboratorio].includes(softwareNome)) {
                        return laboratorio;  // Retorna o nome do laboratório onde o software foi encontrado
                    }
                }
                return "N/A";  // Se não encontrar o software, retorna "N/A"
            }


        }

        // Atualiza a lista de professores
        atualizarLista();
    }

    const botaoEnviarSoftwares = document.getElementById("enviar-softwares");
    const mensagemEnvioSoftwares = document.getElementById("mensagem-envio-softwares");

    if (botaoEnviarSoftwares) {
        botaoEnviarSoftwares.addEventListener("click", () => {
            const checkboxesSelecionados = document.querySelectorAll("input[name='softwaresUsados']:checked");
            const softwaresSelecionados = Array.from(checkboxesSelecionados).map(cb => cb.value);

            if (softwaresSelecionados.length === 0) {
                mensagemEnvioSoftwares.innerText = "Por favor, selecione pelo menos um software.";
                mensagemEnvioSoftwares.style.color = "red";
                return;
            }

            // Salva os softwares selecionados
            localStorage.setItem("softwaresSelecionados", JSON.stringify(softwaresSelecionados));

            // Mostra a mensagem de sucesso
            mensagemEnvioSoftwares.innerText = "Softwares usados enviados com sucesso!";
            mensagemEnvioSoftwares.style.color = "green";

            // Desmarca todos os checkboxes
            checkboxesSelecionados.forEach(cb => {
                cb.checked = false;
            });
        });
    }

    const reclamacaoForm = document.getElementById("reclamacao-form");
    const textoReclamacao = document.getElementById("texto-reclamacao");
    const mensagemReclamacao = document.getElementById("mensagem-reclamacao");

    if (reclamacaoForm) {
        reclamacaoForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const texto = textoReclamacao.value.trim();
            if (texto === "") {
                mensagemReclamacao.innerText = "Por favor, escreva algo antes de enviar.";
                mensagemReclamacao.style.color = "red";
                return;
            }

            // Recupera reclamações antigas
            let reclamacoes = JSON.parse(localStorage.getItem("reclamacoes")) || [];

            // Adiciona a nova reclamação
            reclamacoes.push({ texto });

            // Salva no localStorage
            localStorage.setItem("reclamacoes", JSON.stringify(reclamacoes));

            // Mensagem de sucesso
            mensagemReclamacao.innerText = "Reclamação enviada com sucesso!";
            mensagemReclamacao.style.color = "green";

            // Limpa o campo de texto
            textoReclamacao.value = "";
        });
    }


    const formSolicitacao = document.getElementById("solicitacao-form");
    const mensagemSolicitacao = document.getElementById("mensagem-solicitacao");

    if (formSolicitacao) {
        formSolicitacao.addEventListener("submit", (event) => {
            event.preventDefault(); // evita o envio normal do formulário

            const professor = document.getElementById("professor").value;
            const software = document.getElementById("software").value;
            const laboratorio = document.getElementById("laboratorio").value;
            const data = document.getElementById("data").value;

            // Pega solicitações já existentes
            const solicitacoesSalvas = JSON.parse(localStorage.getItem("solicitacoes")) || [];

            // Verifica se já existe uma solicitação com o mesmo software e laboratório
            const solicitacaoExistente = solicitacoesSalvas.find(solicitacao =>
                solicitacao.software === software && solicitacao.laboratorio === laboratorio
            );

            if (solicitacaoExistente) {
                mensagemSolicitacao.innerText = "Erro: Este software já foi instalado neste laboratório.";
                mensagemSolicitacao.style.color = "red";
                return; // Não salva novamente
            }

            // Se não existir, salva nova solicitação
            const novaSolicitacao = { professor, software, laboratorio, data };
            solicitacoesSalvas.push(novaSolicitacao);
            localStorage.setItem("solicitacoes", JSON.stringify(solicitacoesSalvas));

            mensagemSolicitacao.innerText = "Solicitação enviada com sucesso!";
            mensagemSolicitacao.style.color = "green";

            // Limpa o formulário para nova tentativa
            formSolicitacao.reset();
        });
    }

});







