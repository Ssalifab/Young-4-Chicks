document.addEventListener('DOMContentLoaded', function () {
    // Tab navigation remains unchanged
    document.querySelectorAll('.next-tab').forEach(button => {
        button.addEventListener('click', function () {
            const nextTabId = this.getAttribute('data-next-tab');
            const nextTab = document.querySelector(`#${nextTabId}`);
            const tabInstance = new bootstrap.Tab(nextTab);
            tabInstance.show();
        });
    });

    document.querySelectorAll('.prev-tab').forEach(button => {
        button.addEventListener('click', function () {
            const prevTabId = this.getAttribute('data-prev-tab');
            const prevTab = document.querySelector(`#${prevTabId}`);
            const tabInstance = new bootstrap.Tab(prevTab);
            tabInstance.show();
        });
    });

    // Form submission handling - MODIFIED VERSION
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            // Only prevent default if validation fails
            if (!validateForm()) {
                e.preventDefault();
                // Scroll to first error
                const firstError = document.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            // Otherwise let form submit normally
        });

        // Real-time validation for better UX
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // Only validate visible fields in current tab
        const currentTab = document.querySelector('.tab-pane.active');
        const fieldsToValidate = currentTab.querySelectorAll('[required], .validate-me');

        fieldsToValidate.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        const fieldId = field.id;

        // Clear previous error
        clearError(field);

        // Field-specific validation
        if (field.required && !value) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            switch(fieldId) {
                case 'firstName':
                case 'lastName':
                    if (value.length < 2) {
                        showError(field, 'Must be at least 2 characters');
                        isValid = false;
                    }
                    break;
                case 'age':
                    if (value < 18 || value > 30) {
                        showError(field, 'Age must be 18-30');
                        isValid = false;
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        showError(field, 'Invalid email format');
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if (!/^[\d\s+-]{10,}$/.test(value)) {
                        showError(field, 'Invalid phone number');
                        isValid = false;
                    }
                    break;
                case 'password':
                    if (value.length < 8) {
                        showError(field, 'Password must be 8+ characters');
                        isValid = false;
                    }
                    break;
                case 'confirmPassword':
                    const password = document.getElementById('password').value;
                    if (value !== password) {
                        showError(field, 'Passwords must match');
                        isValid = false;
                    }
                    break;
            }
        }

        return isValid;
    }

    // Helper functions remain the same
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

    function clearError(input) {
        const formControl = input.closest('.mb-3') || input.closest('.form-check');
        if (!formControl) return;

        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('is-invalid');
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }
});