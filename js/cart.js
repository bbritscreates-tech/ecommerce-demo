document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.getElementById('cartItems');
  const totalAmountEl = document.getElementById('totalAmount');

  // Make sure elements exist
  if (!cartTableBody || !totalAmountEl) return;

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = '';

    if(cart.length === 0){
      cartTableBody.innerHTML = `<tr><td colspan="5">Your cart is empty</td></tr>`;
      totalAmountEl.textContent = 'R0.00';
      return;
    }

    cart.forEach((item, index) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 0;
      const subtotal = price * qty;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>R${price.toFixed(2)}</td>
        <td><input type="number" class="quantity" value="${qty}" min="1"></td>
        <td class="subtotal">R${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn">X</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    updateTotals();
    attachEvents();
  }

  function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cart.forEach(item => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 0;
      total += price * qty;
    });
    totalAmountEl.textContent = `R${total.toFixed(2)}`;
  }

  function attachEvents() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Quantity change
    document.querySelectorAll('.quantity').forEach((input,index)=>{
      input.addEventListener('change', ()=>{
        if(input.value<1) input.value=1;
        cart[index].qty = parseInt(input.value);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    // Remove button
    document.querySelectorAll('.remove-btn').forEach((btn,index)=>{
      btn.addEventListener('click', ()=>{
        cart.splice(index,1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
