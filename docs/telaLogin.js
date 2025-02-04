// Função para verificar email e senha
function tentarEntrar(event) {
    event.preventDefault();

    var email = document.querySelector('.email').value;
    var senha = document.querySelector('.senha').value;

    if (!email || !senha) {
        showAlert("Por favor, preencha todos os campos!");
        return;
    }

    if (email === "sa@gmail.com" && senha === "1234") {

        window.location.href = "index.html";
    } else {
        showAlert("E-mail ou senha inválidos. Tente novamente.");
    }
}

function showAlert(message) {
    const alertBox = document.getElementById('alert-box');
    alertBox.querySelector('.alert-message').textContent = message;
    alertBox.style.display = 'block';
}

function closeAlert() {
    document.getElementById('alert-box').style.display = 'none';
}