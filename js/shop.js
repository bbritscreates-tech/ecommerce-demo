document.addEventListener('DOMContentLoaded', () => {

  console.log("shop.js loaded!"); // confirm script is running

  // Initialize cart in localStorage
  if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));

  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const addBtn = product.querySelector('.btn-add');
    addBtn.addEventListener('click', () => {
      console.log("Button clicked!"); // confirm click

      const id = product.querySelector('a').getAttribute('href'); // unique id
      const name = product.querySelector('h3').textContent;
      const price = parseFloat(product.querySelector('p').textContent.replace('R', ''));
      const image = product.querySelector('img').src;

      let cart = JSON.parse(localStorage.getItem('cart'));
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, qty: 1, image });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} added to cart!`);
      console.log('Cart now:', JSON.parse(localStorage.getItem('cart')));
    });
  });

  // CATEGORY FILTER
  // CATEGORY FILTER (includes dropdown items)
  const categoryItems = document.querySelectorAll('.sidebar li[data-category]');

  categoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent clicks from bubbling up (important for dropdown)

      // remove 'active' from all items
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // get category and filter
      const category = item.dataset.category;
      products.forEach(product => {
        const prodCat = product.dataset.category;
        product.style.display = (category === 'all' || prodCat === category) ? '' : 'none';
      });
    });
  });


  // DROPDOWN TOGGLE for Lifestyle
  const dropdownParents = document.querySelectorAll('.has-dropdown');

  dropdownParents.forEach(parent => {
    parent.addEventListener('click', (e) => {
      // prevent triggering product filter on click
      e.stopPropagation();
      parent.classList.toggle('open');
    });
  });

  // Simulate placing an order (for demo purposes)
  function simulateOrder() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return; // only if logged in

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.email === user.email);
    if (!currentUser) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');

    const newOrder = {
      date: new Date().toLocaleDateString(),
      items,
      total: total.toFixed(2)
    };

    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push(newOrder);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('cart', JSON.stringify([])); // clear cart
    alert('Order placed! You can view it in your account.');
  }

});

// Track recently viewed product
document.querySelectorAll('.product-card a').forEach(link => {
  link.addEventListener('click', () => {
    const productName = link.querySelector('h3')?.textContent || 'Unknown Product';
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    viewed = viewed.filter(item => item !== productName); // remove duplicate
    viewed.unshift(productName); // add to start
    if (viewed.length > 5) viewed.pop(); // limit to 5
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
  });
});

// Wishlist logic
document.querySelectorAll('.wishlist-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const productName = icon.parentElement.querySelector('h3').textContent;
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (wishlist.includes(productName)) {
      wishlist = wishlist.filter(p => p !== productName);
      icon.classList.remove('active');
    } else {
      wishlist.push(productName);
      icon.classList.add('active');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  });
});

// Mark saved items
const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
document.querySelectorAll('.wishlist-icon').forEach(icon => {
  const name = icon.parentElement.querySelector('h3').textContent;
  if (saved.includes(name)) icon.classList.add('active');
});

