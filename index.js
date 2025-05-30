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
    const minAgeDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (inputDate > maxAgeDate || inputDate <= minAgeDate) {
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

    // Validate inputs
    const isEmailValid = validateEmail(emailElement);
    const isDOBValid = validateDOB(dobElement);

    if (!nameValue.trim()) {
      document.getElementById("name").setCustomValidity("Name is required");
      document.getElementById("name").reportValidity();
      return;
    } else {
      document.getElementById("name").setCustomValidity("");
    }

    if (!isEmailValid) {
      emailElement.reportValidity();
      return;
    }

    if (!isDOBValid) {
      dobElement.reportValidity();
      return;
    }

    if (!termsAccepted) {
      document.getElementById("acceptTerms").setCustomValidity("You must accept the terms");
      document.getElementById("acceptTerms").reportValidity();
      return;
    } else {
      document.getElementById("acceptTerms").setCustomValidity("");
    }

    // Create entry object
    const newEntry = {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      date: dobValue,
      acceptTerms: termsAccepted,
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
