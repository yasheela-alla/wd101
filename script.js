let element = (id) => document.getElementById(id);
let classes = (cls) => document.getElementsByClassName(cls);

let user_entries = JSON.parse(localStorage.getItem("user_entries")) || [];

let username = element("name"),
  email = element("email"),
  password = element("password"),
  dob = element("dob"),
  tc = element("tc"),
  form = element("form");

let errormsg = classes("errormsg");

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
  let age = new Date().getFullYear() - new Date(dob.value).getFullYear();
  return age >= 18 && age <= 55;
}

const messages = {
  name: "Username must be at least 3 characters long",
  email: "Not a valid E-mail",
  dob: "Your age must be between 18 and 55 to continue",
  tc: "You must agree to the terms and conditions",
};

username.addEventListener("input", (e) => {
  e.preventDefault();
  verify(username, messages.name, username.value.length < 3);
});

email.addEventListener("input", (e) => {
  e.preventDefault();
  verify(email, messages.email, !(email.value.includes("@") && email.value.includes(".")));
});

dob.addEventListener("input", (e) => {
  e.preventDefault();
  verify(dob, messages.dob, !checkDOB());
});

tc.addEventListener("input", (e) => {
  e.preventDefault();
  verify(tc, messages.tc, !tc.checked);
});

function makeObject() {
  return {
    name: username.value,
    email: email.value,
    password: password.value,
    dob: dob.value,
    checked: tc.checked,
  };
}

function displayTable() {
  let table = element("user-table");
  let str = `<tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Dob</th>
                <th>Accepted terms?</th>
             </tr>\n`;

  user_entries.forEach((entry) => {
    str += `<tr>
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>${entry.password}</td>
                <td>${entry.dob}</td>
                <td>${entry.checked}</td>
            </tr>\n`;
  });

  table.innerHTML = str;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (tc.checked) {
    user_entries.push(makeObject());
    localStorage.setItem("user_entries", JSON.stringify(user_entries));
    displayTable();
  }
});

window.onload = displayTable;
