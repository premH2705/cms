// =======================================
// COMPLAINT MANAGEMENT SYSTEM SCRIPT
// =======================================

// Default Users
const defaultUsers = [
  { username: "admin", password: "1234", name: "Admin Officer", role: "Admin", email: "admin@university.edu" },
  { username: "student1", password: "1111", name: "Prem Patel", role: "Student", email: "prem@student.edu" },
  { username: "student2", password: "2222", name: "Priyank Patel", role: "Student", email: "priyank@student.edu" }
];

// Store defaults if not set
if (!localStorage.getItem("usersData")) {
  localStorage.setItem("usersData", JSON.stringify(defaultUsers));
}

// LOGIN FUNCTION
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = JSON.parse(localStorage.getItem("usersData")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "home.html";
  } else {
    alert("Invalid username or password!");
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// AUTO-LOAD USER DATA
window.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!userData && !window.location.href.includes("login.html") && !window.location.href.includes("signup.html")) {
    window.location.href = "login.html";
    return;
  }

  // HOME PAGE (Role-based)
  if (window.location.href.includes("home.html")) {
    const sidebar = document.getElementById("sidebar");
    const dashboard = document.getElementById("dashboardContent");

    if (userData.role === "Admin") {
      sidebar.innerHTML = `
        <a href="home.html" class="active">🏠 Admin Dashboard</a>
        <a href="viewComplaints.html">📋 View All Complaints</a>
        <a href="profile.html">👤 Profile</a>
      `;
      dashboard.innerHTML = `
        <h2>Welcome, ${userData.name} 👋</h2>
        <p>You are logged in as <b>Admin</b>. Here you can view and manage all student complaints.</p>
      `;
    } else {
      sidebar.innerHTML = `
        <a href="home.html" class="active">🏠 Dashboard</a>
        <a href="complaint.html">📝 File Complaint</a>
        <a href="profile.html">👤 Profile</a>
      `;
      dashboard.innerHTML = `
        <h2>Welcome, ${userData.name} 👋</h2>
        <p>Manage, file, and track your complaints easily.</p>
      `;
    }
  }

  // PROFILE PAGE
  const nameEl = document.getElementById("profileName");
  const roleEl = document.getElementById("profileRole");
  const emailEl = document.getElementById("profileEmail");

  if (nameEl && roleEl && emailEl && userData) {
    nameEl.innerText = userData.name;
    roleEl.innerText = userData.role;
    emailEl.innerText = userData.email;
  }
});
