//  Custom JavaScript for tab navigation 
document.addEventListener('DOMContentLoaded', function () {
    // Handle next tab button clicks
    document.querySelectorAll('.next-tab').forEach(button => {
        button.addEventListener('click', function () {
            const nextTabId = this.getAttribute('data-next-tab');
            const nextTab = document.querySelector(`#${nextTabId}`);
            const tabInstance = new bootstrap.Tab(nextTab);
            tabInstance.show();
        });
    });

    // Handle previous tab button clicks
    document.querySelectorAll('.prev-tab').forEach(button => {
        button.addEventListener('click', function () {
            const prevTabId = this.getAttribute('data-prev-tab');
            const prevTab = document.querySelector(`#${prevTabId}`);
            const tabInstance = new bootstrap.Tab(prevTab);
            tabInstance.show();
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate all required fields
        if (!validateForm()) {
            return false; // Prevent form submission
        }

        // If validation passes, submit the form
        this.submit();
    });

    function validateForm() {
        let isValid = true;

        // Personal Info Tab
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const age = document.getElementById('age');
        const gender = document.getElementById('gender');
        const nin = document.getElementById('nin');

        // Contact Details Tab
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');

        // Account Settings Tab
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');

        // Clear previous errors
        clearAllErrors();

        // Validate Personal Info
        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
            isValid = false;
        }

        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
            isValid = false;
        }

        if (!age.value) {
            showError(age, 'Age is required');
            isValid = false;
        } else if (age.value < 18 || age.value > 30) {
            showError(age, 'Age must be between 18 and 30');
            isValid = false;
        }

        if (!gender.value) {
            showError(gender, 'Please select a gender');
            isValid = false;
        }

        if (!nin.value.trim()) {
            showError(nin, 'National ID is required');
            isValid = false;
        }

        // Validate Contact Details
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }

        if (!phone.value.trim()) {
            showError(phone, 'Phone number is required');
            isValid = false;
        }

        if (!address.value.trim()) {
            showError(address, 'Address is required');
            isValid = false;
        }

        // Validate Account Settings
        if (!password.value) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        if (!confirmPassword.value) {
            showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (!terms.checked) {
            showError(terms, 'You must agree to the terms');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        const formControl = input.closest('.mb-3') || input.closest('.form-check');
        if (!formControl) return;

        let errorElement = formControl.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1';
            formControl.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    // Real-time password matching
    document.getElementById('confirmPassword').addEventListener('input', function () {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;

        if (password && confirmPassword && password !== confirmPassword) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });

    function clearError(input) {
        const formControl = input.closest('.mb-3') || input.closest('.form-check');
        if (!formControl) return;

        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('is-invalid');
    }
});