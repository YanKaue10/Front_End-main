document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();
            const senha = document.getElementById('senha').value.trim();
            const mensagemErro = document.getElementById('mensagem-erro');

            if (usuario === 'admin' && senha === '1234') {
                window.location.href = 'admin.html';
            } else if (usuario === 'professor' && senha === 'abcd') {
                window.location.href = 'professor.html';
            } else {
                mensagemErro.textContent = 'Usuário ou senha inválidos.';
                mensagemErro.style.color = 'red';
            }
        });
    }
});

// área de login
function acessarComo(perfil) {
    if (perfil === 'professor') {
        window.location.href = 'professor-login.html';
    } else if (perfil === 'admin') {
        window.location.href = 'admin-login.html';
    }
}