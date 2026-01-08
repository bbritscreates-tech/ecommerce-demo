document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById('loginBox');
  const registerBox = document.getElementById('registerBox');
  const dashboardBox = document.getElementById('dashboardBox');
  const userNameSpan = document.getElementById('userName');
  const ordersList = document.getElementById('ordersList');
  const addressList = document.getElementById('addressList');
  const newAddressInput = document.getElementById('newAddress');
  const addAddressBtn = document.getElementById('addAddressBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  // Handle URL ?view=
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  // Load user
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (loggedInUser && (view === 'dashboard' || view === null)) {
    showDashboard(loggedInUser);
  } else {
    showLoginView();
  }

  // Switch forms
  showRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
  });

  showLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
  });

  // Register
  document.getElementById('registerBtn')?.addEventListener('click', () => {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) return alert('Please fill in all fields.');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return alert('Email already registered.');

    users.push({ name, email, password, addresses: [], orders: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created! Please log in.');
    showLogin.click();
  });

  // Login
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      showDashboard(user);
    } else {
      alert('Invalid email or password.');
    }
  });

  // Dashboard
  function showDashboard(user) {
    loginBox.classList.add('hidden');
    registerBox.classList.add('hidden');
    dashboardBox.classList.remove('hidden');
    userNameSpan.textContent = user.name;
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    loadOrders(user);
    loadAddresses(user);
    setupTabs();
  }

  function showLoginView() {
    loginBox.classList.remove('hidden');
    registerBox.classList.add('hidden');
    dashboardBox.classList.add('hidden');
  }

  // Logout
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully.');
    window.location.href = 'account.html?view=login';
  });

  // Tabs
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`${tab.dataset.tab}Tab`).classList.remove('hidden');
      });
    });
  }

  // Profile update
  saveProfileBtn?.addEventListener('click', () => {
    const updatedName = document.getElementById('profileName').value.trim();
    if (!updatedName) return alert('Please enter a name.');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentLogged = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!currentLogged) return alert('No user logged in.');

    const userIndex = users.findIndex(u => u.email === currentLogged.email);
    if (userIndex === -1) return alert('User not found.');

    users[userIndex].name = updatedName;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(users[userIndex]));

    userNameSpan.textContent = updatedName;
    alert('Profile updated!');
  });

  // Load Orders
  function loadOrders(user) {
    if (!user.orders || user.orders.length === 0) {
      ordersList.innerHTML = '<li>No orders yet.</li>';
      return;
    }

    ordersList.innerHTML = '';
    user.orders.slice().reverse().forEach(o => { // show most recent first
      const li = document.createElement('li');
      li.textContent = `${o.date} — ${o.items.length} items — Total: R${o.total}`;
      ordersList.appendChild(li);
    });
  }

  // Load Addresses
  function loadAddresses(user) {
    if (!user.addresses || user.addresses.length === 0) {
      addressList.innerHTML = '<li>No saved addresses yet.</li>';
      return;
    }

    addressList.innerHTML = '';
    user.addresses.forEach((a, i) => {
      const li = document.createElement('li');
      li.textContent = a;
      // Highlight last used address
      if (user.orders && user.orders.length && a === user.orders[user.orders.length - 1].address) {
        li.style.fontWeight = 'bold';
        li.textContent += ' (last used)';
      }
      addressList.appendChild(li);
    });
  }

  // Add new address
  addAddressBtn?.addEventListener('click', () => {
    const newAddress = newAddressInput.value.trim();
    if (!newAddress) return alert('Please enter an address.');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!currentUser) return;

    currentUser.addresses = currentUser.addresses || [];
    currentUser.addresses.push(newAddress);

    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) users[idx] = currentUser;

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(currentUser));

    newAddressInput.value = '';
    loadAddresses(currentUser);
    alert('Address added.');
  });
});
