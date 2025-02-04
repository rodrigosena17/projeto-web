// produto.js - Para a página de produto

//Aqui as funções farão com que o produto seja adicionado no carrinho e irá mostrar a quantidade atualizada de produtos presentes no carrinho (sem precisar ficar acessando o carrinho para conferir).
function getCartItems() {   //Acessa todos os produtos da plataforma
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCartItems(items) { //mantém os produtos salvos no carrinho
    localStorage.setItem('cartItems', JSON.stringify(items));
}

function updateCartCount() {    //Atualiza a contagem sempre que um produto for adicionado
    const cartItems = getCartItems();
    const cartLink = document.querySelector('.carrinho-link');
    if (cartLink) {
        cartLink.textContent = `Carrinho(${cartItems.length})`;
    }
}

function addToCart(product) {   //Função de adicionar o produto
    const cartItems = getCartItems();
    cartItems.push(product);    
    saveCartItems(cartItems);
    updateCartCount();          //Chama a função de atualizar contagem
}


// Event listeners e inicialização para a página de produto
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productContainer = document.querySelector('.product-details');
            const selectedSize = productContainer.querySelector('.size-option.selected')?.textContent || 'P';
            const quantity = parseInt(productContainer.querySelector('.quantity-input').value) || 1;

            //Criação do produto na página de carrinho, quando este for adicionado
            const product = {
                name: productContainer.querySelector('.product-title').textContent,
                price: parseFloat(productContainer.querySelector('.discounted-price').textContent.replace('R$ ', '').replace(',', '.')),
                image: document.querySelector('.main-image').src,
                size: selectedSize,
                color: 'Única',
                code: 'PROD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                quantity: quantity
            };

            //Aviso de adição do produto
            addToCart(product);
            alert('Produto adicionado ao carrinho!');
        });
    }

    // Adicionar funcionalidade de seleção de tamanho
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Atualizar contador do carrinho
    updateCartCount();
});