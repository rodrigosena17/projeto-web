// utils.js - Funções utilitárias compartilhadas entre páginas

export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function updateCart(quantity) {
    const carrinhoLink = document.querySelector('.carrinho-link');
    const currentCount = parseInt(carrinhoLink.textContent.match(/\d+/) || 0);
    carrinhoLink.textContent = `Carrinho(${currentCount + quantity})`;
}