/* ================================
   📌 DEFAULT USERS (Admin + Students)
   ================================= */
let users = JSON.parse(localStorage.getItem("cms_users")) || {
    admin: {
        name: "Admin Officer",
        email: "admin@guni.ac.in",
        username: "admin",
        password: "1234",
        role: "admin"
    },
    student1: {
        name: "Prem Patel",
        email: "prem@guni.ac.in",
        username: "student1",
        password: "1111",
        role: "student"
    },
    student2: {
        name: "Priyank Patel",
        email: "priyank@guni.ac.in",
        username: "student2",
        password: "2222",
        role: "student"
    }
};
localStorage.setItem("cms_users", JSON.stringify(users));



/* ================================
   MAIN EVENT LOADER (Fixed Version)
   ================================= */
document.addEventListener("DOMContentLoaded", () => {

    // LOAD LOGIN ONLY ON LOGIN PAGE
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser();
        });
    }

    // LOAD SIGNUP ONLY ON SIGNUP PAGE
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            registerNewUser();
        });
    }

    // Load UI Components only if available
    loadSidebar();
    loadProfile();
    loadComplaintsForStudent();
    loadComplaintsForAdmin();

    // NEW ADDED FUNCTIONS BELOW
    loadAdminTable();
    loadAdminStats();
    loadAdminChart();
    loadStatusBox();
});



/* ================================
   📌 LOGIN FUNCTION (Works 100%)
   ================================= */
function loginUser() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    const users = JSON.parse(localStorage.getItem("cms_users"));

    if (!users[username] || users[username].password !== password) {
        alert("Invalid username or password!");
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(users[username]));

    window.location.href = "home.html";
}



/* ================================
   📌 REGISTER NEW STUDENT
   ================================= */
function registerNewUser() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const username = document.getElementById("signupUser").value.trim();
    const password = document.getElementById("signupPass").value.trim();

    if (!name || !email || !username || !password) {
        alert("All fields are required!");
        return;
    }

    if (username.length < 4 || password.length < 4) {
        alert("Username & Password must be at least 4 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("cms_users"));

    if (users[username]) {
        alert("Username already exists!");
        return;
    }

    users[username] = {
        name,
        email,
        username,
        password,
        role: "student"
    };

    localStorage.setItem("cms_users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "login.html";
}



/* ================================
   📌 LOGOUT
   ================================= */
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}



/* ================================
   📌 SIDEBAR BUILDER
   ================================= */
function loadSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    if (user.role === "admin") {
        sidebar.innerHTML = `
        <h3 class="side-title">Admin Panel</h3>
        <a href="home.html">Dashboard</a>
        <a href="viewComplaints.html">View All Complaints</a>
        <a onclick="logout()" class="logout-btn">Logout</a>
        `;
    } else {
        sidebar.innerHTML = `
        <h3 class="side-title">Student Panel</h3>
        <a href="home.html">Dashboard</a>
        <a href="fileComplaint.html">File Complaint</a>
        <a href="viewStatus.html">My Complaint Status</a>
        <a href="profile.html">My Profile</a>
        <a onclick="logout()" class="logout-btn">Logout</a>
        `;
    }
}



/* ================================
   📌 LOAD PROFILE DETAILS
   ================================= */
function loadProfile() {
    const name = document.getElementById("pName");
    if (!name) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    document.getElementById("pName").innerText = user.name;
    document.getElementById("pEmail").innerText = user.email;
    document.getElementById("pUser").innerText = user.username;
    document.getElementById("pRole").innerText = user.role.toUpperCase();
}



/* ==================================
   📌 SUBMIT COMPLAINT
   ================================== */
function submitComplaint() {
    const title = document.getElementById("compTitle").value.trim();
    const category = document.getElementById("compCategory").value;
    const desc = document.getElementById("compDesc").value.trim();

    if (!title || !desc || category === "Select a Category") {
        alert("Fill all fields.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    const allComplaints = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    allComplaints.push({
        id: Date.now(),
        user: user.username,
        name: user.name,
        title,
        category,
        desc,
        status: "Pending",
        date: new Date().toLocaleString(),
        resolvedOn: ""
    });

    localStorage.setItem("cms_complaints", JSON.stringify(allComplaints));

    alert("Complaint submitted!");
    window.location.href = "viewStatus.html";
}



/* ==================================
   📌 STUDENT — VIEW STATUS
   ================================== */
function loadComplaintsForStudent() {
    const box = document.getElementById("myComplaints");
    if (!box) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    const list = all.filter(c => c.user === user.username);

    if (list.length === 0) {
        box.innerHTML = "<p>No complaints submitted yet.</p>";
        return;
    }

    box.innerHTML = list.map(c => `
      <div class="complaint-card">
        <h3>${c.title}</h3>
        <p><b>Category:</b> ${c.category}</p>
        <p><b>Status:</b> ${c.status}</p>
        <p><b>Date:</b> ${c.date}</p>
        ${c.resolvedOn ? `<p><b>Resolved On:</b> ${c.resolvedOn}</p>` : ""}
      </div>
    `).join("");
}



/* ==================================
   📌 ADMIN — VIEW ALL COMPLAINTS
   ================================== */
function loadComplaintsForAdmin() {
    const box = document.getElementById("adminComplaints");
    if (!box) return;

    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    if (all.length === 0) {
        box.innerHTML = "<p>No complaints yet.</p>";
        return;
    }

    box.innerHTML = all.map(c => `
      <div class="complaint-card admin">
        <h3>${c.title}</h3>
        <p><b>Student:</b> ${c.name}</p>
        <p><b>Category:</b> ${c.category}</p>
        <p><b>Description:</b> ${c.desc}</p>
        <p><b>Status:</b> ${c.status}</p>

        ${c.status === "Pending" ? `
          <button onclick="resolveComplaint(${c.id})">Mark Resolved</button>
        ` : `<p><b>Resolved On:</b> ${c.resolvedOn}</p>`}
      </div>
    `).join("");
}



/* ==================================
   📌 ADMIN — MARK RESOLVED
   ================================== */
function resolveComplaint(id) {
    let all = JSON.parse(localStorage.getItem("cms_complaints"));

    all = all.map(c => {
        if (c.id === id) {
            c.status = "Resolved";
            c.resolvedOn = new Date().toLocaleString();
        }
        return c;
    });

    localStorage.setItem("cms_complaints", JSON.stringify(all));

    alert("Complaint marked as resolved.");
    location.reload();
}



/* ==================================
   ⭐ NEW — ADMIN TABLE (for viewComplaints.html)
   ================================== */
function loadAdminTable() {
    const table = document.getElementById("complaintsTableBody");
    if (!table) return;

    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    if (all.length === 0) {
        table.innerHTML = `<tr><td colspan="7" class="no-data">No complaints found.</td></tr>`;
        return;
    }

    table.innerHTML = all.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.title}</td>
            <td>${c.category}</td>
            <td>${c.date}</td>
            <td>${c.status}</td>
            <td>
                <button onclick="openComplaint(${c.id})" class="resolve-btn" style="background:#0b63d6;">Read</button>
                ${c.status === "Pending" ? 
                   `<button class="resolve-btn" onclick="resolveComplaint(${c.id})">Resolve</button>` 
                   : c.resolvedOn}
            </td>
        </tr>
    `).join("");
}



/* ==================================
   ⭐ NEW — ADMIN STATS (top boxes)
   ================================== */
function loadAdminStats() {
    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    const statAllTime = document.getElementById("statAllTime");
    if (!statAllTime) return;

    const month = new Date().getMonth();

    statAllTime.innerText = all.length;
    document.getElementById("statThisMonth").innerText = all.filter(c =>
        new Date(c.date).getMonth() === month).length;

    document.getElementById("statOpen").innerText = all.filter(c =>
        c.status === "Pending").length;

    document.getElementById("statClosed").innerText = all.filter(c =>
        c.status === "Resolved").length;
}



/* ==================================
   ⭐ NEW — STATUS PIE CHART
   ================================== */
function loadAdminChart() {
    const canvas = document.getElementById("statusChart");
    if (!canvas) return;

    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];

    const pending = all.filter(c => c.status === "Pending").length;
    const resolved = all.filter(c => c.status === "Resolved").length;

    new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Pending", "Resolved"],
            datasets: [{
                data: [pending, resolved],
                backgroundColor: ["#f59e0b", "#10b981"]
            }]
        }
    });
}



/* ==================================
   ⭐ NEW — viewStatus.html UI loader
   ================================== */
function loadStatusBox() {
    const box = document.getElementById("statusBox");
    if (!box) return;

    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    const list = all.filter(c => c.user === user.username);

    if (list.length === 0) {
        box.innerHTML = `<p>No complaints submitted.</p>`;
        return;
    }

    box.innerHTML = list.map(c => `
        <div class="status-card">
            <h3>${c.title}</h3>
            <p><b>Category:</b> ${c.category}</p>
            <p><b>Status:</b> ${c.status}</p>
            <p><b>Filed On:</b> ${c.date}</p>
            ${c.resolvedOn ? `<p><b>Resolved On:</b> ${c.resolvedOn}</p>` : ""}
            <p>${c.desc}</p>
        </div>
    `).join("");
}



/* ============================================================
   ⭐⭐⭐ NEW — ADMIN POPUP MODAL TO READ COMPLAINT FULL DETAILS
   ============================================================ */

function openComplaint(id) {
    const all = JSON.parse(localStorage.getItem("cms_complaints")) || [];
    const data = all.find(c => c.id === id);
    if (!data) return;

    let modal = document.getElementById("adminModal");

    if (!modal) {
        const div = document.createElement("div");
        div.id = "adminModal";
        div.className = "modal-overlay";
        div.innerHTML = `
            <div class="modal-box">
                <h2 class="modal-title" id="mTitle"></h2>
                <p class="modal-meta"><b>Student:</b> <span id="mStudent"></span></p>
                <p class="modal-meta"><b>Category:</b> <span id="mCategory"></span></p>
                <p class="modal-meta"><b>Status:</b> <span id="mStatus"></span></p>
                <p class="modal-meta"><b>Filed On:</b> <span id="mDate"></span></p>
                <p class="modal-meta" id="mResolved"></p>
                <div class="modal-desc" id="mDesc"></div>
                <button class="close-modal" onclick="closeModal()">Close</button>
            </div>
        `;
        document.body.appendChild(div);
        modal = div;
    }

    document.getElementById("mTitle").innerText = data.title;
    document.getElementById("mStudent").innerText = data.name;
    document.getElementById("mCategory").innerText = data.category;
    document.getElementById("mStatus").innerText = data.status;
    document.getElementById("mDate").innerText = data.date;
    document.getElementById("mDesc").innerText = data.desc;

    document.getElementById("mResolved").innerHTML =
        data.resolvedOn ? `<b>Resolved On:</b> ${data.resolvedOn}` : "";

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("adminModal").style.display = "none";
}
