"use strict";
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.statusDiv = document.getElementById('statusMessage');
        this.initializeForm();
    }
    initializeForm() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    validateForm(data) {
        const errors = {};
        // validation of the feilds..
        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'Please enter a valid email address';
        }
        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(data.contact)) {
            errors.contact = 'Contact number must be 10 digits';
        }
        if (!data.subject.trim()) {
            errors.subject = 'Subject is required';
        }
        if (data.msg.trim().length < 10) {
            errors.msg = 'Message must be at least 10 characters long';
        }
        return errors;
    }
    showError(fieldName, message) {
        const errorDiv = document.getElementById(`${fieldName}Error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
    clearErrors() {
        const errorDivs = document.querySelectorAll('.error-message');
        errorDivs.forEach(div => {
            div.style.display = 'none';
            div.textContent = '';
        });
    }
    showStatus(message, isError = false) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = isError ? 'status-error' : 'status-success';
        this.statusDiv.style.display = 'block';
        setTimeout(() => {
            this.statusDiv.style.display = 'none';
        }, 5000);
    }
    async handleSubmit(e) {
        e.preventDefault();
        this.clearErrors();
        this.submitBtn.disabled = true;
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            contact: document.getElementById('contact').value,
            subject: document.getElementById('subject').value,
            msg: document.getElementById('message').value
        };
        const errors = this.validateForm(formData);
        if (Object.keys(errors).length > 0) {
            // Display validation errors
            for (const [field, message] of Object.entries(errors)) {
                this.showError(field, message);
            }
            this.submitBtn.disabled = false;
            return;
        }
        try {
            const response = await fetch('https://6716377633bc2bfe40bceffb.mockapi.io/formdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Submission failed');
            }
            this.showStatus('Form submitted successfully!');
            this.form.reset();
        }
        catch (error) {
            this.showStatus('Failed to submit form. Please try again.', true);
        }
        finally {
            this.submitBtn.disabled = false;
        }
    }
}
// initializing form...
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
