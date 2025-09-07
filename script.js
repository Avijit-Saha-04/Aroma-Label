import { products, heroSlides } from './data.js';
// Global Variables
let currentSlide = 0;
let slideInterval;
let cart = [];
let isLoading = false;

// Product Data with detailed descriptions
const productDescriptions = {
    'coffee': 'Premium handcrafted coffee blend sourced from the finest Ethiopian highlands. Rich, aromatic, and perfectly balanced with notes of chocolate and caramel. Perfect for starting your day with energy and focus.',
    'tea': 'Carefully selected tea leaves from the best gardens, offering a refreshing and soothing experience. Light and fragrant with natural antioxidants for wellness and relaxation.',
    'hoodie': 'Ultra-comfortable premium cotton hoodie with a modern fit. Perfect for casual wear, work from home, or cozy evenings. Soft fabric with excellent durability and style.',
    'biriyani': 'Authentic spiced biriyani with fragrant basmati rice and aromatic spices. A culinary masterpiece that brings traditional flavors to your table with every bite.',
    'book': 'Inspirational book filled with wisdom and knowledge to expand your mind. Perfect for personal growth, learning new skills, or simply enjoying a good read during quiet moments.',
    'pen': 'Luxury writing instrument crafted for smooth writing experience. Premium quality with elegant design, perfect for professionals, students, or anyone who appreciates fine writing tools.',
    'chocolate': 'Artisan chocolate made with premium cocoa beans. Rich, creamy texture with complex flavors that melt in your mouth. A perfect treat for chocolate connoisseurs.',
    'flower': 'Beautiful fresh flower arrangement to brighten your space or express your feelings. Carefully selected blooms that bring natural beauty and fragrance to any environment.',
    'notebook': 'Elegant handcrafted notebook with premium paper quality. Perfect for journaling, note-taking, sketching, or capturing your creative ideas. Durable and stylish design.',
    'mug': 'Stylish ceramic mug designed for your favorite beverages. Heat-resistant with comfortable grip and elegant design. Perfect for coffee, tea, or any hot beverage.',
    'candle': 'Hand-poured scented candle with natural wax and premium fragrances. Creates a warm, inviting atmosphere while filling your space with delightful aromas.',
    'bookmark': 'Artisan wooden bookmark crafted with precision and care. Functional and decorative, perfect for book lovers who appreciate beautiful accessories for their reading journey.'
};

// DOM Elements
const elements = {
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    mobileMenuOverlay: document.getElementById('mobileMenuOverlay'),
    mobileMenuClose: document.getElementById('mobileMenuClose'),
    searchBtn: document.getElementById('searchBtn'),
    searchBar: document.getElementById('searchBar'),
    searchClose: document.getElementById('searchClose'),
    searchInput: document.getElementById('searchInput'),
    cartBtn: document.getElementById('cartBtn'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartClose: document.getElementById('cartClose'),
    cartCount: document.getElementById('cartCount'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    heroSlides: document.querySelectorAll('.hero-slide'),
    heroPrev: document.getElementById('heroPrev'),
    heroNext: document.getElementById('heroNext'),
    heroDots: document.querySelectorAll('.dot'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    productGrid: document.getElementById('productGrid'),
    quickViewModal: document.getElementById('quickViewModal'),
    modalClose: document.getElementById('modalClose'),
    addToCartBtns: document.querySelectorAll('.add-to-cart-btn'),
    newsletterBtn: document.getElementById('newsletterBtn'),
    newsletterEmail: document.getElementById('newsletterEmail'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    toastContainer: document.getElementById('toastContainer')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    initializeHeroSlideshow();
    loadCartFromStorage();
    updateCartUI();
    initializeScrollAnimations();
    initializeProductFiltering();
    syncCartAcrossTabs();
    console.log('🚀 Aroma Label App Initialized Successfully!');
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile Menu
    elements.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
    elements.mobileMenuClose?.addEventListener('click', toggleMobileMenu);
    elements.mobileMenuOverlay?.addEventListener('click', (e) => {
        if (e.target === elements.mobileMenuOverlay) {
            toggleMobileMenu();
        }
    });

    // Search
    elements.searchBtn?.addEventListener('click', toggleSearch);
    elements.searchClose?.addEventListener('click', toggleSearch);
    elements.searchInput?.addEventListener('input', handleSearch);

    // Cart
    elements.cartBtn?.addEventListener('click', toggleCart);
    elements.cartClose?.addEventListener('click', toggleCart);
    elements.checkoutBtn?.addEventListener('click', handleCheckout);

    // Hero Slideshow
    elements.heroPrev?.addEventListener('click', previousSlide);
    elements.heroNext?.addEventListener('click', nextSlide);
    elements.heroDots?.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Product Filtering
    elements.filterBtns?.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Add to Cart Buttons
    elements.addToCartBtns?.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Modal
    elements.modalClose?.addEventListener('click', closeQuickView);
    elements.quickViewModal?.addEventListener('click', (e) => {
        if (e.target === elements.quickViewModal) {
            closeQuickView();
        }
    });

    // Newsletter
    elements.newsletterBtn?.addEventListener('click', handleNewsletter);
    elements.newsletterEmail?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNewsletter();
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Window Events
    window.addEventListener('scroll', debounce(handleScroll, 10));
    window.addEventListener('resize', handleResize);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    elements.mobileMenuOverlay?.classList.toggle('active');
}

// Search Functions
function toggleSearch() {
    elements.searchBar?.classList.toggle('active');
    if (elements.searchBar?.classList.contains('active')) {
        elements.searchInput?.focus();
    } else {
        elements.searchInput.value = '';
        showAllProducts();
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.textContent?.toLowerCase() || '';
        const isVisible = productName.includes(query);
        
        if (isVisible) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });

    // Show "no results" message if needed
    const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
    if (visibleCards.length === 0 && query.trim() !== '') {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function showAllProducts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
        card.classList.add('fade-in');
    });
    hideNoResultsMessage();
}

function showNoResultsMessage() {
    let noResultsDiv = document.getElementById('noResults');
    if (!noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResults';
        noResultsDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p style="font-size: 18px;">No products found matching your search.</p>
                <p style="font-size: 14px; margin-top: 10px;">Try different keywords or browse our categories.</p>
            </div>
        `;
        elements.productGrid?.appendChild(noResultsDiv);
    }
}

function hideNoResultsMessage() {
    const noResultsDiv = document.getElementById('noResults');
    noResultsDiv?.remove();
}

// Cart Functions
function toggleCart() {
    elements.cartSidebar?.classList.toggle('active');
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('aromaCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('aromaCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

function handleAddToCart(e) {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const product = {
        id: Date.now() + Math.random(),
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        originalPrice: btn.dataset.originalPrice ? parseFloat(btn.dataset.originalPrice) : null,
        image: btn.dataset.image,
        category: btn.dataset.category,
        quantity: 1
    };

    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
    animateCartIcon();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showToast('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            product.quantity = newQuantity;
            saveCartToStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update cart count
    if (elements.cartCount) {
        elements.cartCount.textContent = totalItems;
        elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update cart total
    if (elements.cartTotal) {
        elements.cartTotal.textContent = totalPrice.toFixed(0);
    }

    // Update cart items
    if (elements.cartItems) {
        if (cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            elements.cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, parseInt(this.value))" min="1">
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update checkout button
    if (elements.checkoutBtn) {
        elements.checkoutBtn.disabled = cart.length === 0;
    }
}
// ...
let currentSlideIndex = 0;
let slideshowInterval;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function startSlideshow() {
    // This function sets a timer to change the slide every 5 seconds.
    slideshowInterval = setInterval(() => changeSlide(1), 5000); 
}

// And ensure this function is called when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // ...
    startSlideshow();
    // ...
});

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }

    showLoading();
    
    // Simulate checkout process
    setTimeout(() => {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        showToast(`Checkout successful! Total: ₹${totalAmount} for ${itemCount} items`, 'success');
        cart = [];
        saveCartToStorage();
        updateCartUI();
        toggleCart();
        hideLoading();
    }, 2000);
}

function animateCartIcon() {
    elements.cartBtn?.classList.add('bounce-effect');
    setTimeout(() => {
        elements.cartBtn?.classList.remove('bounce-effect');
    }, 600);
}

// Hero Slideshow Functions
let isSliding = false;

function initializeHeroSlideshow() {
    if (elements.heroSlides.length > 0) {
        elements.heroSlides.forEach((slide, i) => {
            slide.style.transform = i === currentSlide ? 'translateX(0)' : 'translateX(100%)';
        });
        // Update dots on initialization
        elements.heroDots?.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        startAutoSlide();
    }
}

function showSlide(index, direction = 'next') {
    if (isSliding || index === currentSlide) return;
    isSliding = true;

    const oldIndex = currentSlide;
    const oldSlide = elements.heroSlides[oldIndex];
    const newSlide = elements.heroSlides[index];

    const oldSlideExit = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
    const newSlideStart = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

    // 1. Instantly move the new slide to its starting position without animation
    newSlide.style.transition = 'none';
    newSlide.style.transform = newSlideStart;

    // Use a double requestAnimationFrame to ensure the browser has rendered the start position
    // before applying the transition and final position.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // 2. Add the transition back and animate both slides to their final positions
            newSlide.style.transition = 'transform 0.8s ease-in-out';
            oldSlide.style.transform = oldSlideExit;
            newSlide.style.transform = 'translateX(0)';
        });
    });

    // Update active class on slides and dots
    oldSlide.classList.remove('active');
    newSlide.classList.add('active');
    elements.heroDots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlide = index;

    // 3. Reset sliding state after animation duration
    setTimeout(() => {
        isSliding = false;
    }, 800);
}

function nextSlide() {
    if (elements.heroSlides.length === 0) return;
    const nextIndex = (currentSlide + 1) % elements.heroSlides.length;
    showSlide(nextIndex, 'next');
    resetAutoSlide();
}

function previousSlide() {
    if (elements.heroSlides.length === 0) return;
    const prevIndex = (currentSlide - 1 + elements.heroSlides.length) % elements.heroSlides.length;
    showSlide(prevIndex, 'prev');
    resetAutoSlide();
}

function goToSlide(index) {
    if (index === currentSlide) return;
    const direction = index > currentSlide ? 'next' : 'prev';
    showSlide(index, direction);
    resetAutoSlide();
}

function startAutoSlide() {
    if (elements.heroSlides.length > 1) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Product Filtering Functions
function initializeProductFiltering() {
    // Set initial active state
    const allBtn = document.querySelector('[data-category="all"]');
    allBtn?.classList.add('active');
}

function handleCategoryFilter(e) {
    const category = e.target.dataset.category;
    
    // Update active button
    elements.filterBtns?.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Filter products
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        const isVisible = category === 'all' || productCategory === category;
        
        if (isVisible) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });

    showToast(`Showing ${category === 'all' ? 'all' : category} products`, 'info');
}

// Quick View Modal Functions
function openQuickView(productKey) {
    const productData = getProductData(productKey);
    if (!productData) return;

    // Populate modal with product data
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalOriginalPrice = document.getElementById('modalOriginalPrice');
    const modalSalePrice = document.getElementById('modalSalePrice');
    const modalStars = document.getElementById('modalStars');
    const modalRatingCount = document.getElementById('modalRatingCount');

    if (modalImage) modalImage.src = productData.image;
    if (modalTitle) modalTitle.textContent = productData.name;
    if (modalDescription) modalDescription.textContent = productDescriptions[productKey] || 'Premium quality product crafted with care and attention to detail.';
    
    // Set price
    if (modalOriginalPrice) {
        if (productData.originalPrice) {
            modalOriginalPrice.textContent = `₹${productData.originalPrice}`;
            modalOriginalPrice.style.display = 'inline';
        } else {
            modalOriginalPrice.style.display = 'none';
        }
    }
    if (modalSalePrice) modalSalePrice.textContent = `₹${productData.price}`;

    // Set rating (random for demo)
    const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    if (modalStars) {
        const starsHtml = Array.from({length: 5}, (_, i) => 
            `<i class="fas fa-star" style="color: ${i < rating ? '#ffd700' : '#ddd'}"></i>`
        ).join('');
        modalStars.innerHTML = starsHtml;
    }
    if (modalRatingCount) modalRatingCount.textContent = `(${Math.floor(Math.random() * 100) + 20})`;

    // Reset quantity
    const modalQuantity = document.getElementById('modalQuantity');
    if (modalQuantity) modalQuantity.value = 1;

    // Set up add to cart button
    const modalAddToCart = document.getElementById('modalAddToCart');
    if (modalAddToCart) {
        modalAddToCart.onclick = () => {
            const quantity = parseInt(document.getElementById('modalQuantity')?.value || 1);
            for (let i = 0; i < quantity; i++) {
                const product = {
                    id: Date.now() + Math.random() + i,
                    name: productData.name,
                    price: productData.price,
                    originalPrice: productData.originalPrice,
                    image: productData.image,
                    category: productData.category,
                    quantity: 1
                };
                
                const existingProduct = cart.find(item => item.name === product.name);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push(product);
                }
            }
            
            saveCartToStorage();
            updateCartUI();
            showToast(`${productData.name} (${quantity}) added to cart!`, 'success');
            closeQuickView();
            animateCartIcon();
        };
    }

    // Setup quantity controls
    const qtyDecrease = document.querySelector('.qty-decrease');
    const qtyIncrease = document.querySelector('.qty-increase');
    
    if (qtyDecrease) {
        qtyDecrease.onclick = () => {
            const input = document.getElementById('modalQuantity');
            if (input) {
                const value = Math.max(1, parseInt(input.value) - 1);
                input.value = value;
            }
        };
    }

    if (qtyIncrease) {
        qtyIncrease.onclick = () => {
            const input = document.getElementById('modalQuantity');
            if (input) {
                input.value = parseInt(input.value) + 1;
            }
        };
    }

    // Show modal
    elements.quickViewModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    elements.quickViewModal?.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getProductData(productKey) {
    // This would normally come from a database or API
    const productMap = {
        'coffee': { name: 'Buy Me a Coffee ☕', price: 99, originalPrice: 899, image: 'images/coffee.png', category: 'beverages' },
        'tea': { name: 'Buy Me a Tea 🍵', price: 19, originalPrice: 849, image: 'images/tea.png', category: 'beverages' },
        'hoodie': { name: 'Buy Me a Hoodie 👕', price: 999, image: 'images/hoodie.png', category: 'clothing' },
        'biriyani': { name: 'Buy Me a Biriyani 🍛', price: 249, originalPrice: 749, image: 'images/biriyani.png', category: 'food' },
        'book': { name: 'Buy Me a Book 📖', price: 299, originalPrice: 799, image: 'images/book.png', category: 'books' },
        'pen': { name: 'Buy Me a Pen ✒️', price: 99, originalPrice: 699, image: 'images/pen.png', category: 'books' },
        'chocolate': { name: 'Buy Me a Chocolate 🍫', price: 199, originalPrice: 899, image: 'images/chocolate.png', category: 'food' },
        'flower': { name: 'Buy Me a Flower 🌹', price: 99, originalPrice: 949, image: 'images/flower.png', category: 'accessories' },
        'notebook': { name: 'Buy Me a Notebook 📒', price: 649, image: 'images/notebook.png', category: 'books' },
        'mug': { name: 'Buy Me a Mug ☕', price: 749, image: 'images/mug.png', category: 'accessories' },
        'candle': { name: 'Buy Me a Candle 🕯️', price: 849, image: 'images/candle.png', category: 'accessories' },
        'bookmark': { name: 'Buy Me a Bookmark 📖', price: 699, image: 'images/bookmark.png', category: 'books' }
    };
    
    return productMap[productKey];
}

// Newsletter Function
function handleNewsletter() {
    const email = elements.newsletterEmail?.value;
    
    if (!email) {
        showToast('Please enter your email address', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        showToast(`Thank you for subscribing, ${email.split('@')[0]}!`, 'success');
        if (elements.newsletterEmail) elements.newsletterEmail.value = '';
        hideLoading();
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility Functions
function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type];

    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showLoading() {
    isLoading = true;
    elements.loadingSpinner?.classList.add('active');
}

function hideLoading() {
    isLoading = false;
    elements.loadingSpinner?.classList.remove('active');
}

// Scroll Animation Functions
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .feature-item, .insta-item').forEach(el => {
        observer.observe(el);
    });
}

function handleScroll() {
    // Add scroll-based animations or effects here
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero content (if needed)
    const heroContent = document.querySelector('.slide-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${rate}px)`;
    }
}

function handleResize() {
    // Handle responsive behavior on resize
    if (window.innerWidth > 768) {
        elements.mobileMenuOverlay?.classList.remove('active');
    }
}

// Smooth Scrolling Function
function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        if (elements.quickViewModal?.classList.contains('active')) {
            closeQuickView();
        } else if (elements.cartSidebar?.classList.contains('active')) {
            toggleCart();
        } else if (elements.mobileMenuOverlay?.classList.contains('active')) {
            toggleMobileMenu();
        } else if (elements.searchBar?.classList.contains('active')) {
            toggleSearch();
        }
    }
    
    // Arrow keys for slideshow when focused
    if (document.activeElement === document.body) {
        if (e.key === 'ArrowLeft') {
            previousSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
}

// Enhanced Product Card Interactions
function initializeProductCardEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Performance Optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling for Images
function initializeImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            // Create a placeholder if needed
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 14px;
            `;
            placeholder.textContent = 'Image not found';
            this.parentNode.appendChild(placeholder);
        });
    });
}

// Enhanced Cart Persistence
function syncCartAcrossTabs() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'aromaCart') {
            cart = JSON.parse(e.newValue || '[]');
            updateCartUI();
        }
    });
}

// Initialize additional features when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCardEffects();
    initializeImageErrorHandling();
});

// Export functions for global access (if needed)
window.aromaApp = {
    openQuickView,
    removeFromCart,
    updateCartQuantity,
    showToast,
    toggleCart,
    toggleSearch
};

console.log('✨ Aroma Label - Enhanced eCommerce Experience Ready!');