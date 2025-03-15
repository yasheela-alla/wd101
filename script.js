let element = (id) => document.getElementById(id);
let classes = (cls) => document.getElementsByClassName(cls);

let user_entries = JSON.parse(localStorage.getItem("user_entries")) || [];

let username = element("name"),
  email = element("email"),
  password = element("password"),
  dob = element("dob"),
  tc = element("terms"), // Fixed ID reference
  form = element("registrationForm"),
  registerBtn = element("registerBtn"),
  usersTableBody = element("usersTableBody");

// Error Messages
const messages = {
  name: "Username must be at least 3 characters long",
  email: "Not a valid E-mail",
  dob: "Your age must be between 18 and 55 to continue",
  tc: "You must agree to the terms and conditions",
};

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
  let age = new Date().getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 55;
}

// Event Listeners
username.addEventListener("input", () => verify(username, messages.name, username.value.length < 3));
email.addEventListener("input", () => verify(email, messages.email, !(email.value.includes("@") && email.value.includes("."))));
dob.addEventListener("click", () => element("datePickerModal").style.display = "block"); // Open Calendar Modal
tc.addEventListener("change", () => verify(tc, messages.tc, !tc.checked));

// Create User Object
function makeObject() {
  return {
    name: username.value,
    email: email.value,
    password: password.value,
    dob: dob.value,
    checked: tc.checked,
  };
}

// Display Users Table
function displayTable() {
  usersTableBody.innerHTML = "";
  user_entries.forEach((entry, index) => {
    let row = `<tr>
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>${entry.dob}</td>
                <td>${entry.checked ? "Yes" : "No"}</td>
                <td><button onclick="deleteUser(${index})">Delete</button></td>
              </tr>`;
    usersTableBody.innerHTML += row;
  });
}

// Delete User
function deleteUser(index) {
  user_entries.splice(index, 1);
  localStorage.setItem("user_entries", JSON.stringify(user_entries));
  displayTable();
}

// Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!tc.checked) {
    verify(tc, messages.tc, true);
    return;
  }
  user_entries.push(makeObject());
  localStorage.setItem("user_entries", JSON.stringify(user_entries));
  displayTable();
});

// Close Modals
document.querySelectorAll(".close").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal").forEach((modal) => (modal.style.display = "none"));
  })
);

// Initialize Table
window.onload = displayTable;
