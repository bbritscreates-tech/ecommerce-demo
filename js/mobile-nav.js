document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const dropdown = document.getElementById("mobile-dropdown-menu");
  const icon = menuBtn.querySelector("i");

  menuBtn.addEventListener("click", () => {
    dropdown.classList.toggle("open");

    // Toggle icon between hamburger and X
    if (dropdown.classList.contains("open")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });
});
