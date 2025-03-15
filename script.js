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
  let birthDate = new Date(dob.value),
    today = new Date(),
    age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18 && age <= 55;
}

const messages = {
  name: "Username must be at least 3 characters long",
  email: "Not a valid E-mail",
  dob: "Your age must be between 18 and 55 to continue",
  tc: "You must agree to the terms and conditions",
};

username.addEventListener("input", () => {
  verify(username, messages.name, username.value.length < 3);
});

email.addEventListener("input", () => {
  verify(email, messages.email, !(email.value.includes("@") && email.value.includes(".")));
});

dob.addEventListener("input", () => {
  verify(dob, messages.dob, !checkDOB());
});

tc.addEventListener("change", () => {
  if (!tc.checked) {
    alert(messages.tc);
  }
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
  let table = element("user-table"),
    str = `<tr>
             <th>Name</th>
             <th>Email</th>
             <th>Password</th>
             <th>Dob</th>
             <th>Accepted terms?</th>
           </tr>\n`;

  if (user_entries.length > 0) {
    user_entries.forEach((entry) => {
      str += `<tr>
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>${entry.password}</td>
                <td>${entry.dob}</td>
                <td>${entry.checked ? "Yes" : "No"}</td>
              </tr>\n`;
    });
  } else {
    str += `<tr><td colspan="5" style="text-align:center;">No entries found</td></tr>`;
  }

  table.innerHTML = str;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (tc.checked && checkDOB()) {
    user_entries.push(makeObject());
    localStorage.setItem("user_entries", JSON.stringify(user_entries));
    displayTable();
    form.reset();
  } else {
    alert("Please fix errors before submitting.");
  }
});

window.onload = displayTable;
