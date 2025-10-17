// shop.js - single self-contained file with defensive checks + logs
(function () {
  try {
    console.log("shop.js starting...");

    // Wait for DOM ready
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM ready - initializing shop.js");

      // Basic guards
      const products = Array.from(document.querySelectorAll(".product-card"));
      if (!products.length) console.warn("No .product-card elements found.");

      /* -------------------- CART -------------------- */
      try {
        if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
        products.forEach(product => {
          const addBtn = product.querySelector(".btn-add");
          if (!addBtn) return;
          addBtn.addEventListener("click", () => {
            try {
              const id = product.querySelector("a")?.getAttribute("href") || product.dataset.id || product.querySelector("h3")?.textContent;
              const name = product.querySelector("h3")?.textContent || "Unnamed";
              const priceText = product.querySelector("p")?.textContent || "R0";
              const price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")) || 0;
              const image = product.querySelector("img")?.src || "";

              let cart = JSON.parse(localStorage.getItem("cart") || "[]");
              const existing = cart.find(item => item.id === id);
              if (existing) existing.qty += 1;
              else cart.push({ id, name, price, qty: 1, image });

              localStorage.setItem("cart", JSON.stringify(cart));
              console.log("Added to cart:", name, "Cart now:", cart);
              // avoid alert spam in dev; uncomment if you want:
              // alert(`${name} added to cart!`);
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

        // function: filter
        function filterProducts(category) {
          productCards.forEach(card => {
            const cardCat = card.dataset.category || "";
            if (category === "all") card.style.display = "";
            else if (category === "lifestyle") {
              card.style.display = (cardCat === "shakes" || cardCat === "vitamins") ? "" : "none";
            } else {
              card.style.display = (cardCat === category) ? "" : "none";
            }
          });
        }

        // dropdown toggle
        dropdownParents.forEach(parent => {
          parent.addEventListener("click", (e) => {
            // allow clicking caret or parent text
            if (e.target === parent || e.target.matches("i") || e.currentTarget.contains(e.target)) {
              e.stopPropagation();
              parent.classList.toggle("open");
              // mark active
              categoryButtons.forEach(b => b.classList.remove("active"));
              parent.classList.add("active");
              filterProducts("lifestyle");
            }
          });
        });

        // category click
        categoryButtons.forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const category = btn.dataset.category;
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // set dropdown open state for lifestyle parent
            const lifestyleParent = document.querySelector('.has-dropdown[data-category="lifestyle"]');
            if (lifestyleParent) {
              if (category === "shakes" || category === "vitamins") lifestyleParent.classList.add("open");
              else if (category !== "lifestyle") lifestyleParent.classList.remove("open");
            }

            filterProducts(category);
          });
        });

        // initialize to show all (safe)
        const initial = document.querySelector('.sidebar li[data-category].active')?.dataset?.category || "all";
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
          if (wishlist.some(item => item.id === productId)) icon.classList.add("active");

          icon.addEventListener("click", (ev) => {
            ev.stopPropagation();
            const productName = card.querySelector("h3")?.textContent || "Unnamed";
            const productPrice = card.querySelector("p")?.textContent || "R0";
            const productImage = card.querySelector("img")?.src || "";

            wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const exists = wishlist.some(item => item.id === productId);
            if (exists) {
              wishlist = wishlist.filter(item => item.id !== productId);
              icon.classList.remove("active");
            } else {
              wishlist.push({ id: productId, name: productName, price: productPrice, image: productImage });
              icon.classList.add("active");
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            window.dispatchEvent(new Event("wishlistUpdated"));
            console.log("Wishlist now:", wishlist);
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
            const productName = link.querySelector("h3")?.textContent || "Unknown Product";
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

      console.log("shop.js initialisation complete.");
    });
  } catch (err) {
    console.error("shop.js top-level error:", err);
  }
})();
