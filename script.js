document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let allProducts = [];
    let filteredProducts = [];
    let cart = [];
    let currentSort = 'default';
    let currentPriceFilter = 'all';
    const API_URL = 'https://fakestoreapi.com/products';

    // Account Management State
    let currentUser = null;
    let userOrders = [];
    let isLoggedIn = false;

    // Search suggestions
    const searchSuggestions = [
        'laptop', 'phone', 'headphones', 'watch', 'tablet', 'camera', 'speaker',
        'keyboard', 'mouse', 'monitor', 'charger', 'case', 'electronics', 'jewelry',
        'clothing', 'mens', 'womens', 'shirt', 'dress', 'jacket', 'shoes', 'bag'
    ];

    // --- DOM ELEMENTS ---
    const productGrid = document.getElementById('product-grid');
    const cartCount = document.getElementById('cart-count');
    const loadingSpinner = document.getElementById('loading-spinner');
    const searchBar = document.getElementById('search-bar');
    const searchSuggestionsEl = document.getElementById('search-suggestions');
    const categoryFilters = document.getElementById('category-filters');
    const sortSelect = document.getElementById('sort-select');
    const priceFilter = document.getElementById('price-filter');
    const activeFiltersEl = document.getElementById('active-filters');
    
    // Views
    const shopView = document.getElementById('shop-view');
    const cartView = document.getElementById('cart-view');
    const checkoutView = document.getElementById('checkout-view');
    const contactView = document.getElementById('contact-view');
    const aboutView = document.getElementById('about-view');
    const termsView = document.getElementById('terms-view');
    const profileView = document.getElementById('profile-view');
    const ordersView = document.getElementById('orders-view');
    const settingsView = document.getElementById('settings-view');

    // Account Management Elements
    const accountDropdown = document.getElementById('account-dropdown');
    const accountButton = document.getElementById('account-button');
    const accountMenu = document.getElementById('account-menu');
    const accountDisplayName = document.getElementById('account-display-name');
    const loggedOutMenu = document.getElementById('logged-out-menu');
    const loggedInMenu = document.getElementById('logged-in-menu');

    // Cart Elements
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    
    // Modal Elements
    const productModal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');

    // Toast Element
    const toast = document.getElementById('toast');

    // Slider Elements
    const slider = document.getElementById('hero-slider');
    const sliderItems = slider.querySelectorAll('.slider-item');
    const sliderDotsContainer = document.getElementById('slider-dots');
    let currentSlide = 0;
    let slideInterval;


    // --- API FETCHING ---
    async function fetchProducts() {
        try {
            loadingSpinner.style.display = 'flex';
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            allProducts = await response.json();
            renderProducts();
        } catch (error) {
            productGrid.innerHTML = `<p class="text-center text-red-500 col-span-full">Failed to load products. Please try again later.</p>`;
            console.error('Fetch error:', error);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // --- RENDERING ---
    function renderProducts() {
        productGrid.innerHTML = '';
        const searchTerm = searchBar.value.toLowerCase();
        const activeCategory = categoryFilters.querySelector('.active').dataset.category;

        // Filter products
        filteredProducts = allProducts.filter(product => {
            const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
            const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm) ||
                                product.category.toLowerCase().includes(searchTerm);
            const matchesPrice = checkPriceFilter(product.price);
            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Sort products
        sortProducts();

        // Update active filters display
        updateActiveFilters();
        
        if (filteredProducts.length === 0) {
             productGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 class="mt-4 text-xl font-medium text-gray-300">No products found</h3>
                    <p class="mt-2 text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
             `;
             return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:shadow-2xl border border-gray-700 hover:border-indigo-500';
            productCard.dataset.productId = product.id;
            
            // Create star rating
            const rating = Math.round(product.rating.rate);
            const stars = Array(5).fill(0).map((_, i) => 
                i < rating ? '★' : '☆'
            ).join('');
            
            productCard.innerHTML = `
                <div class="relative p-4">
                    <img src="${product.image}" alt="${product.title}" class="product-card-image">
                    <div class="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ${product.rating.rate}★
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg truncate mb-2">${product.title}</h3>
                    <p class="text-gray-400 text-sm mt-1 h-12 overflow-hidden line-clamp-2">${product.description}</p>
                    <div class="flex items-center justify-between mt-4">
                        <div>
                            <span class="font-bold text-xl text-green-400">$${product.price.toFixed(2)}</span>
                            <div class="text-yellow-400 text-sm">${stars}</div>
                        </div>
                        <button class="add-to-cart-btn bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition-all transform hover:scale-105" data-product-id="${product.id}">
                            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Add
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    function checkPriceFilter(price) {
        switch(currentPriceFilter) {
            case '0-25': return price < 25;
            case '25-50': return price >= 25 && price < 50;
            case '50-100': return price >= 50 && price < 100;
            case '100-500': return price >= 100 && price < 500;
            case '500+': return price >= 500;
            default: return true;
        }
    }
    
    function sortProducts() {
        switch(currentSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
                break;
            default:
                // Keep original order (featured)
                break;
        }
    }
    
    function updateActiveFilters() {
        const filters = [];
        const activeCategory = categoryFilters.querySelector('.active').dataset.category;
        
        if (activeCategory !== 'all') {
            filters.push({type: 'category', value: activeCategory});
        }
        
        if (currentPriceFilter !== 'all') {
            const priceText = priceFilter.options[priceFilter.selectedIndex].text;
            filters.push({type: 'price', value: priceText});
        }
        
        if (searchBar.value.trim()) {
            filters.push({type: 'search', value: searchBar.value.trim()});
        }
        
        if (filters.length > 0) {
            activeFiltersEl.classList.remove('hidden');
            const filterTags = filters.map(filter => 
                `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white">
                    ${filter.value}
                    <button class="ml-2 hover:text-gray-300" onclick="removeFilter('${filter.type}', '${filter.value}')">×</button>
                </span>`
            ).join('');
            activeFiltersEl.innerHTML = `<span class="text-sm text-gray-400">Filters:</span> ${filterTags}`;
        } else {
            activeFiltersEl.classList.add('hidden');
        }
    }
    
    function removeFilter(type, value) {
        switch(type) {
            case 'category':
                categoryFilters.querySelector('.active').classList.remove('active');
                categoryFilters.querySelector('[data-category="all"]').classList.add('active');
                break;
            case 'price':
                priceFilter.value = 'all';
                currentPriceFilter = 'all';
                break;
            case 'search':
                searchBar.value = '';
                hideSearchSuggestions();
                break;
        }
        renderProducts();
    }
    
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cartSummary.classList.remove('hidden');
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'flex items-center justify-between bg-gray-800 p-4 rounded-lg';
                cartItem.innerHTML = `
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded">
                        <div>
                            <h4 class="font-semibold truncate w-48 sm:w-auto">${item.title}</h4>
                            <p class="text-gray-400">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input w-16 bg-gray-700 border border-gray-600 rounded text-center" data-product-id="${item.id}">
                        <button class="remove-from-cart-btn text-red-500 hover:text-red-400" data-product-id="${item.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        updateCartSummary();
        updateCartCount();
    }

    // --- ACCOUNT MANAGEMENT ---
    function loadUserData() {
        const savedUser = localStorage.getItem('techNovaUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            updateAccountUI();
            loadUserOrders();
        }
    }

    function saveUserData() {
        if (currentUser) {
            localStorage.setItem('techNovaUser', JSON.stringify(currentUser));
        }
    }

    function loginUser(userData) {
        currentUser = {
            id: userData.id || Date.now(),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email,
            phone: userData.phone || '',
            address: userData.address || '',
            memberSince: userData.memberSince || new Date().toISOString(),
            emailNotifications: userData.emailNotifications !== false,
            smsNotifications: userData.smsNotifications || false
        };
        isLoggedIn = true;
        saveUserData();
        updateAccountUI();
        showToast('Welcome back!', 'bg-green-500');
    }

    function logoutUser() {
        currentUser = null;
        isLoggedIn = false;
        userOrders = [];
        localStorage.removeItem('techNovaUser');
        localStorage.removeItem('techNovaOrders');
        updateAccountUI();
        switchView('shop-view');
        showToast('Logged out successfully', 'bg-blue-500');
    }

    function updateAccountUI() {
        if (isLoggedIn && currentUser) {
            accountDisplayName.textContent = currentUser.firstName || currentUser.email.split('@')[0];
            loggedOutMenu.classList.add('hidden');
            loggedInMenu.classList.remove('hidden');
            updateProfileDisplay();
        } else {
            accountDisplayName.textContent = 'Account';
            loggedOutMenu.classList.remove('hidden');
            loggedInMenu.classList.add('hidden');
        }
    }

    function updateProfileDisplay() {
        if (!currentUser) return;
        
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileMemberSince = document.getElementById('profile-member-since');
        
        if (profileName) {
            profileName.textContent = currentUser.firstName && currentUser.lastName 
                ? `${currentUser.firstName} ${currentUser.lastName}` 
                : currentUser.email.split('@')[0];
        }
        if (profileEmail) profileEmail.textContent = currentUser.email;
        if (profileMemberSince) {
            const memberDate = new Date(currentUser.memberSince).toLocaleDateString();
            profileMemberSince.textContent = `Member since ${memberDate}`;
        }

        // Update form fields
        const firstNameInput = document.getElementById('profile-first-name');
        const lastNameInput = document.getElementById('profile-last-name');
        const emailInput = document.getElementById('profile-email-input');
        const phoneInput = document.getElementById('profile-phone');
        const addressInput = document.getElementById('profile-address');
        const emailNotifications = document.getElementById('email-notifications');
        const smsNotifications = document.getElementById('sms-notifications');

        if (firstNameInput) firstNameInput.value = currentUser.firstName || '';
        if (lastNameInput) lastNameInput.value = currentUser.lastName || '';
        if (emailInput) emailInput.value = currentUser.email || '';
        if (phoneInput) phoneInput.value = currentUser.phone || '';
        if (addressInput) addressInput.value = currentUser.address || '';
        if (emailNotifications) emailNotifications.checked = currentUser.emailNotifications;
        if (smsNotifications) smsNotifications.checked = currentUser.smsNotifications;
    }

    function saveUserOrder(orderData) {
        if (!isLoggedIn) return;
        
        const order = {
            id: Date.now(),
            userId: currentUser.id,
            date: new Date().toISOString(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.00,
            status: 'Processing',
            shippingAddress: orderData.address || currentUser.address
        };
        
        userOrders.unshift(order);
        localStorage.setItem('techNovaOrders', JSON.stringify(userOrders));
        renderOrders();
    }

    function loadUserOrders() {
        if (!isLoggedIn) return;
        
        const savedOrders = localStorage.getItem('techNovaOrders');
        if (savedOrders) {
            const allOrders = JSON.parse(savedOrders);
            userOrders = allOrders.filter(order => order.userId === currentUser.id);
        }
        renderOrders();
    }

    function renderOrders() {
        const ordersContainer = document.getElementById('orders-container');
        const noOrders = document.getElementById('no-orders');
        
        if (!ordersContainer) return;
        
        if (userOrders.length === 0) {
            ordersContainer.innerHTML = '';
            noOrders.classList.remove('hidden');
            return;
        }
        
        noOrders.classList.add('hidden');
        ordersContainer.innerHTML = userOrders.map(order => `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white">Order #${order.id}</h3>
                        <p class="text-gray-400">${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Processing' ? 'bg-yellow-600 text-yellow-100' :
                        order.status === 'Shipped' ? 'bg-blue-600 text-blue-100' :
                        order.status === 'Delivered' ? 'bg-green-600 text-green-100' :
                        'bg-gray-600 text-gray-100'
                    }">${order.status}</span>
                </div>
                <div class="space-y-2 mb-4">
                    ${order.items.map(item => `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-contain rounded mr-3">
                                <div>
                                    <p class="text-white font-medium">${item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</p>
                                    <p class="text-gray-400 text-sm">Qty: ${item.quantity}</p>
                                </div>
                            </div>
                            <p class="text-green-400 font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="border-t border-gray-700 pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-white">Total: $${order.total.toFixed(2)}</span>
                        <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                            Track Order
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Mock login function for demo purposes
    function demoLogin() {
        const demoUser = {
            email: 'demo@technova.com',
            firstName: 'Demo',
            lastName: 'User',
            phone: '+1 (555) 123-4567',
            address: '123 Tech Street, Digital City, DC 12345',
            memberSince: '2024-01-15T00:00:00Z'
        };
        loginUser(demoUser);
    }

    // --- CART LOGIC ---
    function addToCart(productId) {
        const product = allProducts.find(p => p.id == productId);
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCart();
        showToast(`${product.title} added to cart!`);
    }

    function removeFromCart(productId) {
        const product = cart.find(item => item.id == productId);
        cart = cart.filter(item => item.id != productId);
        saveCart();
        renderCart();
        showToast(`${product.title} removed from cart.`, 'bg-red-500');
    }

    function updateQuantity(productId, quantity) {
        const cartItem = cart.find(item => item.id == productId);
        if (cartItem) {
            cartItem.quantity = parseInt(quantity);
            if (cartItem.quantity <= 0) {
               removeFromCart(productId);
            } else {
                saveCart();
                renderCart();
            }
        }
    }
    
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = cart.length > 0 ? 5.00 : 0;
        const total = subtotal + shipping;

        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartTotalEl.textContent = `$${total.toFixed(2)}`;

        document.getElementById('checkout-btn').disabled = cart.length === 0;
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function saveCart() {
        localStorage.setItem('techNovaCart', JSON.stringify(cart));
    }

    function loadCart() {
        const savedCart = localStorage.getItem('techNovaCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            renderCart();
        }
    }

    // --- SLIDER LOGIC ---
    function setupSlider() {
        if(sliderItems.length === 0) return;
        sliderItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'bg-gray-400', 'rounded-full', 'transition', 'hover:bg-white');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSlideInterval();
            });
            sliderDotsContainer.appendChild(dot);
        });
        
        // Add navigation button event listeners
        document.getElementById('prev-slide').addEventListener('click', () => {
            prevSlide();
            resetSlideInterval();
        });
        
        document.getElementById('next-slide').addEventListener('click', () => {
            nextSlide();
            resetSlideInterval();
        });
        
        showSlide(currentSlide);
        startSlideInterval();
    }

    function showSlide(index) {
        sliderItems.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
        const dots = sliderDotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-gray-400', i !== index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % sliderItems.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = currentSlide === 0 ? sliderItems.length - 1 : currentSlide - 1;
        showSlide(currentSlide);
    }
    
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // --- SEARCH FUNCTIONALITY ---
    function showSearchSuggestions(query) {
        if (!query.trim()) {
            hideSearchSuggestions();
            return;
        }
        
        const matches = searchSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
        
        if (matches.length > 0) {
            searchSuggestionsEl.innerHTML = matches.map(match => 
                `<div class="px-4 py-2 hover:bg-gray-700 cursor-pointer transition" onclick="selectSuggestion('${match}')">${match}</div>`
            ).join('');
            searchSuggestionsEl.classList.remove('hidden');
        } else {
            hideSearchSuggestions();
        }
    }
    
    function hideSearchSuggestions() {
        searchSuggestionsEl.classList.add('hidden');
    }
    
    function selectSuggestion(suggestion) {
        searchBar.value = suggestion;
        hideSearchSuggestions();
        renderProducts();
    }

    // --- MODAL LOGIC ---
    function showProductModal(productId) {
        const product = allProducts.find(p => p.id == productId);
        if (!product) return;
        
        modalContent.innerHTML = `
            <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <img src="${product.image}" alt="${product.title}" class="w-full rounded-lg modal-product-image mx-auto">
                <div>
                    <h2 class="text-2xl font-bold">${product.title}</h2>
                    <div class="flex items-center mt-2">
                        <div class="flex items-center">
                            ${Array(Math.round(product.rating.rate)).fill('<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>').join('')}
                            ${Array(5 - Math.round(product.rating.rate)).fill('<svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>').join('')}
                        </div>
                        <span class="text-gray-400 ml-2">${product.rating.rate} (${product.rating.count} reviews)</span>
                    </div>
                    <p class="text-gray-300 mt-4">${product.description}</p>
                    <div class="mt-6 flex items-center justify-between">
                        <span class="font-bold text-3xl">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn-modal bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productModal.classList.remove('hidden');
        // Add close functionality
        document.getElementById('close-modal-btn').addEventListener('click', () => productModal.classList.add('hidden'));
        document.querySelector('.add-to-cart-btn-modal').addEventListener('click', (e) => {
            addToCart(e.target.dataset.productId);
            productModal.classList.add('hidden');
        });
    }
    
    // --- UI & TOAST NOTIFICATIONS ---
    let toastTimeout;
    function showToast(message, className = 'bg-green-500') {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.className = `fixed bottom-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 toast-enter ${className}`;
        
        setTimeout(() => {
            toast.classList.remove('toast-enter');
        }, 10);
        
        toastTimeout = setTimeout(() => {
            toast.classList.add('toast-exit');
             setTimeout(() => {
                toast.className += ' hidden'; // keep classes for potential re-use
             }, 300);
        }, 3000);
    }

    // --- NAVIGATION / VIEW SWITCHING ---
    function switchView(viewId) {
        [shopView, cartView, checkoutView, contactView, aboutView, termsView, profileView, ordersView, settingsView].forEach(view => {
            if (view) view.classList.add('hidden');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
            
            // Update profile data when switching to profile-related views
            if (viewId === 'profile-view' && isLoggedIn) {
                updateProfileDisplay();
            } else if (viewId === 'orders-view' && isLoggedIn) {
                loadUserOrders();
            }
        }
        window.scrollTo(0, 0);
        
        // Close account dropdown
        if (accountMenu) accountMenu.classList.add('hidden');
    }

    // Make functions globally accessible for onclick handlers
    window.removeFilter = removeFilter;
    window.selectSuggestion = selectSuggestion;

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Product Grid Interaction (Event Delegation)
        productGrid.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const productCard = e.target.closest('[data-product-id]');
            
            if (addToCartBtn) {
                addToCart(addToCartBtn.dataset.productId);
            } else if (productCard) {
                showProductModal(productCard.dataset.productId);
            }
        });

        // Search and Filter
        searchBar.addEventListener('input', (e) => {
            showSearchSuggestions(e.target.value);
            renderProducts();
        });
        
        searchBar.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                showSearchSuggestions(e.target.value);
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchSuggestionsEl.contains(e.target)) {
                hideSearchSuggestions();
            }
        });
        
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
        
        priceFilter.addEventListener('change', (e) => {
            currentPriceFilter = e.target.value;
            renderProducts();
        });
        
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                categoryFilters.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                renderProducts();
            }
        });
        
        // Cart Interaction (Event Delegation)
        cartItemsContainer.addEventListener('click', e => {
            const removeBtn = e.target.closest('.remove-from-cart-btn');
            if(removeBtn) {
                removeFromCart(removeBtn.dataset.productId);
            }
        });

        cartItemsContainer.addEventListener('change', e => {
             const quantityInput = e.target.closest('.quantity-input');
             if(quantityInput) {
                updateQuantity(quantityInput.dataset.productId, quantityInput.value);
             }
        });
        
        // Navigation
        document.getElementById('home-link').addEventListener('click', (e) => { e.preventDefault(); switchView('shop-view'); });
        document.getElementById('shop-link').addEventListener('click', (e) => { e.preventDefault(); switchView('shop-view'); });
        document.getElementById('about-link').addEventListener('click', (e) => { e.preventDefault(); switchView('about-view'); });
        document.getElementById('mobile-shop-link').addEventListener('click', (e) => {
            e.preventDefault();
            switchView('shop-view');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        document.getElementById('mobile-about-link').addEventListener('click', (e) => {
            e.preventDefault();
            switchView('about-view');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        document.getElementById('contact-link').addEventListener('click', (e) => { e.preventDefault(); switchView('contact-view'); });
        document.getElementById('mobile-contact-link').addEventListener('click', (e) => {
            e.preventDefault();
            switchView('contact-view');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        document.getElementById('cart-button').addEventListener('click', () => switchView('cart-view'));
        document.getElementById('checkout-btn').addEventListener('click', () => switchView('checkout-view'));
        document.getElementById('return-to-shop-btn').addEventListener('click', () => switchView('shop-view'));

        // Footer Links
        document.getElementById('footer-about-link').addEventListener('click', (e) => { e.preventDefault(); switchView('about-view'); });
        document.getElementById('footer-contact-link').addEventListener('click', (e) => { e.preventDefault(); switchView('contact-view'); });
        document.getElementById('footer-terms-link').addEventListener('click', (e) => { e.preventDefault(); switchView('terms-view'); });

        // Account Management
        if (accountButton) {
            accountButton.addEventListener('click', (e) => {
                e.preventDefault();
                accountMenu.classList.toggle('hidden');
            });
        }

        // Close account menu when clicking outside
        document.addEventListener('click', (e) => {
            if (accountDropdown && !accountDropdown.contains(e.target)) {
                accountMenu.classList.add('hidden');
            }
        });

        // Account navigation
        const profileLink = document.getElementById('profile-link');
        const ordersLink = document.getElementById('orders-link');
        const settingsLink = document.getElementById('settings-link');
        const logoutButton = document.getElementById('logout-button');

        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (isLoggedIn) {
                    switchView('profile-view');
                } else {
                    showToast('Please login to view your profile', 'bg-yellow-500');
                }
            });
        }

        if (ordersLink) {
            ordersLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (isLoggedIn) {
                    switchView('orders-view');
                } else {
                    showToast('Please login to view your orders', 'bg-yellow-500');
                }
            });
        }

        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (isLoggedIn) {
                    switchView('settings-view');
                } else {
                    showToast('Please login to access settings', 'bg-yellow-500');
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!isLoggedIn) return;
                
                const formData = new FormData(e.target);
                currentUser.firstName = formData.get('firstName');
                currentUser.lastName = formData.get('lastName');
                currentUser.email = formData.get('email');
                currentUser.phone = formData.get('phone');
                currentUser.address = formData.get('address');
                
                saveUserData();
                updateProfileDisplay();
                showToast('Profile updated successfully!', 'bg-green-500');
            });
        }

        // Password form
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newPassword = formData.get('newPassword');
                const confirmPassword = formData.get('confirmPassword');
                
                if (newPassword !== confirmPassword) {
                    showToast('Passwords do not match', 'bg-red-500');
                    return;
                }
                
                if (newPassword.length < 8) {
                    showToast('Password must be at least 8 characters', 'bg-red-500');
                    return;
                }
                
                showToast('Password updated successfully!', 'bg-green-500');
                e.target.reset();
            });
        }

        // Notification preferences
        const emailNotifications = document.getElementById('email-notifications');
        const smsNotifications = document.getElementById('sms-notifications');
        
        if (emailNotifications) {
            emailNotifications.addEventListener('change', (e) => {
                if (isLoggedIn) {
                    currentUser.emailNotifications = e.target.checked;
                    saveUserData();
                }
            });
        }
        
        if (smsNotifications) {
            smsNotifications.addEventListener('change', (e) => {
                if (isLoggedIn) {
                    currentUser.smsNotifications = e.target.checked;
                    saveUserData();
                }
            });
        }

        // Delete account
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    logoutUser();
                    showToast('Account deleted successfully', 'bg-red-500');
                }
            });
        }

        // Start shopping from orders page
        const startShoppingBtn = document.getElementById('start-shopping-btn');
        if (startShoppingBtn) {
            startShoppingBtn.addEventListener('click', () => {
                switchView('shop-view');
            });
        }

        // Demo login button (for testing)
        const demoLoginBtn = document.createElement('button');
        demoLoginBtn.textContent = 'Demo Login';
        demoLoginBtn.className = 'fixed bottom-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm z-50';
        demoLoginBtn.addEventListener('click', demoLogin);
        document.body.appendChild(demoLoginBtn);

        // Add slider button functionality
        const sliderButtons = document.querySelectorAll('#hero-slider button[class*="bg-"]');
        sliderButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const buttonText = button.textContent.trim();
                
                if (buttonText.includes('Shop') || buttonText.includes('Deals') || buttonText.includes('Learn') || buttonText.includes('Explore') || buttonText.includes('Gaming') || buttonText.includes('Workspace')) {
                    // You can add specific navigation logic here
                    if (buttonText.includes('Deals')) {
                        window.location.href = 'promotions.html';
                    } else {
                        // Scroll to products or perform other actions
                        productGrid.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Mobile Menu Toggle
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
        
        // Modal close on overlay click
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.add('hidden');
            }
        });

        // Forms
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save order for logged-in users
            if (isLoggedIn && cart.length > 0) {
                const formData = new FormData(e.target);
                const orderData = {
                    address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} ${formData.get('zip')}`
                };
                saveUserOrder(orderData);
            }
            
            showToast('Order placed successfully!', 'bg-blue-500');
            cart = [];
            saveCart();
            renderCart();
            switchView('shop-view');
            e.target.reset();
        });

        document.getElementById('contact-form').addEventListener('submit', (e) => {
             e.preventDefault();
             showToast('Message sent! We will get back to you soon.', 'bg-blue-500');
             e.target.reset();
             switchView('shop-view');
        });

        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thanks for subscribing!', 'bg-blue-500');
            e.target.reset();
        });
    }

    // --- INITIALIZATION ---
    loadCart();
    loadUserData();
    fetchProducts();
    setupEventListeners();
    setupSlider();
    toast.classList.add('hidden');
});
