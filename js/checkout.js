// checkout.js — Fixed version to persist loggedInUser and update orders

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkoutForm = document.getElementById("checkoutForm");
  const cartContainer = document.getElementById("checkout-items");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryDelivery = document.getElementById("summary-delivery");
  const summaryTotal = document.getElementById("summary-total");

  // Redirect if no cart
  if (!cart.length) {
    if (cartContainer) cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (checkoutForm) checkoutForm.style.display = "none";
    return;
  }

  // Calculate subtotal, delivery, total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 6000 ? 0 : 83;
  const total = subtotal + deliveryFee;

  // Store delivery fee for reference
  localStorage.setItem("deliveryFee", deliveryFee);

  // Display cart items on checkout page
  if (cartContainer) {
    cartContainer.innerHTML = cart
      .map(
        item => `
        <div class="checkout-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>Qty: ${item.qty}</p>
            <p>Price: R${item.price.toFixed(2)}</p>
          </div>
          <p class="item-total">R${(item.price * item.qty).toFixed(2)}</p>
        </div>
      `
      )
      .join("");
  }

  // Update totals
  if (summarySubtotal) summarySubtotal.textContent = "R" + subtotal.toFixed(2);
  if (summaryDelivery)
    summaryDelivery.textContent =
      deliveryFee === 0 ? "Free" : "R" + deliveryFee.toFixed(2);
  if (summaryTotal) summaryTotal.textContent = "R" + total.toFixed(2);

  // Checkout form submission
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
      e.preventDefault();

      const address = document.getElementById("address").value.trim();
      const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
      )?.value;

      if (!address || !paymentMethod) {
        alert("Please fill in all required fields.");
        return;
      }

      // Create order object
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: cart,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        address,
        paymentMethod,
        status: "Processing"
      };

      // Update users array and loggedInUser
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!currentUser) {
        alert("Error: No logged-in user.");
        return;
      }

      // Add order to user
      currentUser.orders = currentUser.orders || [];
      currentUser.orders.push(newOrder);

      // Add address to addresses if not already present
      currentUser.addresses = currentUser.addresses || [];
      if (!currentUser.addresses.includes(address)) {
        currentUser.addresses.push(address);
      }

      // Persist changes
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) users[userIndex] = currentUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

      // Clear cart
      localStorage.removeItem("cart");
      localStorage.removeItem("deliveryFee");

      // Confirmation
      alert("✅ Your order has been placed successfully!");

      // Redirect to account page dashboard
      window.location.href = "account.html?view=dashboard";
    });
  }

  // Show delivery message
  const deliveryNotice = document.getElementById("delivery-notice");
  if (deliveryNotice) {
    if (subtotal >= 6000) {
      deliveryNotice.textContent = "🎉 You qualify for free delivery!";
      deliveryNotice.style.color = "green";
    } else {
      const diff = (6000 - subtotal).toFixed(2);
      deliveryNotice.textContent = `Spend R${diff} more for free delivery!`;
      deliveryNotice.style.color = "#555";
    }
  }
});
