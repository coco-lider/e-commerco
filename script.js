document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));

            this.classList.add('active');

            console.log('Thumbnail clicked, would change main image');
        });
    });
    
    // Add to cart button handler
    const addToCartBtn = document.querySelector('.cart-btn');
    addToCartBtn.addEventListener('click', function() {
        alert('Товар добавлен в корзину!');
    });
    
    // Small add to cart buttons
    const smallCartBtns = document.querySelectorAll('.add-to-cart-small');
    smallCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent.trim();
            
            alert(`Товар "${productTitle}" добавлен в корзину!`);
        });
    });
    
    // Favorite button handlers
    const favoriteButtons = document.querySelectorAll('.add-favorite, .favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();

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
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        alert('Поделиться товаром');
    });
    
    // Simulate discount countdown for promotional items
    const discountBadges = document.querySelectorAll('.discount-badge');
    if (discountBadges.length > 0) {
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 24));

        setInterval(function() {
            const now = new Date();
            const diff = endTime - now;
            
            if (diff <= 0) {
                discountBadges.forEach(badge => {
                    badge.textContent = "Акция завершена";
                });
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                if (discountBadges[0]) {
                    discountBadges[0].setAttribute('title', `Осталось: ${hours}ч ${minutes}м`);
                }
            }
        }, 60000);
    }
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('button')) {
                return;
            }

            const clickedCard = this;
            const clickedTitle = clickedCard.querySelector('.product-title').textContent.trim();
            const clickedPrice = clickedCard.querySelector('.price').textContent.trim();
            const clickedImage = clickedCard.querySelector('.product-image img').getAttribute('src');
            const clickedRating = clickedCard.querySelector('.stars').innerHTML;

            let clickedOldPrice = clickedCard.querySelector('.old-price');
            clickedOldPrice = clickedOldPrice ? clickedOldPrice.textContent.trim() : '';

            let clickedDiscount = clickedCard.querySelector('.discount-badge');
            clickedDiscount = clickedDiscount ? clickedDiscount.outerHTML : '';

            const mainTitle = document.querySelector('.product-info h1').textContent.trim();
            const mainPrice = document.querySelector('.product-info .current-price').textContent.trim();
            const mainImage = document.querySelector('.main-image img').getAttribute('src');
            const mainRating = document.querySelector('.product-info .stars').innerHTML;

            let mainOldPrice = document.querySelector('.product-info .old-price');
            mainOldPrice = mainOldPrice && mainOldPrice.style.display !== 'none' ? mainOldPrice.textContent.trim() : '';

            let clickedDetails = '';
            if (clickedTitle.toLowerCase().includes('масло')) {
                clickedDetails = `
                    <tr><td>Страна производства</td><td>Россия</td></tr>
                    <tr><td>Бренд</td><td>ПРОСТОКВАШИНО</td></tr>
                    <tr><td>Вес</td><td>180 г</td></tr>
                    <tr><td>Жирность</td><td>82%</td></tr>
                `;
            } else if (clickedTitle.toLowerCase().includes('сосиски')) {
                clickedDetails = `
                    <tr><td>Страна производства</td><td>Россия</td></tr>
                    <tr><td>Бренд</td><td>${clickedTitle.includes('МЯСНАЯ ИСТОРИЯ') ? 'МЯСНАЯ ИСТОРИЯ' : 
                          clickedTitle.includes('МИРАТОРГ') ? 'МИРАТОРГ' : 'КПК "ЭКО"'}</td></tr>
                    <tr><td>Вес</td><td>${clickedTitle.includes('450 г') ? '450 г' : 
                          clickedTitle.includes('400 г') ? '400 г' : '600 г'}</td></tr>
                    <tr><td>Тип</td><td>Сосиски</td></tr>
                    <tr><td>Состав</td><td>Свинина, говядина, специи</td></tr>
                `;
            } else if (clickedTitle.toLowerCase().includes('колбаса')) {
                clickedDetails = `
                    <tr><td>Страна производства</td><td>Россия</td></tr>
                    <tr><td>Бренд</td><td>КПК "ЭКО"</td></tr>
                    <tr><td>Вес</td><td>500 г</td></tr>
                    <tr><td>Тип</td><td>Вареная колбаса</td></tr>
                    <tr><td>Сорт</td><td>Высший</td></tr>
                `;
            } else if (clickedTitle.toLowerCase().includes('гуляш')) {
                clickedDetails = `
                    <tr><td>Страна производства</td><td>Россия</td></tr>
                    <tr><td>Категория</td><td>Охлажденное мясо</td></tr>
                    <tr><td>Вес</td><td>500 г</td></tr>
                    <tr><td>Тип</td><td>Свинина</td></tr>
                    <tr><td>Нарезка</td><td>Гуляш</td></tr>
                `;
            }
            
            // 4. Update the main product container with clicked product details
            const mainProductContainer = document.querySelector('.product-container');
            mainProductContainer.innerHTML = `
                <div class="product-gallery">
                    <div class="thumbnail-list">
                        <div class="thumbnail active">
                            <img src="${clickedImage}" alt="${clickedTitle}">
                        </div>
                        <div class="thumbnail">
                            <img src="${clickedImage}" alt="${clickedTitle}">
                        </div>
                        <div class="thumbnail">
                            <img src="${clickedImage}" alt="${clickedTitle}">
                        </div>
                        <div class="thumbnail">
                            <img src="${clickedImage}" alt="${clickedTitle}">
                        </div>
                        <div class="thumbnail">
                            <img src="${clickedImage}" alt="${clickedTitle}">
                        </div>
                    </div>
                    <div class="main-image">
                        <img src="${clickedImage}" alt="${clickedTitle}">
                    </div>
                </div>

                <div class="product-info">
                    <h1>${clickedTitle}</h1>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${clickedRating}
                        </div>
                        <span class="reviews-count">5 отзывов</span>
                        <button class="share-btn"><i class="fas fa-share-alt"></i></button>
                        <button class="favorite-btn"><i class="far fa-heart"></i></button>
                    </div>

                    <div class="product-price-container">
                        ${clickedOldPrice ? `<div class="old-price">${clickedOldPrice}</div>` : ''}
                        <div class="current-price">${clickedPrice}</div>
                    </div>

                    <div class="add-to-cart">
                        <button class="cart-btn">В корзину</button>
                    </div>

                    <div class="product-details">
                        <table>
                            ${clickedDetails}
                        </table>
                    </div>
                </div>
            `;
            
            // 5. Update the clicked product card with main product details
            clickedCard.innerHTML = `
                <div class="product-image">
                    <img src="${mainImage}" alt="${mainTitle}">
                    ${mainOldPrice ? '<div class="discount-badge">-30%</div>' : ''}
                    <button class="add-favorite"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-price">
                    ${mainOldPrice ? `<span class="old-price">${mainOldPrice}</span>` : ''}
                    <span class="price">${mainPrice}</span>
                </div>
                <div class="product-title">
                    ${mainTitle}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${mainRating}
                    </div>
                </div>
                <button class="add-to-cart-small">В корзину</button>
            `;
            
            // 6. Reattach event listeners
            attachEventListeners();
            
            // 7. Add to recently viewed products
            addToViewedProducts(clickedTitle);
            
            // 8. Scroll to top of the page to show the product
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    function attachEventListeners() {
        const newThumbnails = document.querySelectorAll('.thumbnail');
        newThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                newThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Add to cart button
        const newAddToCartBtn = document.querySelector('.cart-btn');
        if (newAddToCartBtn) {
            newAddToCartBtn.addEventListener('click', function() {
                alert('Товар добавлен в корзину!');
            });
        }
        
        // Small add to cart buttons
        const newSmallCartBtns = document.querySelectorAll('.add-to-cart-small');
        newSmallCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent.trim();
                alert(`Товар "${productTitle}" добавлен в корзину!`);
            });
        });
        
        // Favorite buttons
        const newFavoriteButtons = document.querySelectorAll('.add-favorite, .favorite-btn');
        newFavoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
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
        
        // Share button
        const newShareBtn = document.querySelector('.share-btn');
        if (newShareBtn) {
            newShareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                alert('Поделиться товаром');
            });
        }
    }
    
    // Function to add products to recently viewed list
    const viewedProducts = [];
    function addToViewedProducts(title) {
        // Add to viewed products if not already there
        if (!viewedProducts.includes(title)) {
            viewedProducts.push(title);
            console.log('Recently viewed products:', viewedProducts);
            
            // In a real app, you would save this to localStorage
            localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
        }
    }
    
    // Load previously viewed products from localStorage
    try {
        const savedProducts = JSON.parse(localStorage.getItem('viewedProducts'));
        if (savedProducts && Array.isArray(savedProducts)) {
            savedProducts.forEach(product => {
                if (!viewedProducts.includes(product)) {
                    viewedProducts.push(product);
                }
            });
            console.log('Loaded viewed products:', viewedProducts);
        }
    } catch (e) {
        console.error('Error loading viewed products:', e);
    }
});