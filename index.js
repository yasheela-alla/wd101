const LOCAL_KEY = "user-entries";

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const termsInput = document.getElementById("tac");
const entriesTable = document.getElementById("user-entries");

const setMinMaxForDob = () => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);
  
  dobInput.setAttribute("min", minDate);
  dobInput.setAttribute("max", maxDate);
};

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

const isValidAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 55;
};

const addUserToEntriesTable = (user) => {
  const tableContent = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.password}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.dob}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">true</td>
    `;
  const tableRow = document.createElement("tr");
  tableRow.innerHTML = tableContent;
  
  const tableBody = entriesTable.getElementsByTagName("tbody")[0];
  tableBody.appendChild(tableRow);
};

const addUserToLocalStorage = (user) => {
  const users = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  users.push(user);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
};

const getUsersFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
};

const populateInitialUsersInEntriesTable = () => {
  const users = getUsersFromLocalStorage();
  users.forEach(addUserToEntriesTable);
};

const clearForm = () => {
  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  dobInput.value = "";
  termsInput.checked = false;
};

const onFormSubmit = (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const dob = dobInput.value;

  if (!isValidEmail(email)) {
    alert("Invalid email address!");
    return;
  }

  if (!isValidAge(dob)) {
    alert("Applicants must be between 18 and 55 years old!");
    return;
  }

  const user = { name, email, password, dob };
  addUserToLocalStorage(user);
  addUserToEntriesTable(user);
  clearForm();
};

setMinMaxForDob();
populateInitialUsersInEntriesTable();
