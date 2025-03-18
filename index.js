const LOCAL_KEY = "user-entries";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const termsInput = document.getElementById("tac");
const entriesTable = document.getElementById("user-entries");

// Improved date validation
const setupDateValidation = () => {
  const today = new Date();
  const minAge = 18;
  const maxAge = 55;
  
  // Calculate min and max dates based on age limits
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  
  dobInput.addEventListener('blur', function() {
    if (this.value) {
      const selectedDate = new Date(this.value);
      
      if (isNaN(selectedDate.getTime())) {
        alert('Please enter a valid date.');
        return;
      }
      
      if (selectedDate < minDate || selectedDate > maxDate) {
        alert('Date of birth must be between ages 18 and 55.');
        this.value = ''; // Clear the input field
      }
    }
  });
};

const isValidEmail = (email) => {
  email = email.trim().toLowerCase();
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(email);
};

// Improved age validation 
const isValidAge = (dob) => {
  if (!dob) return false;
  
  const today = new Date();
  const birthDate = new Date(dob);
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) return false;
  
  birthDate.setHours(0, 0, 0, 0);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 55;
};

const addUserToEntriesTable = (user) => {
  const tableContent = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${user.dob}</td>
        <td>true</td>
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
  
  // Double-check age 
  if (!isValidAge(dob)) {
    alert("Applicants must be between 18 and 55 years old!");
    return;
  }
  
  if (!termsInput.checked) {
    alert("You must accept the terms and conditions!");
    return;
  }
  
  const user = { name, email, password, dob };
  addUserToLocalStorage(user);
  addUserToEntriesTable(user);
  clearForm();
};

setupDateValidation();
populateInitialUsersInEntriesTable();

// Connect the form submission handler
document.getElementById("registration-form").addEventListener("submit", onFormSubmit);
