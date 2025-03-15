let element = (id) => document.getElementById(id);
let user_entries = JSON.parse(localStorage.getItem("user_entries")) || [];

let username = element("name"),
  email = element("email"),
  password = element("password"),
  dob = element("dob"),
  tc = element("terms"),
  form = element("registrationForm"),
  usersTableBody = element("usersTableBody");

// Error Messages
const messages = {
  name: "Username must be at least 3 characters long",
  email: "Not a valid E-mail",
  dob: "Your age must be between 18 and 55 to continue",
  tc: "You must agree to the terms and conditions",
};

// Form Validation
function verify(elem, message, condition) {
  if (condition) {
    elem.style.border = "2px solid red";
    elem.setCustomValidity(message);
    elem.reportValidity();
  } else {
    elem.style.border = "2px solid green";
    elem.setCustomValidity("");
  }
}

function checkDOB() {
  let birthDate = new Date(dob.value);
  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  let monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 55;
}

// Input Listeners
username.addEventListener("input", () => verify(username, messages.name, username.value.length < 3));
email.addEventListener("input", () => verify(email, messages.email, !(email.value.includes("@") && email.value.includes("."))));
dob.addEventListener("input", () => verify(dob, messages.dob, !checkDOB()));
tc.addEventListener("change", () => verify(tc, messages.tc, !tc.checked));

// Function to create user object
function makeObject() {
  return {
    name: username.value,
    email: email.value,
    password: password.value,
    dob: dob.value,
    checked: tc.checked ? "Yes" : "No",
  };
}

// Function to display registered users in the table
function displayTable() {
  usersTableBody.innerHTML = ""; // Clear previous data
  user_entries.forEach((entry, index) => {
    let row = `<tr>
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>${entry.dob}</td>
                <td>${entry.checked}</td>
                <td><button onclick="deleteUser(${index})">Delete</button></td>
              </tr>`;
    usersTableBody.innerHTML += row;
  });
}

// Function to delete user
function deleteUser(index) {
  user_entries.splice(index, 1);
  localStorage.setItem("user_entries", JSON.stringify(user_entries));
  displayTable();
}

// Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (tc.checked && checkDOB()) {
    user_entries.push(makeObject());
    localStorage.setItem("user_entries", JSON.stringify(user_entries));
    displayTable();
    form.reset();
    dob.value = ""; // Reset DOB field
  }
});

// Open Calendar Modal
dob.addEventListener("click", () => {
  element("datePickerModal").style.display = "block";
});

// Close Calendar Modal
document.querySelectorAll(".close").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal").forEach((modal) => (modal.style.display = "none"));
  });
});

// Populate Calendar Days Dynamically
function populateCalendarDays(year, month) {
  const daysContainer = document.getElementById('calendarDays');
  
  daysContainer.innerHTML = ''; // Clear previous days
  
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // Day of the week for the first day of the month
  const daysInMonth = new Date(year, month, 0).getDate(); // Total days in the month
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptySlot = document.createElement('div');
    emptySlot.classList.add('empty');
    daysContainer.appendChild(emptySlot);
  }
  
  // Add actual day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    
    // Add click event to select a date
    dayElement.addEventListener('click', () => selectDateFromCalendar(year, month, day));
    
    daysContainer.appendChild(dayElement);
  }
}

// Select Date from Calendar
function selectDateFromCalendar(year, month, day) {
   dob.value = `${year}-${padZero(month)}-${padZero(day)}`;
   element("datePickerModal").style.display = "none"; // Close modal after selection
}

// Pad single-digit numbers with a leading zero
function padZero(value) {
   return value.toString().padStart(2, '0');
}

// Populate Month and Year Selects
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');

for (let year = new Date().getFullYear(); year >= new Date().getFullYear() - 100; year--) {
   const option = document.createElement('option');
   option.value = year;
   option.textContent = year;
   yearSelect.appendChild(option);
}

for (let month = 1; month <= 12; month++) {
   const option = document.createElement('option');
   option.value = month;
   option.textContent = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
   monthSelect.appendChild(option);
}

// Update Calendar Days on Month or Year Change
yearSelect.addEventListener('change', () => populateCalendarDays(yearSelect.value, monthSelect.value));
monthSelect.addEventListener('change', () => populateCalendarDays(yearSelect.value, monthSelect.value));

// Initialize table and calendar on page load
window.onload = () => {
   displayTable();
   populateCalendarDays(new Date().getFullYear(), new Date().getMonth() + 1); // Default to current date
};
