document.addEventListener("DOMContentLoaded", () => {
  const cartKey = "cart";
  const cartTableBody = document.getElementById("cartItems");
  const totalAmountEl = document.getElementById("totalAmount");

  if (!cartTableBody || !totalAmountEl) return;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function renderCart() {
    const cart = getCart();
    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
      cartTableBody.innerHTML =
        `<tr><td colspan="5">Your cart is empty</td></tr>`;
      totalAmountEl.textContent = "R0.00";
      saveCart([]); // ensures navbar updates to 0
      return;
    }

    cart.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 0;
      const subtotal = price * qty;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>R${price.toFixed(2)}</td>
        <td>
          <input type="number" class="quantity" value="${qty}" min="1">
        </td>
        <td class="subtotal">R${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn">X</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    updateTotals();
    attachEvents();
  }

  function updateTotals() {
    const cart = getCart();
    let subtotal = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
    });

    const deliveryFee = subtotal >= 6000 ? 0 : 83;
    const total = subtotal + deliveryFee;

    totalAmountEl.innerHTML = `
      <div>Subtotal: R${subtotal.toFixed(2)}</div>
      <div>Delivery: ${
        deliveryFee === 0
          ? '<span style="color:green;">Free</span>'
          : 'R' + deliveryFee.toFixed(2)
      }</div>
      <hr>
      <strong>Total: R${total.toFixed(2)}</strong>
    `;

    localStorage.setItem("deliveryFee", deliveryFee);
  }

  function attachEvents() {
    const cart = getCart();

    // Quantity change
    document.querySelectorAll(".quantity").forEach((input, index) => {
      input.addEventListener("change", () => {
        if (input.value < 1) input.value = 1;
        cart[index].qty = parseInt(input.value);
        saveCart(cart);
        renderCart();
      });
    });

    // Remove item
    document.querySelectorAll(".remove-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  renderCart();
});
