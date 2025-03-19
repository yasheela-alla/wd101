const LOCAL_KEY = "user-entries";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const termsInput = document.getElementById("tac");
const entriesTable = document.getElementById("user-entries");

const setMinMaxForDob = () => {
  const today = new Date();

  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 55);
  const formattedMinDate = minDate.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18);
  const formattedMaxDate = maxDate.toISOString().split('T')[0];
  
  // Set the attributes on the input element
  dobInput.setAttribute("min", formattedMinDate);
  dobInput.setAttribute("max", formattedMaxDate);
};

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  email = email.trim().toLowerCase();
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const isValidAge = (dob) => {
  if (!dob) return false;
  
  const birthDate = new Date(dob);
  // Handle invalid dates
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.terms ? "true" : "false"}</td>`;
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

const validateForm = () => {
  // Validate email
  if (!isValidEmail(emailInput.value)) {
    return false;
  }
  
  // Validate DOB
  if (!isValidAge(dobInput.value)) {
    return false;
  }
  
  // Check that terms are accepted
  if (!termsInput.checked) {
    return false;
  }
  
  return true;
};

const onFormSubmit = (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const dob = dobInput.value;
  const terms = termsInput.checked;
  
  const user = { name, email, password, dob, terms };
  
  addUserToLocalStorage(user);
  addUserToEntriesTable(user);
  clearForm();
};

const setupForm = () => {
  setMinMaxForDob();
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", onFormSubmit);
  }
  populateInitialUsersInEntriesTable();
};

// Call setupForm when document is ready
document.addEventListener("DOMContentLoaded", setupForm);
