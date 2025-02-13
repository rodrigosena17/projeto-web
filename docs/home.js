// home.js - Funcionalidades específicas da página inicial

//Inicializando o DOM para carregar o metodo inicializarPaginaInicial()
document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaInicial();
});

//Esse metodo vai fazer uma chamada para outros metodos que sao menores
function inicializarPaginaInicial() {
    inicializarFavoritos();
    inicializarAnimacoesProdutos();
    atualizarContagemCarrinho();    
}

//Aqui é uma função de adicionar e remover o coração de favoritos do produto
function inicializarFavoritos() {
    const botoesFavoritos = document.querySelectorAll('.favorite-button');
    botoesFavoritos.forEach(botao => {
        botao.addEventListener('click', function(evento) { //A funcionalidade ativa por clique
            evento.preventDefault();
            botao.textContent = botao.textContent === '🤍' ? '❤️' : '🤍';
        });
    });
}

//Essa função basicamente irá fazer com que, ao passar o mouse por cima, os produtos deêm um leve zoom na tela, aplicando um efeito bonito
function inicializarAnimacoesProdutos() {
    const cartoesProdutos = document.querySelectorAll('.product-card'); //pega product-card
    cartoesProdutos.forEach(cartao => {
        cartao.addEventListener('mouseenter', () => {
            cartao.style.transform = 'translateY(-5px)';  //usa um pouco de funções do css
            cartao.style.transition = 'transform 0.3s ease';
        });

        //quando o mouse sai de cima, volta ao normal
        cartao.addEventListener('mouseleave', () => {   
            cartao.style.transform = 'translateY(0)';
        });
    });
}

//Essa função trabalha chamando outra função e atribuindo ela a uma variável para pegar a informação de que haja um produto no carrinho e, a partir disso, funcionar como um contador na tela de menu mesmo
function atualizarContagemCarrinho() {
    const itensCarrinho = obterItensCarrinho();   //processo de atribuir uma função
    const linkCarrinho = document.querySelector('.carrinho-link');
    if (linkCarrinho) {
        linkCarrinho.textContent = `Carrinho(${itensCarrinho.length})`;//ele sabe a quantidade
    }
}

//Essa função adiciona itens ao carrinho utilizando um array e recorrendo ao push para dizer que o carrinho recebeu mais um item para armazenar
function adicionarAoCarrinho(produto) {
    const itensCarrinho = obterItensCarrinho();
    itensCarrinho.push(produto);
    salvarItensCarrinho(itensCarrinho);
    atualizarContagemCarrinho();    //chama a função de atualizar contagem
}

//Aqui ele so usa local storage para fazer um get Item
function obterItensCarrinho() {
    return JSON.parse(localStorage.getItem('itensCarrinho')) || [];
}

//Aqui ele usa o set Item
function salvarItensCarrinho(itens) {
    localStorage.setItem('itensCarrinho', JSON.stringify(itens));
}

//Aqui ele obtem as informações dos produtos presentes no array basicamente apenas retornando o array e exibindo as informações do produto na tela
const obterTodosProdutos = () => {
    return Array.from(document.querySelectorAll('.product-card')).map(cartao => ({
        elemento: cartao,
        titulo: cartao.querySelector('.product-title').textContent.toLowerCase(),
        preco: cartao.querySelector('.price').textContent,
        avaliacao: cartao.querySelector('.rating').textContent,
        vendas: cartao.querySelector('.sales').textContent
    }));
};

//Aqui, ao pesquisar, ele faz um rolamento automático suave de tela até a aba dos produtos
const rolarParaProdutos = () => {
    const secaoProdutos = document.getElementById('roupas');
    secaoProdutos.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
};

//Essa função vai fazer com que eu utilize a barra de pesquisa para pesquisar um produto existente. Caso esse produto exista, a tela irá rolar até a aba do produto de maneira suave para causar um efeito de animação agradável. Se o produto não existir, o mesmo efeito de animação acontece, mas exibe uma mensagem dizendo "produto não encontrado".
//Mais: Ela apenas retorna aquele produto que foi pesquisado com base no reconhecimento de alguma letra que você digitou e que está presente no título do produto. É por meio desse reconhecimento que ela retorna o produto exato.
const filtrarProdutos = (termoPesquisa, deveRolar = true) => {
    const produtos = obterTodosProdutos();
    const gridProdutos = document.getElementById('roupas');
    let produtosEncontrados = false;        //para manter a barra de pesquisa vazia no inicio

    const mensagemExistente = document.querySelector('.no-products-message');
    if (mensagemExistente) {
        mensagemExistente.remove();
    }

    produtos.forEach(produto => {
        if (produto.titulo.includes(termoPesquisa.toLowerCase())) {
            produto.elemento.style.display = 'block';   //faz os outros produtos "sumirem"
            produtosEncontrados = true;
        } else {
            produto.elemento.style.display = 'none';
        }
    });

    //Apenas para organizar a forma que o produto encontrado vai estar
    //Aqui eu juntei HTML com CSS no javascript também
    if (!produtosEncontrados) {
        const divMensagem = document.createElement('div');
        divMensagem.className = 'no-products-message';
        divMensagem.style.cssText = `
            width: 100%;
            text-align: center;         
            padding: 20px;
            font-size: 1.2em;
            color: #666;
            grid-column: 1 / -1;
        `;
        divMensagem.textContent = 'Produto não encontrado'; //Mensagem exibindo na tela
        gridProdutos.appendChild(divMensagem);
    }

    //Chama a função de rolar para produto
    if (deveRolar && termoPesquisa.trim() !== '') {
        rolarParaProdutos();
    }
};

//Apenas carrega os event listener para as funções de cima que se referem a pesquisa
document.addEventListener('DOMContentLoaded', () => {
    const campoPesquisa = document.querySelector('.search-input');
    const iconePesquisa = document.querySelector('.search-icon');

    iconePesquisa.addEventListener('click', () => {  //faz a lupa de pesquisa funcionar tambem
        filtrarProdutos(campoPesquisa.value, true);
    });

    campoPesquisa.addEventListener('keypress', (evento) => { //pesquisar apertando enter
        if (evento.key === 'Enter') {
            filtrarProdutos(campoPesquisa.value, true);
        }
    });

    campoPesquisa.addEventListener('input', (evento) => { //o campo de pesquisa esvazia só
        if (evento.target.value === '') {
            filtrarProdutos('', false);
        } else {
            filtrarProdutos(evento.target.value, false);
        }
    });
});

//Aqui está a classe para fazer todo o código do carrossel que está no meio da tela de menu
class Carrossel {
    constructor(container) {
        this.container = container;
        this.empacotador = container.querySelector('.wrapper-carrossel');
        this.slides = container.querySelectorAll('.slide-carrossel');
        this.botaoAnterior = container.querySelector('.anterior');
        this.botaoProximo = container.querySelector('.proximo');
        this.containerPontos = container.querySelector('.pontos-carrossel');
        
        this.indiceAtual = 0;
        this.quantidadeSlides = this.slides.length;
        this.intervaloAutoPlay = null;
        
        this.inicializar();
    }
    
    //Essa função inicializar basicamente só está aqui para chamar os outros métodos e fazê-los rodar
    inicializar() {

        this.criarPontos();
        

        this.botaoAnterior.addEventListener('click', () => this.anterior());
        this.botaoProximo.addEventListener('click', () => this.proximo());
        

        this.container.addEventListener('mouseenter', () => this.pausarAutoPlay());
        this.container.addEventListener('mouseleave', () => this.iniciarAutoPlay());
        

        this.iniciarAutoPlay();


        this.atualizarPontos();

    }
    
    //Aqui ele cria os pontos que ficam no canto inferior do carrossel. Eles ficam mais ao centro
    //Quando o usuario clicar nos pontos, eles podem mudar manualmente o carrossel também
    criarPontos() {
        for (let i = 0; i < this.quantidadeSlides; i++) {
            const ponto = document.createElement('div');
            ponto.className = 'ponto';
            ponto.addEventListener('click', () => this.irParaSlide(i));
            this.containerPontos.appendChild(ponto);
        }
    }
    
    //Aqui os pontos só atualizam sozinhos, para que a animação esteja de acordo com a mudança das fotos
    atualizarPontos() {
        const pontos = this.containerPontos.querySelectorAll('.ponto');
        pontos.forEach((ponto, indice) => {
            ponto.classList.toggle('ativo', indice === this.indiceAtual);
        });
    }
    
    //Essa função que controla o tipo de deslocamento que a imagem vai fazer, utilizando ações de CSS para a troca de imagens(esquerda ou direita)
    irParaSlide(indice) {
        this.indiceAtual = indice;
        const deslocamento = -indice * 100;
        this.empacotador.style.transform = `translateX(${deslocamento}%)`;
        this.atualizarPontos();
    }
    
    //Essa função ativa quando o usuário clica no icone de flecha para a direita, assim o carrossel passa para o proximo slide
    proximo() {
        this.indiceAtual = (this.indiceAtual + 1) % this.quantidadeSlides;
        this.irParaSlide(this.indiceAtual);
    }
    
    //Essa função ativa quando o usuário clica no icone de flecha para a esquerda, assim o carrossel passa para o slide anterior
    anterior() {
        this.indiceAtual = (this.indiceAtual - 1 + this.quantidadeSlides) % this.quantidadeSlides;
        this.irParaSlide(this.indiceAtual);
    }
    
    //Aqui o carrossel fica se atualizando sozinho, sem que o usuário precise ficar clicando para passar as imagens
    iniciarAutoPlay() {
        if (this.intervaloAutoPlay) return;
        this.intervaloAutoPlay = setInterval(() => this.proximo(), 5000);
    }
    
    //Aqui ele cria uma pequena pausa, para que as imagens não demorem muito e nem passem rápidos demais, assim ele cria o intervalo
    //Quando o usuário clica para passar manulamente, ele identifica isso e para de passar sozinho por um tempo até que o usuario pare de clicar para passar
    pausarAutoPlay() {
        if (this.intervaloAutoPlay) {
            clearInterval(this.intervaloAutoPlay);
            this.intervaloAutoPlay = null;
        }
    }
}

//Aqui estpa o DOM do carrossel
document.addEventListener('DOMContentLoaded', () => {
    const containerCarrossel = document.querySelector('.container-carrossel');
    new Carrossel(containerCarrossel);
});

//Essa função pertence a barra de inserir e-mail do rodapé. Ela utiliza uma checagem de caracteres especiais para verificar se o que o usuário está digitando realmente faz sentido ser um e-mail
document.getElementById("botaoCadastrar").addEventListener("click", function () {
    const campoEmail = document.getElementById("meu-email").value;
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   //caracteres especiais

    if (padraoEmail.test(campoEmail)) {
        window.alert("E-mail cadastrado com sucesso!"); //alert bom
    } else {
        window.alert("E-mail inválido!");   //alert ruim 
    }

    document.getElementById("meu-email").value = "";
});