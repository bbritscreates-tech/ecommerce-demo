
document.addEventListener('DOMContentLoaded', () => {
  const accountLink = document.getElementById('accountLink');
  if (!accountLink) return;

  accountLink.addEventListener('click', (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
      // User is logged in → go to dashboard view
      window.location.href = 'account.html?view=dashboard';
    } else {
      // User not logged in → go to login/register
      window.location.href = 'account.html?view=login';
    }
  });
});

function updateCartCount() {
  const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
}
updateCartCount();


const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle.addEventListener('click', () => nav.classList.toggle('open'));
