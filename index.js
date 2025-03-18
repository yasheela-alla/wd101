const LOCAL_KEY = "user-entries";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const termsInput = document.getElementById("tac");
const entriesTable = document.getElementById("user-entries");

const setMinMaxForDob = () => {
  const today = new Date();
  
  // For minimum date (oldest allowed - 55 years ago)
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 55);
  const formattedMinDate = minDate.toISOString().split('T')[0];
  
  // For maximum date (youngest allowed - 18 years ago)
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18);
  const formattedMaxDate = maxDate.toISOString().split('T')[0];
  
  // Set the attributes on the input element
  dobInput.setAttribute("min", formattedMinDate);
  dobInput.setAttribute("max", formattedMaxDate);
};

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  } 
  email = email.trim().toLowerCase();
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.length > 254) {
    return false;
  }
  if (email.includes('..')) {
    return false;
  }
  const parts = email.split('@');
  if (parts[0].length > 64) {
    return false;
  }
  return emailPattern.test(email);
};

const isValidAge = (dob) => {
  if (!dob) return false;
  
  const birthDate = new Date(dob);
  // Handle invalid dates
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Check if age is between 18 and 55 (inclusive)
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
  let isValid = true;
  
  // Validate email
  if (!isValidEmail(emailInput.value)) {
    isValid = false;
    alert("Invalid email address!");
    return false;
  }
  
  // Validate DOB (within range) - using our more robust age validation function
  if (!isValidAge(dobInput.value)) {
    isValid = false;
    alert("Applicants must be between 18 and 55 years old!");
    return false;
  }
  
  // Check that terms are accepted
  if (!termsInput.checked) {
    isValid = false;
    alert("You must accept the terms and conditions!");
    return false;
  }
  
  return isValid;
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

// Function to initialize the form
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
