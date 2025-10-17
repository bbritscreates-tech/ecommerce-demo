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
});
