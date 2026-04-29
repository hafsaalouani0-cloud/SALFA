let cart = [];
let currentProducts = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initSlider();
    loadProducts();
    updateCartCount();
});

// Sauvegarder le panier dans sessionStorage
function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Charger le panier depuis sessionStorage
function loadCart() {
    const stored = sessionStorage.getItem('cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

// Slider automatique (Home seulement)
function initSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    showSlide(0);
    setInterval(nextSlide, 4000);
}

// Charger les produits de la page actuelle
function loadProducts() {
    currentProducts = window.currentProducts || [];
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = currentProducts.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${product.price}DH</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

// Ajouter au panier
function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    updateCartCount();
    showNotification('Produit ajouté au panier !');
}

// Mettre à jour le compteur
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

// Toggle panier
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        if (modal.style.display === 'block') renderCart();
    }
}

// Rendre le panier
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#666;">Votre panier est vide</p>';
        cartTotal.textContent = 'Total: 0DH';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.price}DH x ${item.quantity}</small>
            </div>
            <div>
                <strong>${(item.price * item.quantity).toFixed(2)}DH</strong>
                <button onclick="removeFromCart(${item.id})" style="margin-left:1rem; background:#f44336; color:white; border:none; padding:0.3rem 0.8rem; border-radius:15px; cursor:pointer;">Supprimer</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: ${total.toFixed(2)}DH`;
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Merci pour votre commande ! Total: ${total.toFixed(2)}DH`);
    cart = [];
    saveCart();
    updateCartCount();
    toggleCart();
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #e91e63, #9c27b0);
        color: white;
        padding: 1.2rem 2rem;
        border-radius: 15px;
        z-index: 3000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideIn 0.4s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

// CSS pour animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Fermer modal en cliquant dehors
window.onclick = function(event) {
    if (event.target.classList.contains('cart-modal')) {
        event.target.style.display = 'none';
    }
}