let element = (id) => document.getElementById(id);
let classes = (cls) => document.getElementsByClassName(cls);

let user_entries = JSON.parse(localStorage.getItem("user_entries")) || [];

let username = element("name"),
  email = element("email"),
  password = element("password"),
  dob = element("dob"),
  tc = element("terms"), // Corrected checkbox ID
  form = element("registrationForm"), // Corrected form ID
  registerBtn = element("registerBtn"),
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

// Open Terms and Conditions Modal
element("termsLink").addEventListener("click", (e) => {
  e.preventDefault();
  element("termsModal").style.display = "block";
});

// Close Success Modal
element("closeSuccessBtn").addEventListener("click", () => {
  element("successModal").style.display = "none";
});

// Initialize table on page load
window.onload = displayTable;
