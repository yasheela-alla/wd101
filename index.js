document.addEventListener("DOMContentLoaded", function() {
  const dobElement = document.getElementById("dob");
  
  // Calculate valid date range based on age requirements (18-55)
  const currentDate = new Date();
  const youngestDate = new Date();
  youngestDate.setFullYear(currentDate.getFullYear() - 18);
  const oldestDate = new Date();
  oldestDate.setFullYear(currentDate.getFullYear() - 55);
  
  const minDateString = oldestDate.toISOString().split("T")[0];
  const maxDateString = youngestDate.toISOString().split("T")[0];
  
  // Set attributes on the date input
  dobElement.setAttribute("min", minDateString);
  dobElement.setAttribute("max", maxDateString);
});

// Get stored entries from localStorage
function getEntries() {
  const entriesJson = localStorage.getItem("user-entries");
  return entriesJson ? JSON.parse(entriesJson) : [];
}

let userEntries = getEntries();

// Display entries in the table
function displayEntries() {
  const entriesTable = document.getElementById("user-entries");
  const tbody = entriesTable.querySelector("tbody");
  
  if (!userEntries.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-4 text-center text-gray-500">No entries yet</td>
      </tr>
    `;
    return;
  }
  
  const tableContent = userEntries.map(entry => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-center">${entry.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-center">${entry.email}</td>
      <td class="px-6 py-4 whitespace-nowrap text-center">${entry.password}</td>
      <td class="px-6 py-4 whitespace-nowrap text-center">${entry.date}</td>
      <td class="px-6 py-4 whitespace-nowrap text-center">${entry.acceptTerms}</td>
    </tr>
  `).join('');
  
  // Update the table
  tbody.innerHTML = tableContent;
}

// Form submission handler
function onFormSubmit(event) {
  event.preventDefault();
  
  // Collect form data
  const nameValue = document.getElementById("name").value;
  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;
  const dobValue = document.getElementById("dob").value;
  const termsAccepted = document.getElementById("acceptTerms").checked;
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailValue)) {
    alert("Please enter a valid email address");
    return;
  }
  
  // Validate age
  const birthDate = new Date(dobValue);
  const today = new Date();
  
  // Calculate age
  let ageYears = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    ageYears--;
  }
  
  // Ensure age is within required range
  if (ageYears < 18 || ageYears > 55) {
    alert("Age must be between 18 and 55 years");
    return;
  }
  
  // Create entry object
  const newEntry = {
    name: nameValue,
    email: emailValue,
    password: passwordValue,
    date: dobValue,
    acceptTerms: termsAccepted
  };
  
  // Add to entries array
  userEntries.push(newEntry);
  localStorage.setItem("user-entries", JSON.stringify(userEntries));
  
  displayEntries();
  event.target.reset();
}

// Initialize the table when page loads
document.addEventListener("DOMContentLoaded", function() {
  displayEntries();
});
