
document.addEventListener('DOMContentLoaded', () => {
  const accountLink = document.getElementById('accountLink');
  if (!accountLink) return;

  accountLink.addEventListener('click', (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
      // User is logged in → go to dashboard view
      window.location.href = '../account.html?view=dashboard';
    } else {
      // User not logged in → go to login/register
      window.location.href = '../account.html?view=login';
    }
  });
});

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

      // Notify all pages
      window.dispatchEvent(new Event("wishlistUpdated"));
    });
  });
}



function updateCartCount() {
  const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count;
}
updateCartCount();


const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle.addEventListener('click', () => nav.classList.toggle('open'));


