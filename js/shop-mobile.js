(function () {
  try {
    console.log("shop-mobile.js starting...");

    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM ready - initializing mobile categories");

      // Defensive checks
      const mobileCats = Array.from(document.querySelectorAll(".categories-mobile li[data-category]"));
      const productCards = Array.from(document.querySelectorAll(".product-card"));

      if (!mobileCats.length) {
        console.warn("No mobile categories found (.categories-mobile li[data-category])");
        return;
      }
      if (!productCards.length) {
        console.warn("No product cards found (.product-card)");
        return;
      }

      // Filtering logic (same as desktop)
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

      // Handle mobile category clicks
      mobileCats.forEach(cat => {
        cat.addEventListener("click", () => {
          const selected = cat.dataset.category;

          // Highlight active
          mobileCats.forEach(c => c.classList.remove("active"));
          cat.classList.add("active");

          // Apply filter
          filterProducts(selected);
          console.log("Filtered by:", selected);
        });
      });

      // Default show all
      const initial = document.querySelector(".categories-mobile li.active")?.dataset?.category || "all";
      filterProducts(initial);
      console.log("Mobile categories initialized with:", initial);
    });
  } catch (err) {
    console.error("shop-mobile.js top-level error:", err);
  }
})();
