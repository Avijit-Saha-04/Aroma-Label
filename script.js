// ADD YOUR RAZORPAY KEY ID HERE
const RAZORPAY_KEY_ID = 'My_API_Key'; // Replace with your actual Razorpay Key ID

// Global Variables
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

//log in
// auth.onAuthStateChanged(user => {
//     const userContainer = document.querySelector('#user-container');
//     if (!userContainer) return; // Failsafe for pages without the container

//     if (user) {
//         // User is signed in: Display their info and a logout button
//         userContainer.innerHTML = `
//             <span id="userInfo">Welcome, ${user.email.split('@')[0]}</span>
//             <button id="logoutBtn" class="auth-btn secondary">Logout</button>
//         `;
//         document.getElementById('logoutBtn').addEventListener('click', () => auth.signOut());
//     } else {
//         // User is signed out: Display a link to the login page
//         userContainer.innerHTML = `
//             <a href="login.html" class="nav-icon" aria-label="Login">
//                 <i class="fas fa-user"></i>
//             </a>
//         `;
//     }
// });

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
    filterBtns: document.querySelectorAll('.filter-btn'),
    productGrid: document.getElementById('productGrid'),
    quickViewModal: document.getElementById('quickViewModal'),
    modalClose: document.getElementById('modalClose'),
    addToCartBtns: document.querySelectorAll('.add-to-cart-btn'),
    donateBtns: document.querySelectorAll('.donate-btn'),
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
        if (e.target === elements.mobileMenuOverlay) toggleMobileMenu();
    });

    // Search
    elements.searchBtn?.addEventListener('click', toggleSearch);
    elements.searchClose?.addEventListener('click', toggleSearch);
    elements.searchInput?.addEventListener('input', handleSearch);

    // Cart
    elements.cartBtn?.addEventListener('click', toggleCart);
    elements.cartClose?.addEventListener('click', toggleCart);
    elements.checkoutBtn?.addEventListener('click', handleCheckout);

    // Product Filtering
    elements.filterBtns?.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Add to Cart Buttons
    elements.addToCartBtns?.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Donate Buttons
    elements.donateBtns?.forEach(btn => {
        btn.addEventListener('click', handleDonateClick);
    });

    // Modal
    elements.modalClose?.addEventListener('click', closeQuickView);
    elements.quickViewModal?.addEventListener('click', (e) => {
        if (e.target === elements.quickViewModal) closeQuickView();
    });

    // Newsletter
    elements.newsletterBtn?.addEventListener('click', handleNewsletter);
    elements.newsletterEmail?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNewsletter();
    });

    // Contact Form
    const form = document.getElementById('contact-form');
    if (form) { // Check if the form exists on the current page
        const formResult = document.getElementById('form-result');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);
            formResult.innerHTML = "Sending...";
            formResult.style.color = "#888";

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        formResult.innerHTML = jsonResponse.message;
                        formResult.style.color = "green";
                    } else {
                        console.log(response);
                        formResult.innerHTML = jsonResponse.message;
                        formResult.style.color = "red";
                    }
                })
                .catch(error => {
                    console.log(error);
                    formResult.innerHTML = "Something went wrong!";
                    formResult.style.color = "red";
                })
                .then(function() {
                    form.reset();
                    setTimeout(() => {
                        formResult.style.display = "none";
                    }, 5000);
                });
        });
    }


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

// --- HERO SLIDESHOW LOGIC ---
let slideIndex = 1;
let slideInterval;

function initializeHeroSlideshow() {
    showSlides(slideIndex);
    startAutoSlide();
}

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetAutoSlide();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    resetAutoSlide();
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}
// --- END HERO SLIDESHOW LOGIC ---

// --- DONATION AND PAYMENT LOGIC ---
function initiateDonation(productName, price) {
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'YOUR_KEY_ID') {
        showToast('Payment gateway is not configured.', 'error');
        console.error("Razorpay Key ID is not set. Please add it to the top of script.js");
        return;
    }

    const options = {
        "key": RAZORPAY_KEY_ID,
        "amount": Math.round(price * 100), // Convert price to paise (e.g., ₹99 -> 9900)
        "currency": "INR",
        "name": "Aroma Label",
        "description": `Donation for: ${productName}`,
        "image": "https://placehold.co/200x200/6a0dad/white?text=A",
        "handler": function (response){
            showToast(`Donation successful! Payment ID: ${response.razorpay_payment_id}`, 'success');
        },
        "prefill": {
            "name": "Generous Donor",
            "email": "donor@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#6a0dad"
        }
    };
    
    const rzp1 = new Razorpay(options);
    rzp1.open();
}
// ADD THIS NEW FUNCTION for checkout payments
function initiateCheckout(totalAmount) {
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'YOUR_KEY_ID') {
        showToast('Payment gateway is not configured.', 'error');
        console.error("Razorpay Key ID is not set. Please add it to the top of script.js");
        return;
    }

    const options = {
        "key": RAZORPAY_KEY_ID,
        "amount": Math.round(totalAmount * 100), // Convert total to paise
        "currency": "INR",
        "name": "Aroma Label",
        "description": "Payment for your order",
        "image": "https://placehold.co/200x200/6a0dad/white?text=A",
        "handler": function (response){
            showToast(`Payment successful! Payment ID: ${response.razorpay_payment_id}`, 'success');
            // Clear the cart after successful payment
            cart = [];
            saveCartToStorage();
            updateCartUI();
            toggleCart(); // Close the cart sidebar
        },
        "prefill": {
            "name": "Valued Customer",
            "email": "customer@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#6a0dad"
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
}
function handleDonateClick(e) {
    const card = e.target.closest('.product-card');
    const productName = card.querySelector('.product-name')?.textContent.trim() || 'this item';
    const price = parseFloat(e.target.dataset.price); // Read the price from the button
    initiateDonation(productName, price);
}


// --- END DONATION AND PAYMENT LOGIC ---

// --- OTHER FUNCTIONS ---

function toggleMobileMenu() {
    elements.mobileMenuOverlay?.classList.toggle('active');
}

function toggleSearch() {
    elements.searchBar?.classList.toggle('active');
    if (elements.searchBar?.classList.contains('active')) {
        elements.searchInput?.focus();
    } else {
        elements.searchInput.value = '';
        showAllProducts();
    }
}

// function handleSearch(e) {
//     const query = e.target.value.toLowerCase();
//     const productCards = document.querySelectorAll('.product-card');
//     productCards.forEach(card => {
//         const productName = card.querySelector('.product-name')?.textContent?.toLowerCase() || '';
//         if (productName.includes(query)) {
//             card.style.display = 'block';
//         } else {
//             card.style.display = 'none';
//         }
//     });
// }

function handleSearch() {
    updateProductVisibility();
}

function showAllProducts() {
    document.querySelectorAll('.product-card').forEach(card => card.style.display = 'block');
}

function toggleCart() {
    elements.cartSidebar?.classList.toggle('active');
}

function loadCartFromStorage() {
    cart = JSON.parse(localStorage.getItem('aromaCart')) || [];
}

function saveCartToStorage() {
    localStorage.setItem('aromaCart', JSON.stringify(cart));
}

function handleAddToCart(e) {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const productData = {
        id: btn.dataset.name, // Use name as a simple ID
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
    };
    const existingProduct = cart.find(item => item.id === productData.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...productData, quantity: 1 });
    }
    updateCartUI();
    saveCartToStorage();
    showToast(`${productData.name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCartToStorage();
}

function updateCartQuantity(id, quantity) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity = Math.max(0, quantity);
        if (product.quantity === 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (elements.cartCount) {
        elements.cartCount.textContent = totalItems;
        elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (elements.cartTotal) elements.cartTotal.textContent = totalPrice.toFixed(0);
    if (elements.cartItems) {
        if (cart.length === 0) {
            elements.cartItems.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
        } else {
            elements.cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="aromaApp.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" onchange="aromaApp.updateCartQuantity('${item.id}', parseInt(this.value))" min="0">
                            <button class="qty-btn" onclick="aromaApp.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="aromaApp.removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>`).join('');
        }
    }
    if (elements.checkoutBtn) elements.checkoutBtn.disabled = cart.length === 0;
}

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty.', 'warning');
        return;
    }
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    initiateCheckout(totalAmount);
}

function animateCartIcon() {
    elements.cartBtn?.classList.add('bounce-effect');
    setTimeout(() => elements.cartBtn?.classList.remove('bounce-effect'), 600);
}

function initializeProductFiltering() {
    const allBtn = document.querySelector('[data-category="all"]');
    allBtn?.classList.add('active');
}

// function handleCategoryFilter(e) {
//     const category = e.target.dataset.category;
//     elements.filterBtns?.forEach(btn => btn.classList.remove('active'));
//     e.target.classList.add('active');
//     document.querySelectorAll('.product-card').forEach(card => {
//         card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
//     });
// }

//Search Filter
function updateProductVisibility() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const searchQuery = elements.searchInput.value.toLowerCase();
    let visibleProducts = 0;

    document.querySelectorAll('.product-card').forEach(card => {
        const cardCategory = card.dataset.category;
        const cardName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';

        const categoryMatch = (activeCategory === 'all' || cardCategory === activeCategory);
        const searchMatch = cardName.includes(searchQuery);

        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            visibleProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Handle the "No results" message
    if (visibleProducts === 0 && (searchQuery !== '' || activeCategory !== 'all')) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function handleCategoryFilter(e) {
    // Update active button state
    elements.filterBtns?.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update the products shown on the page
    updateProductVisibility();
}


function openQuickView(productKey) {
    const productData = getProductData(productKey);
    if (!productData) return;
    document.getElementById('modalImage').src = productData.image;
    document.getElementById('modalTitle').textContent = productData.name;
    document.getElementById('modalDescription').textContent = productDescriptions[productKey] || '';
    document.getElementById('modalSalePrice').textContent = `₹${productData.price}`;
    document.getElementById('modalOriginalPrice').textContent = productData.originalPrice ? `₹${productData.originalPrice}` : '';
    document.getElementById('modalOriginalPrice').style.display = productData.originalPrice ? 'inline' : 'none';
    document.getElementById('modalQuantity').value = 1;

    document.getElementById('modalAddToCart').onclick = () => {
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        const existingProduct = cart.find(item => item.id === productData.name);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id: productData.name, name: productData.name, price: productData.price, image: productData.image, quantity: quantity });
        }
        updateCartUI();
        saveCartToStorage();
        showToast(`${productData.name} added to cart!`, 'success');
        closeQuickView();
    };

    const modalDonateBtn = document.querySelector('.modal-donate-btn');
    if (modalDonateBtn) {
        modalDonateBtn.onclick = () => {
            const productName = document.getElementById('modalTitle')?.textContent.trim() || 'this item';
            initiateDonation(productName);
        };
    }
    
    elements.quickViewModal?.classList.add('active');
}

function closeQuickView() {
    elements.quickViewModal?.classList.remove('active');
}

function getProductData(productKey) {
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

function handleNewsletter() {
    const email = elements.newsletterEmail?.value;
    if (!email || !isValidEmail(email)) return showToast('Please enter a valid email address', 'error');
    showToast(`Thank you for subscribing!`, 'success');
    elements.newsletterEmail.value = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'info') {
    const toastContainer = document.body.querySelector('.toast-container') || document.createElement('div');
    if (!toastContainer.className) {
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }[type];
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

function showLoading() { /* Not implemented */ }
function hideLoading() { /* Not implemented */ }

function initializeScrollAnimations() { /* Not implemented */ }
function handleScroll() { /* Not implemented */ }
function handleResize() {
    if (window.innerWidth > 768) elements.mobileMenuOverlay?.classList.remove('active');
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerOffset = document.querySelector('header')?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
}

function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        if (elements.quickViewModal?.classList.contains('active')) closeQuickView();
        else if (elements.cartSidebar?.classList.contains('active')) toggleCart();
        else if (elements.searchBar?.classList.contains('active')) toggleSearch();
    }
}

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

function syncCartAcrossTabs() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'aromaCart') {
            loadCartFromStorage();
            updateCartUI();
        }
    });
}

window.aromaApp = {
    openQuickView,
    removeFromCart,
    updateCartQuantity,
    plusSlides,
    currentSlide,
    showToast,
    toggleCart,
    toggleSearch
};
