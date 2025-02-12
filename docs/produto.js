// produto.js - Para a página de produto

//Aqui as funções farão com que o produto seja adicionado no carrinho e irá mostrar a quantidade atualizada de produtos presentes no carrinho (sem precisar ficar acessando o carrinho para conferir).
function obterItensCarrinho() {   //Acessa todos os produtos da plataforma
    return JSON.parse(localStorage.getItem('itensCarrinho')) || [];
}

function salvarItensCarrinho(itens) { //mantém os produtos salvos no carrinho
    localStorage.setItem('itensCarrinho', JSON.stringify(itens));
}

function atualizarContagemCarrinho() {    //Atualiza a contagem sempre que um produto for adicionado
    const itensCarrinho = obterItensCarrinho();
    const linkCarrinho = document.querySelector('.carrinho-link');
    if (linkCarrinho) {
        linkCarrinho.textContent = `Carrinho(${itensCarrinho.length})`;
    }
}

function adicionarAoCarrinho(produto) {   //Função de adicionar o produto
    const itensCarrinho = obterItensCarrinho();
    itensCarrinho.push(produto);    
    salvarItensCarrinho(itensCarrinho);
    atualizarContagemCarrinho();          //Chama a função de atualizar contagem
}


// Event listeners e inicialização para a página de produto
document.addEventListener('DOMContentLoaded', function() {
    const botaoAdicionarCarrinho = document.querySelector('.add-to-cart');
    if (botaoAdicionarCarrinho) {
        botaoAdicionarCarrinho.addEventListener('click', function() {
            const containerProduto = document.querySelector('.product-details');
            const tamanhoSelecionado = containerProduto.querySelector('.size-option.selected')?.textContent || 'P';
            const quantidade = parseInt(containerProduto.querySelector('.quantity-input').value) || 1;

            //Criação do produto na página de carrinho, quando este for adicionado
            //Adiciona o produto com as informações que foram padronizadas no HTML
            const produto = {
                nome: containerProduto.querySelector('.product-title').textContent,
                preco: parseFloat(containerProduto.querySelector('.discounted-price').textContent.replace('R$ ', '').replace(',', '.')),
                imagem: document.querySelector('.main-image').src,
                tamanho: tamanhoSelecionado,
                cor: 'Única',
                codigo: 'PROD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                quantidade: quantidade
            };

            //Aviso de adição do produto
            adicionarAoCarrinho(produto);
            alert('Produto adicionado ao carrinho!');
        });
    }

    // Adicionar funcionalidade de seleção de tamanho
    const opcoesTamanho = document.querySelectorAll('.size-option');
    opcoesTamanho.forEach(opcao => {
        opcao.addEventListener('click', function() {
            opcoesTamanho.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Atualizar contador do carrinho
    atualizarContagemCarrinho();
});