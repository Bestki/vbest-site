// --- CART SYSTEM ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, image) {
  let cart = getCart();
  cart.push({ name, price, image });
  saveCart(cart);
  alert(name + " added to cart!");
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCart();
}

function loadCart() {
  let cart = getCart();
  let container = document.getElementById("cart-container");
  let total = 0;

  if (container) {
    container.innerHTML = "";

    cart.forEach((item, index) => {
      let priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      total += priceNum;

      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-details">
            <h3>${item.name}</h3>
            <p>${item.price}</p>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    });

    document.getElementById("total").textContent = "Total: ₦" + total.toLocaleString();
  }
}

function checkout() {
  let cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // For now, simple alert (later connect to Paystack)
  alert("Proceeding to Checkout with " + cart.length + " item(s).");

  // Example: send to Paystack or WhatsApp summary
  // window.location.href = "checkout.html";
}

// Auto-load cart when cart.html is opened
if (window.location.pathname.includes("cart.html")) {
  loadCart();
}