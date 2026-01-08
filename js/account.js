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

  /* ---------------- LOAD USER (PERSISTENT LOGIN) ---------------- */
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (loggedInUser) {
    showDashboard(loggedInUser);
  } else {
    showLoginView();
  }

  /* ---------------- SWITCH FORMS ---------------- */
  showRegister?.addEventListener('click', e => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
  });

  showLogin?.addEventListener('click', e => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
  });

  /* ---------------- REGISTER ---------------- */
  document.getElementById('registerBtn')?.addEventListener('click', () => {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }

    users.push({ name, email, password, addresses: [], orders: [] });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created! Please log in.');
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
  });

  /* ---------------- LOGIN ---------------- */
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Invalid email or password.');
      return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'account.html';
  });

  /* ---------------- DASHBOARD ---------------- */
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

  /* ---------------- LOGOUT ---------------- */
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully.');
    window.location.href = 'account.html';
  });

  /* ---------------- TABS ---------------- */
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

  /* ---------------- PROFILE UPDATE ---------------- */
  saveProfileBtn?.addEventListener('click', () => {
    const updatedName = document.getElementById('profileName').value.trim();
    if (!updatedName) return alert('Please enter a name.');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const current = JSON.parse(localStorage.getItem('loggedInUser'));

    const index = users.findIndex(u => u.email === current.email);
    users[index].name = updatedName;

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(users[index]));

    userNameSpan.textContent = updatedName;
    alert('Profile updated!');
  });

  /* ---------------- ORDERS ---------------- */
  function loadOrders(user) {
    if (!user.orders || user.orders.length === 0) {
      ordersList.innerHTML = '<li>No orders yet.</li>';
      return;
    }

    ordersList.innerHTML = '';
    user.orders.forEach(o => {
      const li = document.createElement('li');
      li.textContent = `${o.date} — R${o.total}`;
      ordersList.appendChild(li);
    });
  }

  /* ---------------- ADDRESSES ---------------- */
  function loadAddresses(user) {
    if (!user.addresses || user.addresses.length === 0) {
      addressList.innerHTML = '<li>No saved addresses yet.</li>';
      return;
    }

    addressList.innerHTML = '';
    user.addresses.forEach(addr => {
      const li = document.createElement('li');
      li.textContent = addr;
      addressList.appendChild(li);
    });
  }

  addAddressBtn?.addEventListener('click', () => {
    const address = newAddressInput.value.trim();
    if (!address) return alert('Please enter an address.');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const current = JSON.parse(localStorage.getItem('loggedInUser'));

    const user = users.find(u => u.email === current.email);
    user.addresses.push(address);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    newAddressInput.value = '';
    loadAddresses(user);
    alert('Address added.');
  });
});
