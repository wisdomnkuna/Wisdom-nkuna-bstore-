  // Load products to the home page
    function loadProducts() {
            const productsContainer = document.getElementById('products-container');
            productsContainer.innerHTML = '';
            
            products.forEach(product => {
                const isFavorite = favorites.includes(product.id);
                const favoriteClass = isFavorite ? 'active' : '';
                
                const productCard = `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <div class="product-title">${product.name}</div>
                   
                   <div class="product-describe">      
                    <p>${product.description}</p>
                    </div>
                    
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <div class="product-actions">
                                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                                <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${product.id})">
                                    <i class="material-icons">${isFavorite ? 'favorite' : 'favorite_border'}</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                `;
                
                productsContainer.innerHTML += productCard;
                
            });
        }
        
        

         function scrollRight() {
         document.getElementById('products-container').scrollBy({
         left: 300,
         behavior: 'smooth'
        });
      }
        
        
        // Add a product to the cart
        function addToCart(productId) {
            if (!currentUser) {
                showPage('login-page');
                return;
            }

            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.productId === productId);
            
            if (existingItemIndex >= 0) {
                // Increment quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                cart.push({
                    productId: productId,
                    quantity: 1,
                    price: product.price
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            alert(`${product.name} added to cart!`);
        }

        // Toggle a product as favorite
        function toggleFavorite(productId) {
            const favoriteIndex = favorites.indexOf(productId);
            
            if (favoriteIndex >= 0) {
                // Remove from favorites
                favorites.splice(favoriteIndex, 1);
            } else {
                // Add to favorites
                favorites.push(productId);
            }
            
            // Save favorites to localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Update UI
            updateFavoritesCount();
            loadProducts(); // Reload products to update favorite icons
            
            // If on favorites page, update the display
            if (document.getElementById('favorites-page').style.display === 'block') {
                updateFavoritesDisplay();
            }
        }

        // Update cart count badge
        function updateCartCount() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
        }

        // Update favorites count badge
        function updateFavoritesCount() {
            document.getElementById('favorites-count').textContent = favorites.length;
        }


                        

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        // Empty cart
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button class="btn btn-primary" onclick="showPage('home-page')">Continue Shopping</button>
            </div>
        `;
        cartSummary.innerHTML = '';
    } else {
        // Populate cart items
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;
            
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemCard = `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="cart5">
                    
                    <div class="cart-item-quantity">
                        <button onclick="updateItemQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateItemQuantity(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        $${itemTotal.toFixed(2)}
                    </div>
                    <div class="cart-item-remove">
                        <button onclick="removeFromCart(${product.id})"><i class="material-icons">delete</i></button>
                    </div>
                   </div>
                </div>
            `;
            
            cartItemsContainer.innerHTML += cartItemCard;
        });
        
        // Calculate totals
        const shipping = subtotal > 0 ? 10.00 : 0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        // Update cart summary
        cartSummary.innerHTML = `
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary" onclick="showPage('checkout-page')">Proceed to Checkout</button>
        `;
    }
}

// Update item quantity in cart
function updateItemQuantity(productId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            removeFromCart(productId);
        } else {
            // Update quantity
            cart[itemIndex].quantity = newQuantity;
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // Update UI
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
        cart.splice(itemIndex, 1);
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update UI
        updateCartCount();
        updateCartDisplay();
    }
}

// Update favorites display
function updateFavoritesDisplay() {
    const favoritesContainer = document.getElementById('favorites-items-container');
    
    if (favorites.length === 0) {
        // Empty favorites
        favoritesContainer.innerHTML = `
            <div class="empty-favorites">
                <i class='far fa-heart'></i>
                <h2>No favorites yet</h2>
                <p>Items you add to your favorites will appear here.</p>
                <button class="btn btn-primary" onclick="showPage('home-page')">Browse Products</button>
            </div>
        `;
    } else {
        // Populate favorites
        favoritesContainer.innerHTML = '';
        
        favorites.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const favoriteCard = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                            <button class="favorite-btn active" onclick="toggleFavorite(${product.id})">
                                <i class="material-icons">favorite</i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            favoritesContainer.innerHTML += favoriteCard;
        });
    }
}

// Load user data
function loadUserData() {
    // In a real app, this would fetch data from a database
    // For this demo, we'll use localStorage to simulate persistence
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    updateCartCount();
    updateFavoritesCount();
    loadOrders();
    loadUserReviews();
}

// Load user orders
function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        // No orders
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <i class="material-icons">shopping_bag</i>
                <h3>No orders yet</h3>
                <p>Your order history will appear here.</p>
            </div>
        `;
    } else {
        // Populate orders
        ordersContainer.innerHTML = '';
        
        orders.forEach((order, index) => {
            const orderCard = `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Order id ${order.id}</h3>
                        <div class="order-date">${order.date}</div>
                        <div class="order-status">${order.status}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return `
                                <div class="order-item">
                                    <img src="${product.image}" alt="${product.name}">
                                    <div class="order-item-details">
                                        <div>${product.name}</div>
                                        <div>Qty: ${item.quantity}</div>
                                        <div>$${(product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="order-total">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-secondary" onclick="trackOrder(${order.id})">Track Order</button>
                        <button class="btn btn-secondary" onclick="reviewOrder(${order.id})">Write a Review</button>
                    </div>
                </div>
            `;
            
            ordersContainer.innerHTML += orderCard;
        });
    }
}



// Load user reviews
function loadUserReviews() {
    const reviewsContainer = document.getElementById('user-reviews-container');
    
    if (reviews.length === 0) {
        // No reviews
        reviewsContainer.innerHTML = `
            <div class="empty-reviews">
                <i class="material-icons">rate_review</i>
                <h3>No reviews yet</h3>
                <p>Your product reviews will appear here.</p>
            </div>
        `;
    } else {
        // Populate reviews
        reviewsContainer.innerHTML = '';
        
        reviews.forEach(review => {
            const product = products.find(p => p.id === review.productId);
            if (!product) return;
            
            const reviewCard = `
                <div class="review-card">
                    <div class="review-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="review-product-info">
                            <h3>${product.name}</h3>
                            <div class="review-date">${review.date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStarRating(review.rating)}
                    </div>
                    <div class="review-content">
                        <h4>${review.title}</h4>
                        <p>${review.content}</p>
                    </div>
                </div>
            `;
            
            reviewsContainer.innerHTML += reviewCard;
        });
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">☆</span>';
        }
    }
    return stars;
}



// Checkout process functions
function goToReview() {
    // Validate address form
    const fullname = document.getElementById('fullname').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const phone = document.getElementById('phone').value;
    
    if (!fullname || !address || !city || !postalCode || !phone) {
        alert('Please fill in all address fields.');
        return;
    }
    
    // Update checkout step
    currentStep = 'review';
    document.getElementById('step-address').classList.add('active');
    document.getElementById('step-review').classList.add('active');
    document.getElementById('address-form').style.display = 'none';
    document.getElementById('review-form').style.display = 'block';
    
    // Load review items
    
    const reviewItemsContainer = document.getElementById('review-items-container');
    
    reviewItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        const reviewItemCard = `
            <div class="review-item">
                 
                <div class="review-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="review-item-details">
                    <h3>${product.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                </div>
                <div class="review-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
        
        reviewItemsContainer.innerHTML += reviewItemCard;
    });
    
    // Calculate totals
    const shipping = 10.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Add summary
    reviewItemsContainer.innerHTML += `
        <div class="review-summary">
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function goBackToAddress() {
    currentStep = 'address';
    document.getElementById('step-review').classList.remove('active');
    document.getElementById('address-form').style.display = 'block';
    document.getElementById('review-form').style.display = 'none';
}

function goToPayment() {
    // Update checkout step
    currentStep = 'payment';
    document.getElementById('step-payment').classList.add('active');
    document.getElementById('review-form').style.display = 'none';
    document.getElementById('payment-options').style.display = 'block';
    
    // Reset payment method selection
    selectedPaymentMethod = null;
    document.getElementById('cod-option').classList.remove('selected');
    document.getElementById('card-option').classList.remove('selected');
    document.getElementById('card-payment-form').style.display = 'none';
    document.getElementById('cod-payment-form').style.display = 'none';
}

function goBackToReview() {
    currentStep = 'review';
    document.getElementById('step-payment').classList.remove('active');
    document.getElementById('payment-options').style.display = 'none';
    document.getElementById('review-form').style.display = 'block';
}





function processCardPayment() {
    // Validate card details
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('card-name').value;
    
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Please fill in all card details.');
        return;
    }
    
    // Process order
    placeOrder('Credit Card');
}

function processCodPayment() {
    // Process order
    placeOrder('Cash on Delivery');
}

function placeOrder(paymentMethod) {
    // Create order object
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        status: 'Processing',
        items: [...cart],
        total: cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product.price * item.quantity);
        }, 0) * 1.08 + 10.00, // Including tax and shipping
        shippingAddress: {
            name: document.getElementById('fullname').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            phone: document.getElementById('phone').value
        },
        paymentMethod: paymentMethod
    };
    
    // Add to orders
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    document.getElementById('step-confirm').classList.add('active');
    document.getElementById('payment-options').style.display = 'none';
    document.getElementById('order-confirmation').style.display = 'block';
    
    // Display order details
    document.getElementById('order-details').innerHTML = `
        <div class="order-success">
            <i class="material-icons">check_circle</i>
            <h3>Thank you for your order!</h3>
            <p>Order id ${order.id} has been placed successfully.</p>
        </div>
        <div class="order-info">
            <div class="order-info-item">
                <h4>Shipping Address</h4>
                <p>${order.shippingAddress.name}</p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                <p>Phone: ${order.shippingAddress.phone}</p>
            </div>
            <div class="order-info-item">
                <h4>Payment Method</h4>
                <p>${order.paymentMethod}</p>
            </div>
        </div>
        <button class="btn btn-primary" onclick="showPage('home-page')">Continue Shopping</button>
    `;
    
    // Show success popup
    document.getElementById('order-success-overlay').style.display = 'flex';
}

function closeOrderSuccess() {
    document.getElementById('order-success-overlay').style.display = 'none';
    showPage('home-page');
}
// Load user orders with shipping address and payment method
function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        // No orders
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <i class="material-icons">shopping_bag</i>
                <h3>No orders yet</h3>
                <p>Your order history will appear here.</p>
            </div>
        `;
    } else {
        // Populate orders
        ordersContainer.innerHTML = '';
        
        orders.forEach((order, index) => {
            const orderCard = `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Order id ${order.id}</h3>
                        <div class="order-date">${order.date}</div>
                        <div class="order-status">${order.status}</div>
                    </div>
                    <div class="order-details">
                        <div class="order-shipping-info">
                            <h4>Shipping Address</h4>
                            <p>${order.shippingAddress.name}</p>
                            <p>${order.shippingAddress.address}</p>
                            <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                            <p>Phone: ${order.shippingAddress.phone}</p>
                        </div>
                        <div class="order-payment-info">
                            <h4>Payment Method</h4>
                            <p>${order.paymentMethod}</p>
                        </div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return `
                                <div class="order-item">
                                    <img src="${product.image}" alt="${product.name}">
                                    <div class="order-item-details">
                                        <div>${product.name}</div>
                                        <div>Qty: ${item.quantity}</div>
                                        <div>$${(product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="order-total">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-secondary" onclick="trackOrder(${order.id})">Track Order</button>
                        <button class="btn btn-secondary" onclick="reviewOrder(${order.id})">Write a Review</button>
                    </div>
                </div>
            `;
            
            ordersContainer.innerHTML += orderCard;
        });
    }
}



// Update product review modal to include shipping address
function openReviewModal(productId) {
    currentReviewProductId = productId;
    currentRating = 0;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Find the order containing this product
    const order = orders.find(o => o.items.some(item => item.productId === productId));
    
    // Reset form
    document.getElementById('review-title').value = '';
    document.getElementById('review-content').value = '';
    document.querySelectorAll('.rating-star').forEach(star => {
        star.classList.remove('active');
    });
    
    
    
    
    // Set product info and shipping address
    let shippingAddressHTML = '';
    if (order && order.shippingAddress) {
        shippingAddressHTML = `
            <div class="review-shipping-address">
                <h4>Shipped To</h4>
                <p>${order.shippingAddress.name}</p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
            </div>
        `;
    }
    
    document.getElementById('review-product-info').innerHTML = `
        <div class="review-product">
            <img src="${product.image}" alt="${product.name}">
            <div class="review-product-details">
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
            </div>
        </div>
        ${shippingAddressHTML}
    `;
    
    // Show modal
    document.getElementById('product-review-modal').style.display = 'flex';
}

// Add CSS styles for the new elements
const style = document.createElement('style');
style.textContent = `
    .order-details {
        display: flex;
        justify-content: space-between;
        background-color: #F0F3F9;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
    }

    
    
    .order-shipping-info, .order-payment-info {
        flex: 1;
    }
    
    .order-shipping-info h4, .order-payment-info h4 {
        margin-top: 0;
        color: #333;
        font-size: 14px;
    }
    
    .order-shipping-info p, .order-payment-info p {
        margin: 5px 0;
        font-size: 13px;
        font-weight: 500;
        color: #67696E;
    }
    
    .review-shipping-address {
        margin-top: 15px;
        background-color: #f9f9f9;
        padding: 10px;
        border-radius: 5px;
    }
    
    .review-shipping-address h4 {
        margin-top: 0;
        color: #333;
        font-size: 14px;
    }
    
    .review-shipping-address p {
        margin: 5px 0;
        font-size: 12px;
        color: #555;
    }
    
    .review-product {
        display: flex;
        align-items: center;
    }
    
    .review-product img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 15px;
    }
    
    .review-product-details h3 {
        margin-top: 0;
    }
`;




// Review functions
function trackOrder(orderId) {
    alert('When your order is ready to be Deliverd you will see it hear.');
}

function reviewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Show review modal for the first product in the order
    const productId = order.items[0].productId;
    openReviewModal(productId);
}

function openReviewModal(productId) {
    currentReviewProductId = productId;
    currentRating = 0;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Reset form
    document.getElementById('review-title').value = '';
    document.getElementById('review-content').value = '';
    document.querySelectorAll('.rating-star').forEach(star => {
        star.classList.remove('active');
    });
    
    // Set product info
    document.getElementById('review-product-info').innerHTML = `
        <div class="review-product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
        </div>
    `;
    
    // Show modal
    document.getElementById('product-review-modal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('product-review-modal').style.display = 'none';
}

function setRating(rating) {
    currentRating = rating;
    
    // Update UI
    document.querySelectorAll('.rating-star').forEach(star => {
        if (parseInt(star.dataset.rating) <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitProductReview() {
    if (!currentReviewProductId || currentRating === 0) {
        alert('Please select a rating.');
        return;
    }
    
    const title = document.getElementById('review-title').value;
    const content = document.getElementById('review-content').value;
    
    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Create review object
    const review = {
        productId: currentReviewProductId,
        rating: currentRating,
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    };
    
    // Add to reviews
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Update UI
    loadUserReviews();
    closeReviewModal();
    
    alert('Thank you for your review!');
}

// Search function
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-results">
                <i class="material-icons">search_off</i>
                <h2>No products found</h2>
                <p>Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const favoriteClass = isFavorite ? 'active' : '';
        
        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${product.id})">
                            <i class="material-icons">${isFavorite ? 'favorite' : 'favorite_border'}</i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        productsContainer.innerHTML += productCard;
    });
}




        
        
        // Function to show the previous slide with infinite loop
        function prevSlide() {
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            // Remove active state from current slide and indicator
            allSlides[currentPosition].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentPosition--;
            
            // Enable transition
            slidesWrapper.style.transition = 'transform 1s ease-in-out';
            slidesWrapper.style.transform = `translateX(-${currentPosition * (100 / allSlides.length)}%)`;
            
            // Always trigger animation immediately for the current slide
            setTimeout(() => {
                triggerImageAnimation();
            }, 100);
            
            // Check if we've reached the first clone (backward loop)
            if (currentPosition === 0) {
                setTimeout(() => {
                    // Disable transition and jump to last real slide
                    slidesWrapper.style.transition = 'none';
                    currentPosition = slideCount;
                    currentSlide = slideCount - 1;
                    slidesWrapper.style.transform = `translateX(-${currentPosition * (100 / allSlides.length)}%)`;
                    
                    // Add active state to new slide and indicator
                    allSlides[currentPosition].classList.add('active');
                    indicators[currentSlide].classList.add('active');
                    
                    // Trigger animation again for the jumped slide
                    setTimeout(() => {
                        triggerImageAnimation();
                    }, 100);
                    
                    // Re-enable transition
                    setTimeout(() => {
                        slidesWrapper.style.transition = 'transform 1s ease-in-out';
                        isTransitioning = false;
                    }, 50);
                }, 1000);
            } else {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                // Add active state to new slide and indicator
                allSlides[currentPosition].classList.add('active');
                indicators[currentSlide].classList.add('active');
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 1000);
            }
        }
        
        // Function to trigger the fade-in-up animation
        function triggerImageAnimation() {
            const activeSlideImg = allSlides[currentPosition].querySelector('img');
            
            // Force reset by removing any existing transitions temporarily
            activeSlideImg.style.transition = 'none';
            
            // Reset the image to start state (below and invisible)
            activeSlideImg.style.transform = 'translateY(100px)';
            activeSlideImg.style.opacity = '0';
            
            
            // Force a reflow to ensure the reset takes effect
            activeSlideImg.offsetHeight;
            
            // Re-enable transitions
            activeSlideImg.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
            
            // Trigger fade-in-up animation after ensuring reset
            setTimeout(() => {
                activeSlideImg.style.transform = 'translateY(0)';
                activeSlideImg.style.opacity = '1';
            }, 700);
        }
        
        // Set up the interval for automatic slideshow
        function startInterval() {
            slideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
        
        // Reset the interval when manually changing slides
        function resetInterval() {
            clearInterval(slideInterval);
            if (!isPaused) {
                startInterval();
            }
        }
        
        // Event listeners for navigation buttons
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        
        pauseBtn.addEventListener('click', () => {
            if (isPaused) {
                startInterval();
                pauseBtn.textContent = 'Pause';
            } else {
                clearInterval(slideInterval);
                pauseBtn.textContent = 'play';
            }
            isPaused = !isPaused;
        });
        
        // Initialize the first slide animation
        triggerImageAnimation();
        
        // Start the slideshow
        startInterval();






    // Set up event delegation for dynamically created product images
    document.getElementById('products-container').addEventListener('click', function(event) {
        // Check if the clicked element is a product image
        if (event.target.tagName === 'IMG' && event.target.closest('.product-image')) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('zoomedImg');
            
            // Display the modal and set the image source
            modal.style.display = 'flex';
            modalImg.src = event.target.src;
        }
    });
    
    // Set up modal close functionality
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Close when clicking the X button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });




  // Newsletter form submission
  document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (email) {
      // Here you would normally send this to your server/API
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    }
  });

  // Cookie consent functionality
  window.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookieChoice')) {
      // Show the cookie banner after a short delay
      setTimeout(function() {
        cookieConsent.classList.add('active');
      }, 1000);
    }

    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookieChoice', 'accepted');
      cookieConsent.classList.remove('active');
    });

    rejectBtn.addEventListener('click', function() {
      localStorage.setItem('cookieChoice', 'rejected');
      cookieConsent.classList.remove('active');
    });
  });

  // Back to top functionality
  const backToTopButton = document.getElementById('backToTop');
  const backToTopBtnHeader = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 800) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  backToTopBtnHeader.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });



  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const toggleBtn = document.getElementById('toggle-sidebar');
    const toggleIcon = document.getElementById('toggle-icon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Make sure elements exist
    if (!toggleBtn || !sidebar || !overlay) {
      console.error('Sidebar elements not found. Check your IDs.');
      return;
    }

    // Toggle sidebar
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      toggleBtn.classList.toggle('active');

      // Change icon
      if (sidebar.classList.contains('active')) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-times');
      } else {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
      }
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleIcon.classList.remove('fa-times');
      toggleIcon.classList.add('fa-bars');
    });
    
    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.style.animationDelay = `${parseInt(card.style.getPropertyValue('--delay')) * 0.1}s`;
    });
  });


// Updated products array with type categorization

const products = [
  {
    id: 1,
    name: "iphone 16 pro",
    price: 999.99,
    image: "Phone/1753026625077.png",
    description: "iPhone 16 Pro: A18 chip, pro camera, titanium design, and AI-powered iOS 18.",
    type: "computing"
    },
  {
    id: 2,
    name: "Airpods Pro",
    price: 249.99,
    image: "Audio/1753028379239.png",
    description: " H2 chip, pro-level Active Noise Cancellation, Adaptive Audio.",
    type: "audio"
    },
  {
    id: 3,
    name: "xbox series x",
    price: 599.99,
    image: "game/20250528_205716.png",
    description: "12 TFLOPS GPU, 1 TB SSD, ultra-fast 4K gaming up to 120 FPS.",
    type: "gaming"
    },
  {
    id: 4,
    name: "iphone 16 black",
    price: 799.99,
    image: "Phone/1753027427804.png",
    description: " 6.1' OLED display, A18 chip, 48MP camera, USB-C port, and iOS 18.",
    type: "computing"
    },
  {
    id: 5,
    name: "PS5 slim disc",
    price: 299.99,
    image: "game/20250718_155332.png",
    description: "Advanced smartwatch with health tracking and cellular connectivity.",
    type: "gaming"
    },
  {
    id: 6,
    name: "Apple Airpods max black",
    price: 129.99,
    image: "Audio/1753028187677.png",
    description: "Compact wireless earbuds with superior sound quality.",
    type: "audio"
    },
  {
    id: 7,
    name: "Apple homepod mini white",
    price: 449.99,
    image: "Audio/1753028612230.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "audio"
    },
  {
    id: 8,
    name: "xbox series s white",
    price: 499.99,
    image: "game/20250718_162117.png",
    description: "Next-generation gaming console with stunning graphics.",
    type: "gaming"
    },
    {
    id: 9,
    name: "Sony PS5 headphones",
    price: 449.99,
    image: "Audio/1753028519662.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "audio"
    },
    {
    id: 10,
    name: "iphone 16 pro max white",
    price: 449.99,
    image: "Phone/1753027565329.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "computing"
    },
    {
    id: 11,
    name: "nintendo switch",
    price: 449.99,
    image: "game/20250718_162239.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 12,
    name: "Apple homepod min black",
    price: 449.99,
    image: "Audio/1753029309705.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "audio"
    },
    {
    id: 13,
    name: "PS5 controller Edge",
    price: 449.99,
    image: "game/20250718_001520.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 14,
    name: "iphone 16 white",
    price: 449.99,
    image: "Phone/1753027681103.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "computing"
    },
    {
    id: 15,
    name: "nintendo switch gray",
    price: 449.99,
    image: "game/20250718_162439.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 16,
    name: "xbox series x controller",
    price: 449.99,
    image: "game/20250718_162134.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 17,
    name: "Apple Airpods max sky blue",
    price: 449.99,
    image: "Audio/1753028135690.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "audio"
    },
    {
    id: 18,
    name: "Apple Airpods Pro 2",
    price: 449.99,
    image: "Audio/1753028288499.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "audio"
    },
    {
    id: 19,
    name: "PS5 Pro",
    price: 449.99,
    image: "game/20250718_162102.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 20,
    name: "iphone 16 e white",
    price: 449.99,
    image: "Phone/1753027885549.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "computing"
    },
    {
    id: 21,
    name: "iPhone 17 Air black",
    price: 449.99,
    image: "Phone/1757780182388.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "mobile"
    },
    {
    id: 22,
    name: "iPhone 17",
    price: 449.99,
    image: "Phone/1757780234471.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "mobile"
    },
    {
    id: 23,
    name: "nintendo switch 2",
    price: 449.99,
    image: "game/20250718_000616.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "gaming"
    },
    {
    id: 24,
    name: "iPhone 17 pro",
    price: 449.99,
    image: "https://via.placeholder.com/250x200?text=Camera",
    description: "High-resolution digital camera with 4K video recording.",
    type: "mobile"
    },
    {
    id: 25,
    name: "nintendo switch 2",
    price: 449.99,
    image: "game/1752790186838.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "mobile"
    },
    {
    id: 26,
    name: "iPhone 17 pro",
    price: 449.99,
    image: "Phone/1757780096743.png",
    description: "High-resolution digital camera with 4K video recording.",
    type: "mobile"
    }
];




// Initialize favorites in local storage if not exists
if (!localStorage.getItem('favorites')) {
    localStorage.setItem('favorites', JSON.stringify([]));
}






// Add filter HTML before the products container
const filterHTML = `
<div class="filter-container">
    
    <!-- Filter Group 1: Price Range -->
    <div class="filter-group">
        <div class="filter-title">Price Range</div>
        <div class="filter-options" id="price-filters">
            <div class="filter-option" data-price="0-100">Under $100</div>
            <div class="filter-option" data-price="100-500">$100 - $500</div>
            <div class="filter-option" data-price="500-1000">$500 - $1000</div>
            <div class="filter-option" data-price="1000+">$1000+</div>
        </div>
    </div>
    
    <!-- Filter Group 2: Product Type -->
    <div class="filter-group2">
        <div class="filter-title">Product Type</div>
        <div class="filter-options" id="type-filters">
            <div class="filter-option" data-type="audio"><p>Audio</p></div>
            <div class="filter-option" data-type="computing"><p>mobile</p></div>
            <div class="filter-option" data-type="gaming"><p>Gaming</p></div>
            <div class="filter-option" data-type="mobile"><p>New</p></div>
        </div>
    </div>
    
    <!-- Filter Group 3: Favorites -->
    <div class="filter-group">
        <div class="filter-title">Other</div>
        <div class="filter-options" id="other-filters">
        
            <button id="reset-filters" class="filter-reset">all producs</button>
        
            <div class="filter-option" data-other="favorites">Favorites Only</div>
            
        </div>
        
    </div>
    
    
</div>
`;





// Insert filter HTML before products container
const productsContainer = document.getElementById('products-container');
productsContainer.insertAdjacentHTML('beforebegin', filterHTML);

// Add CSS styles for the filters
const filterStyles = document.createElement('style');
filterStyles.innerHTML = `
.filter-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 0px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border: 0px solid red;
}
.filter-group {
    margin-bottom: 5px;
}
.filter-group2 {
    margin-bottom: 5px;
}

.filter-group2 p {
    font-weight: 600;
    font-size: 13px;
}
.filter-title {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
}
.filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.filter-option {
    background-color: #E5E7E9;
    padding: 3px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;
}
.filter-option.active {
    background-color: #ffec68;
    color: black;
}
.filter-reset {
    background-color: #7A7E87;
    color: white;
    padding: 3px 8px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 0px;
}
.no-products {
    text-align: center;
    padding: 30px;
    margin: auto;
    background-color: white;
    border-radius: 8px;
    grid-column: 1 / -1;
}
.favorite-active {
    color: #FF5252;
}
`;


document.head.appendChild(filterStyles);



// Active filters state
const activeFilters = {
    price: null,
    type: null,
    other: null
};

// Function to render products based on filters
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    // Get current favorites
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    
    // Filter products
    let filteredProducts = products.filter(product => {
        // Apply price filter
        if (activeFilters.price) {
            const [min, max] = activeFilters.price.split('-');
            if (max === '+') {
                if (product.price < parseInt(min)) return false;
            } else {
                if (product.price < parseInt(min) || product.price > parseInt(max)) return false;
            }
        }
        
        // Apply type filter
        if (activeFilters.type && product.type !== activeFilters.type) {
            return false;
        }
        
        // Apply favorites filter
        if (activeFilters.other === 'favorites' && !favorites.includes(product.id)) {
            return false;
        }
        
        return true;
    });
    
    // Display products or show "No products found" message
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products match your filters</div>';
        return;
    }
    
    // Render each product
    filteredProducts.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const favoriteClass = isFavorite ? 'favorite-active' : '';
        
        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${product.id})">
                            <i class="material-icons">${isFavorite ? 'favorite' : 'favorite_border'}</i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        productsContainer.innerHTML += productCard;
    });
}





// Set up filter click events
document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
        const filterType = this.parentElement.id.split('-')[0]; // price, type, other
        const filterValue = this.dataset[filterType];
        
        // Toggle active state
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            activeFilters[filterType] = null;
        } else {
            // Remove active class from other options in the same group
            this.parentElement.querySelectorAll('.filter-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            this.classList.add('active');
            activeFilters[filterType] = filterValue;
        }
        
        renderProducts();
    });
});

// Reset filters
document.getElementById('reset-filters').addEventListener('click', function() {
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
    });
    
    activeFilters.price = null;
    activeFilters.type = null;
    activeFilters.other = null;
    
    renderProducts();
});

// Initial render
renderProducts();
  







// JavaScript to hide preloader once page is loaded


        window.addEventListener('load', function() {
            // Wait for everything to load
            setTimeout(function() {
                // Get the preloader element
                const preloader = document.getElementById('preloader');
                
                // Add opacity transition
                preloader.style.opacity = '0';
                
                // Remove preloader after transition
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 2000); // Delay of 1.5 seconds for demo purposes - you can adjust or remove this
        });
    
    
    
    
    
        // Get references to elements
        const aboutAppTrigger = document.getElementById('aboutAppTrigger');
        const aboutModal = document.getElementById('aboutModal');
        const closeModal = document.getElementById('closeModal');
        
        // Open modal when footer column is clicked
        aboutAppTrigger.addEventListener('click', function() {
            aboutModal.classList.add('modal-active');
        });
        
        // Close modal when close button is clicked
        closeModal.addEventListener('click', function() {
            aboutModal.classList.remove('modal-active');
        });
        
        // Close modal when clicking outside the modal content
        aboutModal.addEventListener('click', function(event) {
            if (event.target === aboutModal) {
                aboutModal.classList.remove('modal-active');
            }
        });
  
  
  
  
        // Function to show the cookie consent banner after 5 seconds
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.getElementById('cookieConsent').classList.add('active');
            }, 5000); // 5000 milliseconds = 5 seconds
        });

        // Cookie consent functions
        document.getElementById('acceptCookies').addEventListener('click', function() {
            console.log('Cookies accepted');
            hideCookieConsent();
            // Here you would typically set a cookie to remember the user's choice
        });

        document.getElementById('rejectCookies').addEventListener('click', function() {
            console.log('Cookies rejected');
            hideCookieConsent();
            // Here you would typically set a cookie for essential cookies only
        });

        function hideCookieConsent() {
            document.getElementById('cookieConsent').classList.remove('active');
        }
  
  
  
      const h1Elements = document.querySelectorAll('h1');

function checkVisibility() {
  h1Elements.forEach(h1Element => {
    const elementTop = h1Element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.8) {
      h1Element.classList.add('visible');
    } else if (!h1Element.classList.contains('visible') && elementTop > windowHeight) {
      // Optionally, you can remove the 'visible' class if the element scrolls back out of view
      // h1Element.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);





    const imgElements = document.querySelectorAll('img');

function checkVisibility() {
  imgElements.forEach(imgElement => {
    const elementTop = imgElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.8) {
      imgElement.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);
