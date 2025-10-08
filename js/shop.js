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
      const price = parseFloat(product.querySelector('p').textContent.replace('R',''));
      const image = product.querySelector('img').src;

      let cart = JSON.parse(localStorage.getItem('cart'));
      const existing = cart.find(item => item.id === id);

      if(existing){
        existing.qty += 1;
      } else {
        cart.push({id, name, price, qty:1, image});
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} added to cart!`);
      console.log('Cart now:', JSON.parse(localStorage.getItem('cart')));
    });
  });

  // CATEGORY FILTER
  const categoryItems = document.querySelectorAll('.sidebar ul li');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const category = item.dataset.category;
      products.forEach(product => {
        const prodCat = product.dataset.category;
        product.style.display = (category==='all' || prodCat===category) ? '' : 'none';
      });
    });
  });
});
