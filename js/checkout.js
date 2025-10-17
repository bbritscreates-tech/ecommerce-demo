document.addEventListener('DOMContentLoaded', () => {
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    placeOrder();
  });

  function placeOrder() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      alert('Please log in to place your order.');
      window.location.href = 'account.html';
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Example: You can fetch address or payment fields if you have them
    const address = document.getElementById('checkoutAddress')?.value || 'No address provided';
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'Unknown';

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');

    const newOrder = {
      date: new Date().toLocaleString(),
      items,
      total: total.toFixed(2),
      address,
      paymentMethod
    };

    // Update the logged-in user's orders
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.email === loggedInUser.email);
    if (!currentUser) {
      alert('User not found.');
      return;
    }

    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push(newOrder);

    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('cart', JSON.stringify([]));

    alert('✅ Order placed successfully!');
    window.location.href = 'account.html';
  }
});
