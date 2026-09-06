// ==========================================
// CAMPUS EVENT MANAGEMENT SYSTEM
// FRONTEND JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("CampusEvents website loaded successfully.");

    const API_URL = "http://localhost:3000";


    // ==========================================
    // EVENTS
    // ==========================================

    const eventsContainer =
        document.getElementById("eventsContainer");

    let allEvents = [];


    async function loadEvents() {

        if (!eventsContainer) {
            return;
        }

        try {

            const response =
                await fetch(`${API_URL}/events`);

            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }

            allEvents = await response.json();

            displayEvents(allEvents);

        } catch (error) {

            console.error("Error loading events:", error);

            eventsContainer.innerHTML = `
                <p>
                    Unable to load events. Please make sure the backend server is running.
                </p>
            `;

        }

    }


    function displayEvents(events) {

        if (!eventsContainer) {
            return;
        }

        eventsContainer.innerHTML = "";

        const noResults =
            document.getElementById("noResults");


        if (events.length === 0) {

            if (noResults) {
                noResults.style.display = "block";
            }

            return;
        }


        if (noResults) {
            noResults.style.display = "none";
        }


        events.forEach(function (event) {

            const card =
                document.createElement("div");

            card.className = "full-event-card";

            card.setAttribute(
                "data-category",
                event.category.toLowerCase()
            );

            card.setAttribute(
                "data-name",
                event.title.toLowerCase()
            );


            card.innerHTML = `

                <div class="full-event-image">
                    ${event.category.toUpperCase()}
                </div>

                <div class="full-event-content">

                    <span class="event-category">
                        ${event.category}
                    </span>

                    <h2>
                        ${event.title}
                    </h2>

                    <p>
                        ${event.description}
                    </p>

                    <div class="event-details">

                        <span>
                            📅 ${event.date}
                        </span>

                        <span>
                            ⏰ ${event.time}
                        </span>

                        <span>
                            📍 ${event.venue}
                        </span>

                    </div>

                    <a
                        href="event-details.html?id=${event.id}"
                        class="secondary-button"
                    >
                        View Details
                    </a>

                </div>

            `;


            eventsContainer.appendChild(card);

        });

    }


    // ==========================================
    // EVENT SEARCH & FILTER
    // ==========================================

    const searchInput =
        document.getElementById("eventSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const noResults =
        document.getElementById("noResults");


    function filterEvents() {

        const searchText =
            searchInput.value.toLowerCase().trim();

        const selectedCategory =
            categoryFilter.value.toLowerCase();


        const filteredEvents =
            allEvents.filter(function (event) {

                const eventName =
                    event.title.toLowerCase();

                const eventCategory =
                    event.category.toLowerCase();


                const matchesSearch =
                    eventName.includes(searchText);


                const matchesCategory =
                    selectedCategory === "all" ||
                    eventCategory === selectedCategory;


                return matchesSearch && matchesCategory;

            });


        displayEvents(filteredEvents);

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterEvents
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterEvents
        );

    }


    // Load events when page opens

    loadEvents();



    // ==========================================
    // LOGIN FORM
    // ==========================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    document.getElementById("email").value.trim();

                const password =
                    document.getElementById("password").value.trim();


                if (email === "" || password === "") {

                    alert(
                        "Please enter your email and password."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(`${API_URL}/login`, {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })

                        });


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(data.message);

                        return;

                    }


                    alert("Login successful!");


                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );


                    window.location.href =
                        "events.html";


                } catch (error) {

                    console.error(error);

                    alert(
                        "Unable to connect to the backend."
                    );

                }

            }
        );

    }



    // ==========================================
    // REGISTRATION FORM
    // ==========================================

    // LOAD EVENTS INTO REGISTRATION DROPDOWN

    const registeredEventSelect =
        document.getElementById("registeredEvent");


    if (registeredEventSelect) {

        fetch(`${API_URL}/events/all`)
            .then(response => response.json())
            .then(events => {

                events.forEach(event => {

                    const option =
                        document.createElement("option");

                    option.value = event.title;

                    option.textContent = event.title;

                    registeredEventSelect.appendChild(option);

                });

            })
            .catch(error => {

                console.error(
                    "Error loading events:",
                    error
                );

            });

    }


    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const name =
                    document.getElementById("name").value.trim();

                const email =
                    document.getElementById("registerEmail").value.trim();

                const password =
                    document.getElementById("registerPassword").value;

                const department =
                    document.getElementById("department").value;

                const year =
                    document.getElementById("year").value;

                const phone =
                    document.getElementById("phone").value.trim();

                const registeredEvent =
                    document.getElementById("registeredEvent").value;


                // Check empty fields

                if (
                    name === "" ||
                    email === "" ||
                    password === "" ||
                    department === "" ||
                    year === "" ||
                    phone === ""
                ) {

                    alert(
                        "Please fill in all the required fields."
                    );

                    return;

                }


                // Check password length

                if (password.length < 6) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    return;

                }


                // Check phone number

                if (!/^[0-9]{10}$/.test(phone)) {

                    alert(
                        "Please enter a valid 10-digit phone number."
                    );

                    return;

                }


                // Send registration data to backend

                try {

                    const response =
                        await fetch(`${API_URL}/register`, {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password,

                                department: department,

                                year: year,

                                phone: phone,

                                registered_event:
                                    registeredEvent

                            })

                        });


                    const data =
                        await response.json();


                    // If registration failed

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Registration failed."
                        );

                        return;

                    }


                    // If registration succeeded

                    alert(
                        "Registration successful! Please login."
                    );


                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "Registration error:",
                        error
                    );

                    alert(
                        "Unable to connect to the backend."
                    );

                }

            }
        );

    }



    // ==========================================
    // EVENT DETAILS
    // ==========================================

    const eventTitle =
        document.getElementById("eventTitle");


    if (eventTitle) {

        const urlParams =
            new URLSearchParams(window.location.search);

        const eventId =
            urlParams.get("id");


        if (!eventId) {

            eventTitle.textContent =
                "Event not found";

        } else {

            async function loadEventDetails() {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/events/${eventId}`
                        );


                    if (!response.ok) {
                        throw new Error("Event not found");
                    }


                    const event =
                        await response.json();


                    document.getElementById(
                        "eventTitle"
                    ).textContent =
                        event.title;


                    document.getElementById(
                        "eventDescription"
                    ).textContent =
                        event.description;


                    document.getElementById(
                        "eventCategory"
                    ).textContent =
                        event.category;


                    document.getElementById(
                        "eventDate"
                    ).textContent =
                        new Date(
                            event.date
                        ).toLocaleDateString();


                    document.getElementById(
                        "eventTime"
                    ).textContent =
                        event.time;


                    document.getElementById(
                        "eventVenue"
                    ).textContent =
                        event.venue;


                    document.getElementById(
                        "eventId"
                    ).textContent =
                        event.id;


                    document.getElementById(
                        "eventImage"
                    ).textContent =
                        event.category.toUpperCase();


                    // Register button

                    const registerButton =
                        document.getElementById(
                            "registerEventButton"
                        );


                    if (registerButton) {

                        registerButton.addEventListener(
                            "click",
                            async function () {

                                const storedUser =
                                    localStorage.getItem("user");


                                if (!storedUser) {

                                    alert(
                                        "Please login before registering for an event."
                                    );

                                    window.location.href =
                                        "login.html";

                                    return;

                                }


                                const user =
                                    JSON.parse(storedUser);


                                try {

                                    const registerResponse =
                                        await fetch(
                                            `${API_URL}/registrations`,
                                            {

                                                method: "POST",

                                                headers: {
                                                    "Content-Type":
                                                        "application/json"
                                                },

                                                body: JSON.stringify({

                                                    user_id:
                                                        user.id,

                                                    event_id:
                                                        event.id

                                                })

                                            }
                                        );


                                    const data =
                                        await registerResponse.json();


                                    if (!registerResponse.ok) {

                                        alert(
                                            data.message
                                        );

                                        return;

                                    }


                                    alert(
                                        "Successfully registered for the event!"
                                    );


                                } catch (error) {

                                    console.error(error);

                                    alert(
                                        "Unable to connect to the backend."
                                    );

                                }

                            }
                        );

                    }


                } catch (error) {

                    console.error(error);

                    document.getElementById(
                        "eventTitle"
                    ).textContent =
                        "Unable to load event";

                }

            }


            loadEventDetails();

        }

    }



    // ==========================================
    // MY EVENTS
    // ==========================================

    const myEventsContainer =
        document.getElementById("myEventsContainer");


    if (myEventsContainer) {

        async function loadMyEvents() {

            const storedUser =
                localStorage.getItem("user");


            // User is not logged in

            if (!storedUser) {

                myEventsContainer.innerHTML = `
                    <p>
                        Please login to view your registered events.
                    </p>

                    <a
                        href="login.html"
                        class="primary-button"
                    >
                        Login
                    </a>
                `;

                return;

            }


            const user =
                JSON.parse(storedUser);


            try {

                const response =
                    await fetch(
                        `${API_URL}/events/my/${user.id}`
                    );


                if (!response.ok) {
                    throw new Error(
                        "Failed to load events"
                    );
                }


                const events =
                    await response.json();


                displayMyEvents(events);


            } catch (error) {

                console.error(
                    "Error loading my events:",
                    error
                );


                myEventsContainer.innerHTML = `
                    <p>
                        Unable to load your registered events.
                    </p>
                `;

            }

        }


        function displayMyEvents(events) {

            myEventsContainer.innerHTML = "";


            if (
                !Array.isArray(events) ||
                events.length === 0
            ) {

                myEventsContainer.innerHTML = `
                    <p>
                        You have not registered for any events yet.
                    </p>

                    <a
                        href="events.html"
                        class="primary-button"
                    >
                        Browse Events
                    </a>
                `;

                return;

            }


            events.forEach(function (event) {

                const card =
                    document.createElement("div");


                card.className =
                    "registered-event-card";


                card.innerHTML = `

                    <div class="registered-event-header">

                        <span class="event-category">
                            ${event.category}
                        </span>

                        <span class="registration-status">
                            Registered
                        </span>

                    </div>


                    <h2>
                        ${event.title}
                    </h2>


                    <p>
                        ${event.description || ""}
                    </p>


                    <div class="registered-event-info">

                        <span>
                            📅 ${new Date(
                                event.date
                            ).toLocaleDateString()}
                        </span>

                        <span>
                            ⏰ ${event.time}
                        </span>

                        <span>
                            📍 ${event.venue}
                        </span>

                    </div>


                    <a
                        href="event-details.html?id=${event.id}"
                        class="secondary-button"
                    >
                        View Event
                    </a>

                `;


                myEventsContainer.appendChild(card);

            });

        }


        loadMyEvents();

    }

});