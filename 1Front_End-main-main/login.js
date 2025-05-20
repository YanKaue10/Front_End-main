document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();
            const senha = document.getElementById('senha').value.trim();
            const mensagemErro = document.getElementById('mensagem-erro');

                if (senha === '1234') {
                    //acessar como admin
                window.location.href = 'admin.html';
            } else if (senha === 'abcd') {
                //acessar como professor
                window.location.href = 'professor.html';
            } else {
                mensagemErro.textContent = 'Senha incorreta';
                mensagemErro.style.color = 'red';
            }
            
            try {
            
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json'
                    },
                    body: JSON.stringify({ usuario, senha })
                });

                if (!response.ok) {
                    throw new Error(data.mensage || 'Usuário ou senha inválidos.');
                }

                if (data.perfil === 'admin') {
                    window.location.href = 'admin.html';
                } else if (data.perfil === 'professor') {
                    window.location.href = 'professor.html';
                } else {
                    throw new Error('Perfil desconhecido.');
                }
            } catch (error) {
                mensagemErro.textContent = error.message;
                mensagemErro.style.color = 'red';
            }
        });
    }
});