// home.js - Funcionalidades específicas da página inicial

document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();       //chamada de método initializeHomePage
});


function initializeHomePage() {
    initializeFavorites();      //chamada de outros métodos + organização de código
    initializeProductAnimations();
    updateCartCount();    
}


//função para mudar o coração com clique -> parte de favoritar
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) { //evento inicia ao clicar
            e.preventDefault();
            button.textContent = button.textContent === '🤍' ? '❤️' : '🤍';
        });
    });
}


//função para adicionar animação nos cards dos produtos
function initializeProductAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {      
        card.addEventListener('mouseenter', () => {     //Mouse por cima -> zoom
            card.style.transform = 'translateY(-5px)';  //junção com CSS
            card.style.transition = 'transform 0.3s ease';  //junção com CSS
        });

        card.addEventListener('mouseleave', () => {     //Mouse fora -> volta ao normal
            card.style.transform = 'translateY(0)';
        });
    });
}


//Essa função fará com que a contagem de itens no carrinho seja atualizada
function updateCartCount() {
    const cartItems = getCartItems();
    const cartLink = document.querySelector('.carrinho-link');
    if (cartLink) {
        cartLink.textContent = `Carrinho(${cartItems.length})`; //Exibe em texto
    }
}

//Aqui mostrará na tela que o produto foi adicionado
function addToCart(product) {
    const cartItems = getCartItems();
    cartItems.push(product);
    saveCartItems(cartItems);
    updateCartCount();  //Chama updateCartCount() porque ele irá atualizar quando o produto for adicionado ao carrinho 
}

//Junta os itens
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

//Deixa salvo no carrinho, assim impede que o carrinho esvazie caso o usuário troque de tela
function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}


// Primeiro, essa função irá obter todos os produtos da grid
const getAllProducts = () => {
    return Array.from(document.querySelectorAll('.product-card')).map(card => ({
        element: card,
        title: card.querySelector('.product-title').textContent.toLowerCase(),
        price: card.querySelector('.price').textContent,
        rating: card.querySelector('.rating').textContent,
        sales: card.querySelector('.sales').textContent
    }));
};


// Função para fazer scroll suave até os produtos
const scrollToProducts = () => {
    const productSection = document.getElementById('roupas');
    productSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
};


// Função para mostrar/esconder produtos baseado na pesquisa
const filterProducts = (searchTerm, shouldScroll = true) => {
    const products = getAllProducts();
    const productGrid = document.getElementById('roupas');
    let foundProducts = false;


    // Remove mensagem de "não encontrado" se existir
    const existingMessage = document.querySelector('.no-products-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    //Essa função faz com que a pesquisa funcione para letras maiúsculas e minúsculas
    products.forEach(product => {
        if (product.title.includes(searchTerm.toLowerCase())) {
            product.element.style.display = 'block';
            foundProducts = true;
        } else {
            product.element.style.display = 'none';
        }
    });


    // Se nenhum produto for encontrado, mostrar mensagem avisando
    if (!foundProducts) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-products-message';
        messageDiv.style.cssText = `
            width: 100%;
            text-align: center;
            padding: 20px;
            font-size: 1.2em;
            color: #666;
            grid-column: 1 / -1;
        `;
        messageDiv.textContent = 'Produto não encontrado';
        productGrid.appendChild(messageDiv);
    }


    // Fazer scroll apenas se shouldScroll for true e houver uma pesquisa
    if (shouldScroll && searchTerm.trim() !== '') {
        scrollToProducts();
    }
};


// Evento de pesquisa no input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');


    // Pesquisar quando clicar no ícone de busca
    searchIcon.addEventListener('click', () => {
        filterProducts(searchInput.value, true);
    });

    // Pesquisar quando pressionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterProducts(searchInput.value, true);
        }
    });

    // Pesquisa em tempo real enquanto digita (sem scroll automático)
    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            // Se o input estiver vazio, ele irá mostrar todos os produtos
            filterProducts('', false);
        } else {
            filterProducts(e.target.value, false);
        }
    });
});


//Criando classe para manipular carrossel
class Carrossel {                    
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector('.wrapper-carrossel');
        this.slides = container.querySelectorAll('.slide-carrossel');
        this.botaoAnterior = container.querySelector('.anterior');
        this.botaoProximo = container.querySelector('.proximo');
        this.containerPontos = container.querySelector('.pontos-carrossel');
        
        this.indiceAtual = 0;
        this.quantidadeSlides = this.slides.length;
        this.intervaloAutoPlay = null;
        
        this.inicializar();
    }
    
    inicializar() {
        // Criar pontos de navegação
        this.criarPontos();
        
        // Adicionar ouvintes de eventos
        this.botaoAnterior.addEventListener('click', () => this.anterior());
        this.botaoProximo.addEventListener('click', () => this.proximo());
        
        // Pausar autoplay no hover
        this.container.addEventListener('mouseenter', () => this.pausarAutoPlay());
        this.container.addEventListener('mouseleave', () => this.iniciarAutoPlay());
        
        // Iniciar autoplay
        this.iniciarAutoPlay();
        
        // Atualizar pontos inicial
        this.atualizarPontos();
    }
    
    //Função de criar os pontos
    criarPontos() {
        for (let i = 0; i < this.quantidadeSlides; i++) {
            const ponto = document.createElement('div');
            ponto.className = 'ponto';
            ponto.addEventListener('click', () => this.irParaSlide(i));
            this.containerPontos.appendChild(ponto);
        }
    }
    
    //Atualizando
    atualizarPontos() {
        const pontos = this.containerPontos.querySelectorAll('.ponto');
        pontos.forEach((ponto, indice) => {
            ponto.classList.toggle('ativo', indice === this.indiceAtual);
        });
    }
    
    //Movendo os slides do carrossel
    irParaSlide(indice) {
        this.indiceAtual = indice;
        const deslocamento = -indice * 100;
        this.wrapper.style.transform = `translateX(${deslocamento}%)`;
        this.atualizarPontos();
    }
    
    //Função que move para a próxima foto
    proximo() {             //Utilizando contador para somar + 1
        this.indiceAtual = (this.indiceAtual + 1) % this.quantidadeSlides;
        this.irParaSlide(this.indiceAtual);
    }
    
    //Função para voltar slides
    anterior() {
        this.indiceAtual = (this.indiceAtual - 1 + this.quantidadeSlides) % this.quantidadeSlides;
        this.irParaSlide(this.indiceAtual);
    }
    
    //Essa função deixa o carrossel movendo por conta própria
    iniciarAutoPlay() {
        if (this.intervaloAutoPlay) return;
        this.intervaloAutoPlay = setInterval(() => this.proximo(), 5000); // Muda a cada 5 segundos
    }
    
    //Aqui é criado um intervalo entre as fotos
    pausarAutoPlay() {
        if (this.intervaloAutoPlay) {
            clearInterval(this.intervaloAutoPlay);
            this.intervaloAutoPlay = null;
        }
    }
}


// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const containerCarrossel = document.querySelector('.container-carrossel');
    new Carrossel(containerCarrossel);
});


//Função que adiciona um evento para o input de email, ao clicar no botão CADASTRAR, o email é validado pelo sistema
document.getElementById("botaoCadastrar").addEventListener("click", function () {
    const emailInput = document.getElementById("meu-email").value;
    const emailSinais = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Aqui, a função verifica os sinais

    if (emailSinais.test(emailInput)) {
        window.alert("E-mail cadastrado com sucesso!");
    } else {
        window.alert("E-mail inválido!");
    }

    document.getElementById("meu-email").value = "";
});
