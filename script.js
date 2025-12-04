let searchBtn = document.querySelector('#search-btn');
let searchForm = document.querySelector('.header .search-form');

searchBtn.onclick = () =>{
   searchBtn.classList.toggle('fa-times');
   searchForm.classList.toggle('active');
   menuBtn.classList.remove('fa-times');
   navbar.classList.remove('active');
};

let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');

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
      document.querySelector('.header').classList.add('active');
   }else{
      document.querySelector('.header').classList.remove('active');
   };

   let value = window.scrollY / 10;
   document.querySelector('.home .mountain').style.bottom = `${-value}%`;
   document.querySelector('.home .content').style.bottom = `${value}%`;
   document.querySelector('.home .moon').style.marginTop = `${-value}%`;
   document.querySelector('.home .cloud-1').style.right = `${-value}%`;
   document.querySelector('.home .cloud-2').style.left = `${-value}%`;
};
// Initialization of AOS
AOS.init({
    duration: 800,
});

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
    // 1. Update the item count in the header
    const totalItems = cart.length;
    cartItemCountSpan.textContent = totalItems;
    cartItemCountSpan.style.display = totalItems > 0 ? 'block' : 'none';

    // 2. Clear the container and recalculate total price
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    if (totalItems === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Таны сагс хоосон байна.</p>';
    } else {
        // 3. Render each item in the cart
        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price);
            totalPrice += itemPrice;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            
            // Use index for a unique identifier for removal
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

    // 4. Update the total price
    cartTotalPriceSpan.textContent = totalPrice.toLocaleString('en-US') + '₮';
    
    // 5. Re-attach event listeners for remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the index of the item to remove
            const itemIndex = parseInt(e.currentTarget.dataset.index);
            removeItemFromCart(itemIndex);
        });
    });
}

// Function to add a product to the cart
function addItemToCart(product) {
    cart.push(product);
    updateCartDisplay();
    // Optional: alert(`"${product.name}" таны сагсанд нэмэгдлээ.`);
}

// Function to remove an item from the cart by its array index
function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        // We must call updateCartDisplay to re-render the list and re-attach listeners
        updateCartDisplay(); 
    }
}


// --- Event Listeners ---

// 1. Add item to cart button handler
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Traverse up to find the main product container
        const productBox = e.currentTarget.closest('.product-box');
        
        const product = {
            name: productBox.dataset.name,
            price: productBox.dataset.price,
            image: productBox.dataset.image
        };
        
        addItemToCart(product);
    });
});

// 2. Open cart overlay when header cart icon is clicked
cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    updateCartDisplay(); // Refresh the cart content just before opening
    cartOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// 3. Close cart overlay when 'X' button is clicked
closeCartBtn.addEventListener('click', function() {
    cartOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// 4. Close cart overlay when clicking outside the cart area
cartOverlay.addEventListener('click', function(e) {
    if (e.target === cartOverlay) {
        cartOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Initialize the cart display on load 
document.addEventListener('DOMContentLoaded', updateCartDisplay);