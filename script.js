document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 🚦 АНХНЫ ХУУДАС ШАЛГАХ ЛОГИК (NEW)
    // =================================================================

    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentPage = window.location.pathname.split('/').pop();

    // Хэрэв бид index.html хуудсан дээр байх бөгөөд хэрэглэгч нэвтрээгүй бол signin.html руу шилжүүлнэ.
    if (currentPage === 'index.html' || currentPage === '') {
        if (!loggedInUser) {
            // signin.html руу шилжүүлэх
            window.location.href = 'signin.html';
            return; // Цаашдын кодыг гүйцэтгэхгүй
        }
    } 
    // Хэрэв бид signin.html хуудсан дээр байх бөгөөд хэрэглэгч аль хэдийн нэвтэрсэн бол index.html руу шилжүүлнэ.
    else if (currentPage === 'signin.html') {
        if (loggedInUser) {
            window.location.href = 'index.html';
            return; // Цаашдын кодыг гүйцэтгэхгүй
        }
    }

    // =================================================================
    // 🧭 HEADER NAVIGATION & SCROLL LOGIC
    // =================================================================

    let searchBtn = document.querySelector('#search-btn');
    let searchForm = document.querySelector('.header .search-form');
    let menuBtn = document.querySelector('#menu-btn');
    let navbar = document.querySelector('.header .navbar');
    
    if (searchBtn && menuBtn && searchForm && navbar) {
        searchBtn.onclick = () =>{
            searchBtn.classList.toggle('fa-times');
            searchForm.classList.toggle('active');
            menuBtn.classList.remove('fa-times');
            navbar.classList.remove('active');
        };

        menuBtn.onclick = () =>{
            menuBtn.classList.toggle('fa-times');
            navbar.classList.toggle('active');
            searchBtn.classList.remove('fa-times');
            searchForm.classList.remove('active');
        };

        window.onscroll = () =>{
            searchBtn.classList.remove('fa-times');
            searchForm.classList.remove('active');
            menuBtn.classList.remove('fa-times');
            navbar.classList.remove('active');

            if(window.scrollY > 650){
                document.querySelector('.header')?.classList.add('active');
            }else{
                document.querySelector('.header')?.classList.remove('active');
            };
            
            // Parallax effect 
            let value = window.scrollY / 10;
            if (document.querySelector('.home .mountain')) {
                document.querySelector('.home .mountain').style.bottom = `${-value}%`;
                document.querySelector('.home .content').style.bottom = `${value}%`;
                document.querySelector('.home .moon').style.marginTop = `${-value}%`;
                document.querySelector('.home .cloud-1').style.right = `${-value}%`;
                document.querySelector('.home .cloud-2').style.left = `${-value}%`;
            }
        };
    }
    
    // =================================================================
    // 🛍️ SHOPPING CART LOGIC
    // =================================================================

    // Get all necessary DOM elements
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceSpan = document.getElementById('cart-total-price');

    // Initialize the shopping cart data array
    let cart = [];

    // Helper function to update the cart display (count, list, and total)
    function updateCartDisplay() {
        if (!cartItemCountSpan || !cartItemsContainer || !cartTotalPriceSpan) return; 

        const totalItems = cart.length;
        cartItemCountSpan.textContent = totalItems;
        cartItemCountSpan.style.display = totalItems > 0 ? 'block' : 'none';

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (totalItems === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Таны сагс хоосон байна.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemPrice = parseFloat(item.price);
                if (!isNaN(itemPrice)) {
                     totalPrice += itemPrice;
                }

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">${itemPrice.toLocaleString('en-US')}₮</p>
                    </div>
                    <i class="fas fa-trash remove-item-btn" data-index="${index}" style="color: red; cursor: pointer;"></i>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        cartTotalPriceSpan.textContent = totalPrice.toLocaleString('en-US') + '₮';
        
        // Re-attach event listeners for remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const itemIndex = parseInt(e.currentTarget.dataset.index);
                removeItemFromCart(itemIndex);
            });
        });
    }

    // Function to add a product to the cart
    function addItemToCart(product) {
        cart.push(product);
        updateCartDisplay();
    }

    // Function to remove an item from the cart by its array index
    function removeItemFromCart(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            updateCartDisplay(); 
        }
    }

    // --- Event Listeners for Cart ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productBox = e.currentTarget.closest('.product-box');
            if (productBox) {
                 const product = {
                    name: productBox.dataset.name,
                    price: productBox.dataset.price,
                    image: productBox.dataset.image
                };
                addItemToCart(product);
            }
        });
    });

    if (cartIcon && cartOverlay && closeCartBtn) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartDisplay(); 
            cartOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        });

        closeCartBtn.addEventListener('click', function() {
            cartOverlay.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        });

        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) {
                cartOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Initialize the cart display if we are on the index page
    if (currentPage === 'index.html' && loggedInUser) { 
         updateCartDisplay();
    }


    // =================================================================
    // 🔐 SIGN-IN / AUTHENTICATION LOGIC 
    // =================================================================

    const signInForm = document.getElementById('signInForm');
    
    // --- Signin Page Logic (signin.html) ---
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();
            const loginMessage = document.getElementById('login-message');

            const staticUsername = 'bura';
            const staticPassword = 'bura123';

            if (usernameInput === staticUsername && passwordInput === staticPassword) {
             
                localStorage.setItem('loggedInUser', staticUsername);
                loginMessage.textContent = 'Нэвтрэлт амжилттай. Та үндсэн хуудас руу шилжиж байна...';
                loginMessage.style.color = 'lime';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            } else {
               
                loginMessage.textContent = 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.';
                loginMessage.style.color = 'red';
            }
        });
    }

    // --- Index Page User Display & Logout Logic (index.html) ---
    const userAuthLink = document.getElementById('user-auth-link');
    const usernameDisplaySpan = document.getElementById('username-display');

    if (userAuthLink && usernameDisplaySpan) {
        if (loggedInUser) {
            // Logged In: Show username and handle logout
            usernameDisplaySpan.textContent = loggedInUser;
            usernameDisplaySpan.style.display = 'inline';
            userAuthLink.title = 'Гарах'; 
            userAuthLink.href = '#'; 
            
            userAuthLink.addEventListener('click', function(e) {
                if (userAuthLink.href.endsWith('#')) { 
                    e.preventDefault();
                    if (confirm(`Та ${loggedInUser} нэрээрээ гарахдаа итгэлтэй байна уу?`)) {
                        localStorage.removeItem('loggedInUser');
                        window.location.reload(); // Reload to update the header display
                    }
                }
            });

        } else {
            // Not Logged In (This case should be covered by the initial redirect, but for fallback):
            usernameDisplaySpan.textContent = 'Нэвтрэх';
            usernameDisplaySpan.style.display = 'inline';
            userAuthLink.href = 'signin.html';
            userAuthLink.title = 'Нэвтрэх';
        }
    }

});