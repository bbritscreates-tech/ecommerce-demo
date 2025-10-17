document.addEventListener('DOMContentLoaded', () => {
  const accountLink = document.getElementById('accountLink');
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    accountLink.textContent = `Logout (${user.name})`;
    accountLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      alert('Logged out successfully!');
      window.location.reload();
    });
  }
});
