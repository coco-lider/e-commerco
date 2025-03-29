document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count badge
    updateCartCount();
    
    // Check if we're on the product page
    if (document.querySelector('.product-detail')) {
        initProductPage();
    }
    
    // Check if we're on the cart page
    if (document.querySelector('.cart-section')) {
        renderCart();
        initCartPage();
    }
    
    // Function to initialize product page functionality
    function initProductPage() {
        // Quantity selector
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
            });
        }
        
        // Thumbnail image click handler
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('.main-image img');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image (in a real app, you would change the src)
                // For this demo, we're just simulating the change
                console.log('Thumbnail clicked, would change main image');
            });
        });
        
        // Add to cart button handlers
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart-small');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = parseFloat(this.getAttribute('data-price'));
                const productImage = this.getAttribute('data-image');
                const productUnit = this.getAttribute('data-unit') || 'шт.';
                
                // Get old price if it exists
                const productOldPrice = this.getAttribute('data-oldprice') ? 
                    parseFloat(this.getAttribute('data-oldprice')) : null;
                
                // Get quantity (from input if it's the main product, or 1 for small buttons)
                let quantity = 1;
                if (this.classList.contains('add-to-cart-btn') && quantityInput) {
                    quantity = parseInt(quantityInput.value);
                }
                
                // Check if product already in cart
                const existingItemIndex = cart.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if product already in cart
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new product to cart
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        oldPrice: productOldPrice,
                        image: productImage,
                        quantity: quantity,
                        unit: productUnit,
                        selected: true,
                        inStock: true
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count badge
                updateCartCount();
                
                // Show confirmation
                alert(`Товар "${productName}" добавлен в корзину!`);
            });
        });
        
        // Favorite button handlers
        const favoriteButtons = document.querySelectorAll('.add-favorite, .favorite-btn');
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Prevent the click from bubbling up
                e.stopPropagation();
                
                // Toggle heart icon
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    alert('Товар добавлен в избранное!');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    alert('Товар удален из избранного!');
                }
            });
        });
        
        // Share button handler
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e) {
                // Prevent the click from bubbling up
                e.stopPropagation();
                
                // In a real app, this would open a share dialog
                alert('Поделиться товаром');
            });
        }
    }
    
    // Function to initialize cart page functionality
    function initCartPage() {
        // Select all checkbox handler
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                
                // Update all items in cart
                cart = cart.map(item => ({
                    ...item,
                    selected: isChecked
                }));
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
            });
        }
        
        // Delete selected button handler
        const deleteSelectedBtn = document.querySelector('.delete-selected');
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                // Filter out selected items
                cart = cart.filter(item => !item.selected);
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
                updateCartCount();
            });
        }
        
        // Use bonus checkbox handler
        const useBonusCheckbox = document.getElementById('useBonus');
        if (useBonusCheckbox) {
            useBonusCheckbox.addEventListener('change', function() {
                // Re-calculate totals
                updateCartTotals();
            });
        }
        
        // Checkout button handler
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                alert('Переход к оформлению заказа');
            });
        }
    }
    
    // Function to update cart count badge
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountBadges = document.querySelectorAll('.cart-count, .cart-badge');
        
        cartCountBadges.forEach(badge => {
            badge.textContent = cartCount;
        });
    }
    
    // Function to render cart items
    function renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
            updateCartTotals();
            return;
        }
        
        // Add one out of stock item for demonstration (only if not already set)
        let hasOutOfStock = cart.some(item => !item.inStock);
        if (!hasOutOfStock && cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            if (lastItem) {
                lastItem.inStock = false;
            }
        }
        
        // Render each cart item
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = `cart-item ${!item.inStock ? 'out-of-stock' : ''}`;
            
            const itemTotal = item.price * item.quantity;
            const oldItemTotal = item.oldPrice ? item.oldPrice * item.quantity : null;
            
            cartItemElement.innerHTML = `
                <input type="checkbox" class="cart-item-checkbox" ${item.selected ? 'checked' : ''} data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} ₽ <span class="cart-item-unit">за ${item.unit}</span></div>
                    ${!item.inStock ? '<div class="out-of-stock-label">Нет в наличии</div>' : ''}
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}" ${!item.inStock ? 'disabled' : ''}>-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}" ${!item.inStock ? 'disabled' : ''}>+</button>
                </div>
                <div class="cart-item-total">
                    ${itemTotal.toFixed(2)} ₽
                    ${oldItemTotal ? `<div class="old-price">${oldItemTotal.toFixed(2)} ₽</div>` : ''}
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" data-index="${index}"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to cart item elements
        addCartItemEventListeners();
        
        // Update cart totals
        updateCartTotals();
        
        // Update select all checkbox state
        updateSelectAllCheckbox();
    }
    
    // Function to add event listeners to cart item elements
    function addCartItemEventListeners() {
        // Checkbox change handler
        const checkboxes = document.querySelectorAll('.cart-item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].selected = this.checked;
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update select all checkbox state
                updateSelectAllCheckbox();
                
                // Update cart totals
                updateCartTotals();
            });
        });
        
        // Quantity buttons handlers
        const minusButtons = document.querySelectorAll('.cart-item .quantity-btn.minus');
        const plusButtons = document.querySelectorAll('.cart-item .quantity-btn.plus');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    
                    // Save cart to localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Re-render cart
                    renderCart();
                    updateCartCount();
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
                updateCartCount();
            });
        });
        
        // Remove button handler
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
                updateCartCount();
            });
        });
    }
    
    // Function to update select all checkbox state
    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        if (!selectAllCheckbox) return;
        
        const allSelected = cart.length > 0 && cart.every(item => item.selected);
        selectAllCheckbox.checked = allSelected;
    }
    
    // Function to update cart totals
    function updateCartTotals() {
        const itemsCountElement = document.getElementById('itemsCount');
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const totalElement = document.getElementById('total');
        const useBonusCheckbox = document.getElementById('useBonus');
        
        if (!itemsCountElement || !subtotalElement || !discountElement || !totalElement) return;
        
        // Calculate totals
        const selectedItems = cart.filter(item => item.selected && item.inStock);
        const totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0);
        
        let subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        let totalDiscount = selectedItems.reduce((total, item) => {
            if (item.oldPrice) {
                return total + ((item.oldPrice - item.price) * item.quantity);
            }
            return total;
        }, 0);
        
        // Apply bonus if checkbox is checked
        const bonusDiscount = useBonusCheckbox && useBonusCheckbox.checked ? 200 : 0;
        totalDiscount += bonusDiscount;
        
        const totalPrice = Math.max(0, subtotal - bonusDiscount);
        
        // Update elements
        itemsCountElement.textContent = `${totalItems} товара`;
        subtotalElement.textContent = `${subtotal.toFixed(2)} ₽`;
        discountElement.textContent = `-${totalDiscount.toFixed(2)} ₽`;
        totalElement.textContent = `${totalPrice.toFixed(2)} ₽`;
    }
});