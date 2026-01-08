document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- ACCOUNT LINK STATE ---------------- */
  const accountLinks = document.querySelectorAll('#accountLink');
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (user) {
    accountLinks.forEach(link => {
      link.textContent = 'My Account';
      link.href = 'account.html';
    });
  }

  /* ---------------- CART COUNT ---------------- */
  updateCartCount();
});

/* ---------------- WISHLIST ---------------- */
document.addEventListener("DOMContentLoaded", renderWishlist);
window.addEventListener("wishlistUpdated", renderWishlist);

function renderWishlist() {
  const wishlistContainer = document.getElementById("wishlistContainer");
  if (!wishlistContainer) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlistContainer.innerHTML = wishlist.map(item => `
    <div class="wishlist-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="wishlist-info">
        <h4>${item.name}</h4>
        <p>${item.price}</p>
        <button class="remove-wishlist" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".remove-wishlist").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter(item => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
    });
  });
}

/* ---------------- CART COUNT FUNCTION ---------------- */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.length;
}

/* ---------------- MOBILE NAV ---------------- */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}
