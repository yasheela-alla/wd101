document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registrationForm = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const dobInput = document.getElementById('dob');
    const termsCheckbox = document.getElementById('terms');
    const togglePassword = document.getElementById('togglePassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const termsLink = document.getElementById('termsLink');
    const usersContainer = document.getElementById('usersContainer');
    const usersTableBody = document.getElementById('usersTableBody');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const dobError = document.getElementById('dobError');
    const termsError = document.getElementById('termsError');
    
    // Modals
    const datePickerModal = document.getElementById('datePickerModal');
    const termsModal = document.getElementById('termsModal');
    const successModal = document.getElementById('successModal');
    const userDetails = document.getElementById('userDetails');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    // Date picker elements
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarDays = document.getElementById('calendarDays');
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Users array to store registered users
    let users = [];
    
    // Current date for date picker
    let currentDate = new Date();
    let selectedDate = null;
    
    // Initialize date picker
    initDatePicker();
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
    
    // Password strength meter
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        updatePasswordStrength(password);
    });
    
    // Open date picker on input click
    dobInput.addEventListener('click', function() {
        datePickerModal.style.display = 'block';
        renderCalendar(currentDate);
    });
    
    // Open terms modal on link click
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
    });
    
    // Close modals when clicking close button
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            datePickerModal.style.display = 'none';
            termsModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    // Close success modal button
    closeSuccessBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === datePickerModal) {
            datePickerModal.style.display = 'none';
        }
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Date picker navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
    
    // Month select change
    monthSelect.addEventListener('change', function() {
        currentDate.setMonth(parseInt(monthSelect.value));
        renderCalendar(currentDate);
    });
    
    // Year select change
    yearSelect.addEventListener('change', function() {
        currentDate.setFullYear(parseInt(yearSelect.value));
        renderCalendar(currentDate);
    });
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        resetErrors();
        
        // Validate form
        if (validateForm()) {
            // Calculate age
            const birthDate = new Date(selectedDate);
            const age = calculateAge(birthDate);
            
            // Create user object
            const user = {
                name: nameInput.value,
                email: emailInput.value,
                dateOfBirth: birthDate,
                age: age,
                termsAccepted: termsCheckbox.checked
            };
            
            // Add user to array
            users.push(user);
            
            // Update table
            updateUsersTable();
            
            // Show success modal with user details
            showSuccessModal(user);
            
            // Reset form
            registrationForm.reset();
            selectedDate = null;
            dobInput.value = '';
            passwordStrength.className = 'password-strength';
        }
    });
    
    // Initialize date picker
    function initDatePicker() {
        // Populate months
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        
        // Populate years (100 years back from current year)
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 100; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // Set current month and year
        monthSelect.value = currentDate.getMonth();
        yearSelect.value = currentDate.getFullYear();
    }
    
    // Render calendar
    function renderCalendar(date) {
        // Update month and year selects
        monthSelect.value = date.getMonth();
        yearSelect.value = date.getFullYear();
        
        // Clear calendar days
        calendarDays.innerHTML = '';
        
        // Get first day of month and last day of month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayIndex = firstDay.getDay();
        
        // Get days from previous month
        const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        
        // Get total days in current month
        const daysInMonth = lastDay.getDate();
        
        // Create calendar days
        let days = '';
        
        // Previous month days
        for (let i = firstDayIndex; i > 0; i--) {
            const day = prevMonthLastDay - i + 1;
            days += `<div class="day other-month" data-date="${date.getFullYear()}-${date.getMonth()}-${day}">${day}</div>`;
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            // Check if this day is selected
            const isSelected = selectedDate && 
                               selectedDate.getDate() === i && 
                               selectedDate.getMonth() === date.getMonth() && 
                               selectedDate.getFullYear() === date.getFullYear();
            
            days += `<div class="day ${isSelected ? 'selected' : ''}" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${i}">${i}</div>`;
        }
        
        // Next month days
        const daysAfter = 42 - (firstDayIndex + daysInMonth);
        for (let i = 1; i <= daysAfter; i++) {
            days += `<div class="day other-month" data-date="${date.getFullYear()}-${date.getMonth() + 2}-${i}">${i}</div>`;
        }
        
        calendarDays.innerHTML = days;
        
        // Add click event to days
        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', function() {
                // Remove selected class from all days
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                
                // Add selected class to clicked day
                this.classList.add('selected');
                
                // Get date from data attribute
                const dateStr = this.getAttribute('data-date');
                const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
                
                // Set selected date
                selectedDate = new Date(year, month - 1, day);
                
                // Format date for input
                dobInput.value = formatDate(selectedDate);
                
                // Close modal
                datePickerModal.style.display = 'none';
            });
        });
    }
    
    // Format date as MM/DD/YYYY
    function formatDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }
    
    // Calculate age from birth date
    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    // Update password strength indicator
    function updatePasswordStrength(password) {
        // Reset class
        passwordStrength.className = 'password-strength';
        
        if (password.length === 0) {
            return;
        }
        
        // Check password strength
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        let strength = 0;
        if (hasLetters) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChars) strength++;
        if (isLongEnough) strength++;
        
        // Update class based on strength
        if (strength <= 2) {
            passwordStrength.classList.add('weak');
        } else if (strength === 3) {
            passwordStrength.classList.add('medium');
        } else {
            passwordStrength.classList.add('strong');
        }
    }
    
    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Validate name (min 5 characters)
        if (nameInput.value.length < 5) {
            nameError.textContent = 'Username must be at least 5 characters';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate password (min 8 characters, letters and numbers)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(passwordInput.value)) {
            passwordError.textContent = 'Password must be at least 8 characters and contain both letters and numbers';
            isValid = false;
        }
        
        // Validate date of birth
        if (!selectedDate) {
            dobError.textContent = 'Please select your date of birth';
            isValid = false;
        } else {
            const age = calculateAge(selectedDate);
            if (age < 18 || age > 55) {
                dobError.textContent = 'You must be between 18 and 55 years old';
                isValid = false;
            }
        }
        
        // Validate terms acceptance
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must accept the terms and conditions';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Reset error messages
    function resetErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        dobError.textContent = '';
        termsError.textContent = '';
    }
    
    // Update users table
    function updateUsersTable() {
        // Show users container if there are users
        if (users.length > 0) {
            usersContainer.style.display = 'block';
        }
        
        // Clear table body
        usersTableBody.innerHTML = '';
        
        // Add users to table
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            row.appendChild(nameCell);
            
            // Email cell
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);
            
            // Age cell
            const ageCell = document.createElement('td');
            ageCell.textContent = user.age;
            row.appendChild(ageCell);
            
            // Terms cell
            const termsCell = document.createElement('td');
            termsCell.textContent = user.termsAccepted ? 'Accepted' : 'Declined';
            row.appendChild(termsCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            
            // View button
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn view-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.addEventListener('click', function() {
                showSuccessModal(user);
            });
            actionsCell.appendChild(viewBtn);
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', function() {
                // Remove user from array
                users = users.filter(u => u.email !== user.email);
                
                // Update table
                updateUsersTable();
                
                // Hide table if no users
                if (users.length === 0) {
                    usersContainer.style.display = 'none';
                }
            });
            actionsCell.appendChild(deleteBtn);
            
            row.appendChild(actionsCell);
            
            // Add row to table
            usersTableBody.appendChild(row);
        });
    }
    
    // Show success modal with user details
    function showSuccessModal(user) {
        // Create user details HTML
        userDetails.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Date of Birth:</strong> ${formatDate(user.dateOfBirth)}</p>
            <p><strong>Age:</strong> ${user.age}</p>
            <p><strong>Terms Accepted:</strong> ${user.termsAccepted ? 'Yes' : 'No'}</p>
        `;
        
        // Show modal
        successModal.style.display = 'block';
    }
});
