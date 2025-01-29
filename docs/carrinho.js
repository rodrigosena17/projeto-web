// código do carrinho.js
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartLink = document.querySelector('.carrinho-link');
    if (cartLink) {
        cartLink.textContent = `Carrinho(${cartItems.length})`;
    }
}

function checkEmptyCartRedirect() {
    const cartItems = getCartItems();
    if (cartItems.length === 0 && !window.location.href.includes('carrinho-vazio.html')) {
        window.location.href = 'carrinho-vazio.html';
    }
}

//Sempre que um item for adicionado ao carrinho, o JavaScript irá criar automaticamente um novo item no carrinho no padrão que foi colocado no HTML no momento da construção do site.
function createCartItemHTML(product) {
    return `
        <div class="item-carrinho">
            <div class="descricao">
                <img src="${product.image}" alt="${product.name}">
                <div class="info-produto">
                    <h3>${product.name}</h3>
                    <p>Cor: ${product.color || 'Única'}</p>
                    <p>Tamanho: ${product.size}</p>
                    <p class="codigo">Código do produto: ${product.code}</p>
                    <span class="estoque">Em estoque</span>
                </div>
            </div>
            <div class="quantidade">
                <button class="botao-quantidade" data-action="increase">▲</button>
                <span>${product.quantity}</span>
                <button class="botao-quantidade" data-action="decrease">▼</button>
            </div>
            <div class="preco">R$ ${product.price.toFixed(2)}</div>
            <div class="subtotal">R$ ${(product.price * product.quantity).toFixed(2)}</div>
            <button class="botao-remover" data-code="${product.code}">×</button>
        </div>
    `;
}

function updateCartTotal(showFreight = false) {
    const cartItems = getCartItems();
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const frete = showFreight ? 10.00 : 0;
    const total = subtotal + frete;

    const resumoCarrinho = document.querySelector('.resumo-carrinho');
    if (resumoCarrinho) {
        resumoCarrinho.innerHTML = `
            <div class="linha-resumo">
                <span>Subtotal</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            ${showFreight ? `
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

function handleCepCalculation() {
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
                updateCartTotal(true);
            } else {
                alert('Por favor, digite um CEP válido');
                // Esconde as opções de frete
                if (opcoesFrete) {
                    opcoesFrete.style.display = 'none';
                }
                // Atualiza o resumo sem o frete
                updateCartTotal(false);
            }
        });
    }
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.itens-carrinho');
    if (cartItemsContainer) {
        const cartItems = getCartItems();
        console.log('Itens no carrinho:', cartItems);

        if (cartItems.length === 0) {
            window.location.href = 'carrinho-vazio.html';
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => createCartItemHTML(item)).join('');
        }
        updateCartTotal(false);
    }
}

function removeFromCart(productCode) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.code !== productCode);
    saveCartItems(cartItems);
    

    if(cartItems.length === 0) {
        window.location.href = 'carrinho-vazio.html';
    } else {
        renderCartItems();
        updateCartCount();
    }
}

function updateItemQuantity(productCode, action) {
    let cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(item => item.code === productCode);
    
    if (itemIndex !== -1) {
        if (action === 'increase') {
            cartItems[itemIndex].quantity++;
        } else if (action === 'decrease' && cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity--;
        }
        saveCartItems(cartItems);
        renderCartItems();
    }
}


function clearCart() {
    // Limpa o localStorage
    localStorage.removeItem('cartItems');
    // Atualiza o contador
    updateCartCount();
    // Redireciona para a página de carrinho vazio
    window.location.href = 'carrinho-vazio.html';
}


// Inicialização e event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');

    const cartItems = getCartItems();
    if (cartItems.length === 0 && !window.location.href.includes('carrinho-vazio.html')) {
        window.location.href = 'carrinho-vazio.html';
        return;
    }
    

    // Verifica se o usuário está na página de carrinho
    const cartContainer = document.querySelector('.conteudo-carrinho');
    if (cartContainer) {       //Se estiver, a página com os itens deve ser renderizada
        console.log('Página do carrinho detectada');
        

        // Inicializa sem mostrar o frete
        updateCartTotal(false);
        
        // Inicializa o handler do CEP
        handleCepCalculation();

        // Renderiza os itens iniciais
        renderCartItems();


        // Adiciona listener para o botão finalizar compra
        const botaoFinalizar = document.querySelector('.botao-finalizar');
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener('click', clearCart);
        }

        // Event listener para os botões do carrinho -> click
        document.querySelector('.itens-carrinho')?.addEventListener('click', function(e) {
            const target = e.target;


            // Aqui, faz o item ser removido ao clicar no "X"
            if (target.classList.contains('botao-remover')) {
                const productCode = target.dataset.code;
                removeFromCart(productCode);
            }
            
            // Essa função faz com que a quantidade de produtos aumente ao clicar na seta 
            if (target.classList.contains('botao-quantidade')) {
                const itemContainer = target.closest('.item-carrinho');
                const productCode = itemContainer.querySelector('.botao-remover').dataset.code;
                const action = target.dataset.action;
                updateItemQuantity(productCode, action);
            }
        });

        
        console.log('Conteúdo do localStorage:', localStorage.getItem('cartItems'));
    }

    // Sempre atualiza o contador do carrinho
    updateCartCount();
});