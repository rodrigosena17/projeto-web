// código do carrinho.js
function obterItensCarrinho() {
    return JSON.parse(localStorage.getItem('itensCarrinho')) || [];
}

//Salva itens com local storage
function salvarItensCarrinho(itens) {
    localStorage.setItem('itensCarrinho', JSON.stringify(itens));
}

//Atualiza contagem
function atualizarContagemCarrinho() {
    const itensCarrinho = obterItensCarrinho();
    const linkCarrinho = document.querySelector('.carrinho-link');
    if (linkCarrinho) {
        linkCarrinho.textContent = `Carrinho(${itensCarrinho.length})`;
    }
}

//Verifica se o carrinho está vazio, estando vazio, ele põe a tela de carrinho vazio
function verificarCarrinhoVazioRedirecionar() {
    const itensCarrinho = obterItensCarrinho();
    if (itensCarrinho.length === 0 && !window.location.href.includes('carrinho-vazio.html')) {
        window.location.href = 'carrinho-vazio.html';
    }
}

//Sempre que um item for adicionado ao carrinho, o JavaScript irá criar automaticamente um novo item no carrinho no padrão que foi colocado no HTML no momento da construção do site.
function criarHTMLItemCarrinho(produto) {
    return `
        <div class="item-carrinho">
            <div class="descricao">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="info-produto">
                    <h3>${produto.nome}</h3>
                    <p>Cor: ${produto.cor || 'Única'}</p>
                    <p>Tamanho: ${produto.tamanho}</p>
                    <p class="codigo">Código do produto: ${produto.codigo}</p>
                    <span class="estoque">Em estoque</span>
                </div>
            </div>
            <div class="quantidade">
                <button class="botao-quantidade" data-action="increase">▲</button>
                <span>${produto.quantidade}</span>
                <button class="botao-quantidade" data-action="decrease">▼</button>
            </div>
            <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
            <div class="subtotal">R$ ${(produto.preco * produto.quantidade).toFixed(2)}</div>
            <button class="botao-remover" data-code="${produto.codigo}">×</button>
        </div>
    `;
}

//Essa função mostra o design da parte do frete, utilizando modelos do HTML para criar quando o tiver itens adicionados
function atualizarTotalCarrinho(mostrarFrete = false) {
    const itensCarrinho = obterItensCarrinho();
    const subtotal = itensCarrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const frete = mostrarFrete ? 10.00 : 0;
    const total = subtotal + frete;

    const resumoCarrinho = document.querySelector('.resumo-carrinho');
    if (resumoCarrinho) {
        resumoCarrinho.innerHTML = `
            <div class="linha-resumo">
                <span>Subtotal</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            ${mostrarFrete ? `
            <div class="linha-resumo">
                <span>Frete</span>
                <span>R$ ${frete.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="linha-resumo-total">
                <span>Total</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
        `;
    }
}

//Função para fazer o cálculo do CEP, aceitando só CEP válido
function manipularCalculoCep() {
    const opcoesFrete = document.querySelector('.opcoes-frete');
    const inputCep = document.querySelector('.input-cep');
    const botaoCalcular = document.querySelector('.botao-calcular');

    // Inicialmente esconde as opções de frete
    if (opcoesFrete) {
        opcoesFrete.style.display = 'none';
    }

    if (botaoCalcular && inputCep) {
        botaoCalcular.addEventListener('click', () => {
            const cep = inputCep.value.replace(/\D/g, ''); // Remove não-números
            
            if (cep.length === 8) { // CEP válido tem 8 dígitos
                // Mostra as opções de frete
                if (opcoesFrete) {
                    opcoesFrete.style.display = 'block';
                }
                // Atualiza o resumo incluindo o frete
                atualizarTotalCarrinho(true);
            } else {
                alert('Por favor, digite um CEP válido');
                // Esconde as opções de frete
                if (opcoesFrete) {
                    opcoesFrete.style.display = 'none';
                }
                // Atualiza o resumo sem o frete
                atualizarTotalCarrinho(false);
            }
        });
    }
}

//Aqui ele basicamente obtem todos os itens que estão no array e vai exibindo na tela no formato padronizado da tela do carrinho
function renderizarItensCarrinho() {
    const containerItensCarrinho = document.querySelector('.itens-carrinho');
    if (containerItensCarrinho) {
        const itensCarrinho = obterItensCarrinho();
        console.log('Itens no carrinho:', itensCarrinho);

        if (itensCarrinho.length === 0) {
            window.location.href = 'carrinho-vazio.html';
        } else {
            containerItensCarrinho.innerHTML = itensCarrinho.map(item => criarHTMLItemCarrinho(item)).join('');
        }
        atualizarTotalCarrinho(false);
    }
}

//Aqui ele pega todos os itens que estão no carrinho e aplica a remoção no item que o usuário quiser.
//Se não tiver itens, então exibe a página de carrinho vazio.
function removerDoCarrinho(codigoProduto) {
    let itensCarrinho = obterItensCarrinho();
    itensCarrinho = itensCarrinho.filter(item => item.codigo !== codigoProduto);
    salvarItensCarrinho(itensCarrinho);
    
    if(itensCarrinho.length === 0) {
        window.location.href = 'carrinho-vazio.html';
    } else {
        renderizarItensCarrinho();
        atualizarContagemCarrinho();
    }
}

//Vai atualizar a quantidade de item no carrinho. Diminuindo ou aumentando
function atualizarQuantidadeItem(codigoProduto, acao) {
    let itensCarrinho = obterItensCarrinho();
    const indiceItem = itensCarrinho.findIndex(item => item.codigo === codigoProduto);
    
    if (indiceItem !== -1) {
        if (acao === 'increase') {
            itensCarrinho[indiceItem].quantidade++;
        } else if (acao === 'decrease' && itensCarrinho[indiceItem].quantidade > 1) {
            itensCarrinho[indiceItem].quantidade--;
        }
        salvarItensCarrinho(itensCarrinho);
        renderizarItensCarrinho();
    }
}

function limparCarrinho() {
    // Limpa o localStorage e remove o item
    localStorage.removeItem('itensCarrinho');
    // Atualiza o contador para menos
    atualizarContagemCarrinho();
    // Redireciona para a página de carrinho vazio caso tenha 0 item
    window.location.href = 'carrinho-vazio.html';
}


// Inicialização e event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');

    //Aqui a função vai mostrar a tela de carrinho vazio se não tiver nenhum item dentro
    const itensCarrinho = obterItensCarrinho();
    if (itensCarrinho.length === 0 && !window.location.href.includes('carrinho-vazio.html')) {
        window.location.href = 'carrinho-vazio.html';
        return;
    }


    // Verifica se o usuário está na página de carrinho
    const containerCarrinho = document.querySelector('.conteudo-carrinho');
    if (containerCarrinho) {       //Se estiver, a página com os itens deve ser renderizada

        console.log('Página do carrinho detectada');


        // Inicializa sem mostrar o frete
        atualizarTotalCarrinho(false);
        
        // Inicializa o handler do CEP
        manipularCalculoCep();

        // Renderiza os itens iniciais
        renderizarItensCarrinho();

        // Adiciona listener para o botão finalizar compra
        const botaoFinalizar = document.querySelector('.botao-finalizar');
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener('click', limparCarrinho);
        }

        // Event listener para os botões do carrinho -> click
        document.querySelector('.itens-carrinho')?.addEventListener('click', function(e) {
            const alvo = e.target;

            // Aqui, faz o item ser removido ao clicar no "X"
            if (alvo.classList.contains('botao-remover')) {
                const codigoProduto = alvo.dataset.code;
                removerDoCarrinho(codigoProduto);
            }
            
            // Essa função faz com que a quantidade de produtos aumente ao clicar na seta 
            if (alvo.classList.contains('botao-quantidade')) {
                const containerItem = alvo.closest('.item-carrinho');
                const codigoProduto = containerItem.querySelector('.botao-remover').dataset.code;
                const acao = alvo.dataset.action;
                atualizarQuantidadeItem(codigoProduto, acao);
            }
        });
        
        console.log('Conteúdo do localStorage:', localStorage.getItem('itensCarrinho'));
    }

    // Sempre atualiza o contador do carrinho
    atualizarContagemCarrinho();
});