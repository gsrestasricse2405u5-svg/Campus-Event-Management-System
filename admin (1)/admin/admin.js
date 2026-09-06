const API = "http://localhost:3000";

// =====================================================
// ADMIN LOGIN
// =====================================================

if (document.getElementById("loginForm")) {

    document.getElementById("loginForm").addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        if (username === "admin" && password === "admin123") {

            message.textContent = "Login successful!";

            localStorage.setItem("loggedInUser", "admin");

            setTimeout(function () {
                window.location.href = "admin-dashboard.html";
            }, 1000);

        } else {

            message.textContent = "Invalid username or password.";
        }
    });
}

// SHOW FORM
function showAddEventForm() {
    document.getElementById("addEventForm").style.display = "block";
}

// HIDE FORM
function hideAddEventForm() {
    document.getElementById("addEventForm").style.display = "none";
}

// ===============================
// ADD EVENT (FIXED)
// ===============================
async function saveNewEvent() {

    const event = {
        title: document.getElementById("eventName").value.trim(),
        description: document.getElementById("eventDescription").value.trim(),
        date: document.getElementById("eventDate").value,
        time: document.getElementById("eventTime").value,
        venue: document.getElementById("eventVenue").value.trim(),
        category: document.getElementById("eventCategory").value
    };

    if (!event.title || !event.date || !event.venue) {
        alert("Fill required fields");
        return;
    }

    try {
        const res = await fetch(`${API}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event)
        });

        const data = await res.json();

        console.log("ADD RESPONSE:", data);

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Event Added ✅");
        hideAddEventForm();
        loadEvents();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// ===============================
// FORMAT DATE
// ===============================
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

// ===============================
// FORMAT TIME
// ===============================
function formatTime(timeStr) {
    if (!timeStr) return "";
    return timeStr.substring(0,5);
}

// ===============================
// STATUS LOGIC
// ===============================
function getStatus(dateStr) {
    const today = new Date();
    const eventDate = new Date(dateStr);

    today.setHours(0,0,0,0);
    eventDate.setHours(0,0,0,0);

    if (eventDate < today) return "completed";
    if (eventDate.getTime() === today.getTime()) return "ongoing";
    return "upcoming";
}

// ===============================
// LOAD EVENTS (FINAL)
// ===============================
async function loadEvents() {

    const table = document.getElementById("eventTable");

    try {
        const res = await fetch(`${API}/events`);
        const events = await res.json();

        table.innerHTML = "";

        events.forEach(event => {

            const row = document.createElement("tr");

            row.dataset.id = event.id;

            const status = getStatus(event.date);

            row.innerHTML = `
                <td>${event.title}</td>

                <td>
                    ${formatDate(event.date)} <br>
                    <small>${formatTime(event.time)}</small>
                </td>

                <td>${event.venue}</td>

                <td>
                    <span class="status ${status}">
                        ${status.toUpperCase()}
                    </span>
                </td>

                <td>
                    <button onclick="editEvent(${event.id})">Edit</button>
                    <button onclick="deleteEvent(${event.id})">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load events");
    }
}

async function editEvent(id) {

    const res = await fetch(`${API}/events/${id}`);
    const event = await res.json();

    document.getElementById("editEventRow").value = id;
    document.getElementById("editEventName").value = event.title;
    document.getElementById("editEventDate").value = event.date.split("T")[0];
    document.getElementById("editEventVenue").value = event.venue;

    document.getElementById("editEventForm").style.display = "block";
}

// ===============================
// UPDATE EVENT (FINAL FIXED)
// ===============================
async function updateEvent() {

    const id = document.getElementById("editEventRow").value;

    // 👉 first get old data (VERY IMPORTANT)
    const oldRes = await fetch(`${API}/events/${id}`);
    const oldEvent = await oldRes.json();

    const updated = {
        title: document.getElementById("editEventName").value,
        date: document.getElementById("editEventDate").value,
        venue: document.getElementById("editEventVenue").value,

        // ✅ keep old values so nothing breaks
        description: oldEvent.description,
        time: oldEvent.time,
        category: oldEvent.category
    };

    try {
        const res = await fetch(`${API}/events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Update failed");
            return;
        }

        alert("Updated ✅");

        document.getElementById("editEventForm").style.display = "none";

        loadEvents();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}
// ===============================
// DELETE
// ===============================
async function deleteEvent(id) {

    console.log("DELETE ID:", id);

    if (!confirm("Delete?")) return;

    await fetch(`${API}/events/${id}`, { method: "DELETE" });

    loadEvents();
}


// ===============================
// LOAD STUDENTS
// ===============================
async function loadStudents() {

    try {
        const res = await fetch(`${API}/users`);
        const students = await res.json();

        const tableBody = document.getElementById("studentsTableBody");

        tableBody.innerHTML = "";

        students.forEach(s => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${s.name || "-"}</td>
                <td>${s.email || "-"}</td>
                <td>${s.department || "-"}</td>
                <td>${s.year || "-"}</td>
                <td>${s.registered_event || "Not Registered"}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Students load error:", err);
    }
}

// ===============================
// PAGE LOAD (FIXED)
// ===============================
window.onload = () => {
    loadEvents();
    loadStudents();   // ✅ ADD THIS
};