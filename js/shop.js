// shop.js - single self-contained file with defensive checks + logs
(function () {
  try {
    console.log("shop.js starting...");

    // Wait for DOM ready
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM ready - initializing shop.js");

      /* ==================== CART HELPERS ==================== */
      const cartKey = "cart";

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

      if (!localStorage.getItem(cartKey)) {
        localStorage.setItem(cartKey, JSON.stringify([]));
      }

      // Basic guards
      const products = Array.from(document.querySelectorAll(".product-card"));
      if (!products.length) console.warn("No .product-card elements found.");

      /* -------------------- CART -------------------- */
      try {
        products.forEach(product => {
          const addBtn = product.querySelector(".btn-add");
          if (!addBtn) return;

          addBtn.addEventListener("click", () => {
            try {
              const id =
                product.querySelector("a")?.getAttribute("href") ||
                product.dataset.id ||
                product.querySelector("h3")?.textContent;

              const name = product.querySelector("h3")?.textContent || "Unnamed";
              const priceText = product.querySelector("p")?.textContent || "R0";
              const price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")) || 0;
              const image = product.querySelector("img")?.src || "";

              const cart = getCart();
              const existing = cart.find(item => item.id === id);

              if (existing) existing.qty += 1;
              else cart.push({ id, name, price, qty: 1, image });

              saveCart(cart);
              console.log("Added to cart:", name, "Cart now:", cart);

            } catch (err) {
              console.error("Error adding to cart:", err);
            }
          });
        });
      } catch (err) {
        console.error("Cart init error:", err);
      }

      /* -------------------- CATEGORY + DROPDOWN -------------------- */
      try {
        const categoryButtons = Array.from(document.querySelectorAll(".sidebar li[data-category]"));
        const productCards = Array.from(document.querySelectorAll(".product-card"));
        const dropdownParents = Array.from(document.querySelectorAll(".has-dropdown"));

        if (!categoryButtons.length) console.warn("No sidebar category items found.");

        function filterProducts(category) {
          productCards.forEach(card => {
            const cardCat = card.dataset.category || "";
            if (category === "all") card.style.display = "";
            else if (category === "lifestyle") {
              card.style.display =
                cardCat === "shakes" || cardCat === "vitamins" ? "" : "none";
            } else {
              card.style.display = cardCat === category ? "" : "none";
            }
          });
        }

        // dropdown toggle
        dropdownParents.forEach(parent => {
          parent.addEventListener("click", e => {
            if (e.target === parent || e.target.matches("i") || parent.contains(e.target)) {
              e.stopPropagation();
              parent.classList.toggle("open");
              categoryButtons.forEach(b => b.classList.remove("active"));
              parent.classList.add("active");
              filterProducts("lifestyle");
            }
          });
        });

        // category click
        categoryButtons.forEach(btn => {
          btn.addEventListener("click", e => {
            e.stopPropagation();
            const category = btn.dataset.category;
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const lifestyleParent = document.querySelector(
              '.has-dropdown[data-category="lifestyle"]'
            );
            if (lifestyleParent) {
              if (category === "shakes" || category === "vitamins") {
                lifestyleParent.classList.add("open");
              } else if (category !== "lifestyle") {
                lifestyleParent.classList.remove("open");
              }
            }

            filterProducts(category);
          });
        });

        const initial =
          document.querySelector(".sidebar li[data-category].active")?.dataset
            ?.category || "all";
        filterProducts(initial);

      } catch (err) {
        console.error("Category/dropdown error:", err);
      }

      /* -------------------- WISHLIST -------------------- */
      try {
        const wishlistIcons = Array.from(document.querySelectorAll(".wishlist-icon"));
        let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

        wishlistIcons.forEach(icon => {
          const card = icon.closest(".product-card");
          if (!card) return;
          const productId = card.dataset.id;

          if (wishlist.some(item => item.id === productId)) {
            icon.classList.add("active");
          }

          icon.addEventListener("click", ev => {
            ev.stopPropagation();
            wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

            if (wishlist.some(item => item.id === productId)) {
              wishlist = wishlist.filter(item => item.id !== productId);
              icon.classList.remove("active");
            } else {
              wishlist.push({
                id: productId,
                name: card.querySelector("h3")?.textContent || "",
                price: card.querySelector("p")?.textContent || "",
                image: card.querySelector("img")?.src || ""
              });
              icon.classList.add("active");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            window.dispatchEvent(new Event("wishlistUpdated"));
          });
        });
      } catch (err) {
        console.error("Wishlist error:", err);
      }

      /* -------------------- RECENTLY VIEWED -------------------- */
      try {
        const links = Array.from(document.querySelectorAll(".product-card a"));
        links.forEach(link => {
          link.addEventListener("click", () => {
            const productName =
              link.querySelector("h3")?.textContent || "Unknown Product";
            let viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
            viewed = viewed.filter(item => item !== productName);
            viewed.unshift(productName);
            if (viewed.length > 5) viewed.pop();
            localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
          });
        });
      } catch (err) {
        console.error("RecentlyViewed error:", err);
      }

      /* -------------------- NAVBAR CART COUNT -------------------- */
      try {
        const cartCountEl = document.getElementById("cartCount");

        function updateCartCount() {
          if (!cartCountEl) return;
          const total = getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
          cartCountEl.textContent = total;
          cartCountEl.classList.add("cart-updated");
          setTimeout(() => cartCountEl.classList.remove("cart-updated"), 300);
        }

        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);
        window.addEventListener("storage", e => {
          if (e.key === cartKey) updateCartCount();
        });

      } catch (err) {
        console.error("Navbar cart count error:", err);
      }

      console.log("shop.js initialisation complete.");
    });
  } catch (err) {
    console.error("shop.js top-level error:", err);
  }
})();
