// shared.js - Funcionalidades compartilhadas entre todas as páginas
import { validateEmail } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeNewsletter();
});

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (window.location.href.includes('pagina-inicial')) {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            product.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    }
}

function initializeNewsletter() {
    const emailInput = document.querySelector('.mais-ofertas input');
    if (emailInput) {
        emailInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const email = emailInput.value;
                if (validateEmail(email)) {
                    alert('Email cadastrado com sucesso!');
                    emailInput.value = '';
                } else {
                    alert('Por favor, insira um email válido.');
                }
            }
        });
    }
}