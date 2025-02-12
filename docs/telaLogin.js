
const emailInput = document.querySelector('.email');
const senhaInput = document.querySelector('.senha');

// Botando um eventlistener que vai ler a tecla apertada e se for a tecla 'Enter'
// ele vai jogar a gente pra tela inicial, seja apertando enter no campo do email
emailInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        tentarEntrar(event);
    }
});

// ou apertando aqui no campo da senha
senhaInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        tentarEntrar(event);
    }
});

// Função para verificar email e senha
function tentarEntrar(event) {
    event.preventDefault();

    var email = document.querySelector('.email').value.trim();
    var senha = document.querySelector('.senha').value.trim();
    //adicionei o .trim depois do .value para remover os espaços em branco na confirmação dos valores

    if (!email || !senha) {
        showAlert("Por favor, preencha todos os campos!");
        return;
    }

     // Validação simples do formato do e-mail
     // se não conter @ nem pontuação vai falhar e enviar o alerta
     if (!email.includes('@') || !email.includes('.')) {
        showAlert("Por favor, insira um e-mail válido!");
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