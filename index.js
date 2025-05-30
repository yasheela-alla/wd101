document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const dobElement = document.getElementById("dob");
  const emailElement = document.getElementById("email");

  // Set min/max attributes for DOB (18–55 years)
  const currentDate = new Date();
  const youngestDate = new Date();
  youngestDate.setFullYear(currentDate.getFullYear() - 18);
  const oldestDate = new Date();
  oldestDate.setFullYear(currentDate.getFullYear() - 55);

  const minDateString = oldestDate.toISOString().split("T")[0];
  const maxDateString = youngestDate.toISOString().split("T")[0];

  dobElement.setAttribute("min", minDateString);
  dobElement.setAttribute("max", maxDateString);

  // Validate email on input
  emailElement.addEventListener("input", () => validateEmail(emailElement));
  
  function validateEmail(element) {
    element.setCustomValidity(""); // Clear previous validation
    if (!element.value.trim()) {
      element.setCustomValidity("Email is required");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(element.value)) {
      element.setCustomValidity("Please enter a valid email address");
      return false;
    }
    return true;
  }

  // Validate DOB on input
  dobElement.addEventListener("input", () => validateDOB(dobElement));
  
  function validateDOB(element) {
    element.setCustomValidity(""); // Clear previous validation
    if (!element.value) {
      element.setCustomValidity("Date of Birth is required");
      return false;
    }
    
    const inputDate = new Date(element.value);
    const today = new Date();
    
    // Calculate age more accurately
    let age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
      age--;
    }

    if (age < 18 || age > 55) {
      element.setCustomValidity("Age must be between 18 and 55 years");
      return false;
    }
    return true;
  }

  // Get stored entries from localStorage
  function getEntries() {
    const entriesJson = localStorage.getItem("user-entries");
    return entriesJson ? JSON.parse(entriesJson) : [];
  }

  let userEntries = getEntries();

  // Display entries in the table
  function displayEntries() {
    const tbody = document.getElementById("userTableBody");

    if (!userEntries.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">No entries yet</td>
        </tr>
      `;
      return;
    }

    const tableContent = userEntries
      .map(
        (entry) => `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-center">${entry.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">${entry.email}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">${entry.password}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">${entry.date}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">${entry.acceptTerms}</td>
        </tr>
      `
      )
      .join("");

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

    // Validate name
    if (!nameValue.trim()) {
      document.getElementById("name").setCustomValidity("Name is required");
      document.getElementById("name").reportValidity();
      return;
    } else {
      document.getElementById("name").setCustomValidity("");
    }

    // Validate email
    const isEmailValid = validateEmail(emailElement);
    if (!isEmailValid) {
      emailElement.reportValidity();
      return;
    }

    // Validate password
    if (!passwordValue.trim()) {
      document.getElementById("password").setCustomValidity("Password is required");
      document.getElementById("password").reportValidity();
      return;
    } else {
      document.getElementById("password").setCustomValidity("");
    }

    // Validate DOB
    const isDOBValid = validateDOB(dobElement);
    if (!isDOBValid) {
      dobElement.reportValidity();
      return;
    }

    // Create entry object
    const newEntry = {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      date: dobValue,
      acceptTerms: termsAccepted, // Store true/false based on checkbox state
    };

    // Add to entries array
    userEntries.push(newEntry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));

    displayEntries();
    event.target.reset();
  }

  // Attach form submission handler
  form.addEventListener("submit", onFormSubmit);

  // Initialize the table when page loads
  displayEntries();
});
