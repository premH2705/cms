
if (!localStorage.getItem('users')) {
  const users = [
    {
      email: 'admin@gmail.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'Admin'
    },
    {
      email: 'friend@gmail.com',
      password: 'friend123',
      name: 'Friend User',
      role: 'User'
    }
  ];
  localStorage.setItem('users', JSON.stringify(users));
}


function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorBox = document.getElementById('error');

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Store user details for the current session
    localStorage.setItem('currentUser', JSON.stringify({
      name: user.name,
      email: user.email,
      role: user.role
    }));

    // Redirect to dashboard
    window.location.href = 'home.html';
  } else {
    errorBox.textContent = '❌ Invalid Email or Password!';
  }
}


if (window.location.pathname.endsWith('home.html')) {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('welcome').textContent = `Welcome, ${user.name}! 👋`;
  }
}


if (window.location.pathname.endsWith('profile.html')) {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('pname').textContent = user.name;
    document.getElementById('pemail').textContent = user.email;
    document.getElementById('prole').textContent = user.role;
  }
}


function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

