interface ContactFormData {
    name: string;
    email: string;
    contact: string;
    subject: string;
    msg: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    contact?: string;
    subject?: string;
    msg?: string;
}

class ContactForm {
    private form: HTMLFormElement;
    private submitBtn: HTMLButtonElement;
    private statusDiv: HTMLDivElement;

    constructor() {
        this.form = document.getElementById('contactForm') as HTMLFormElement;
        this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        this.statusDiv = document.getElementById('statusMessage') as HTMLDivElement;
        
        this.initializeForm();
    }

    private initializeForm(): void {
        this.form.addEventListener('submit', (e: Event) => this.handleSubmit(e));
    }

    private validateForm(data: ContactFormData): FormErrors {
        const errors: FormErrors = {};

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

    private showError(fieldName: string, message: string): void {
        const errorDiv = document.getElementById(`${fieldName}Error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    private clearErrors(): void {
        const errorDivs = document.querySelectorAll('.error-message');
        errorDivs.forEach(div => {
            (div as HTMLDivElement).style.display = 'none';
            (div as HTMLDivElement).textContent = '';
        });
    }

    private showStatus(message: string, isError: boolean = false): void {
        this.statusDiv.textContent = message;
        this.statusDiv.className = isError ? 'status-error' : 'status-success';
        this.statusDiv.style.display = 'block';

        setTimeout(() => {
            this.statusDiv.style.display = 'none';
        }, 5000);
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        this.clearErrors();
        this.submitBtn.disabled = true;

        const formData: ContactFormData = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            contact: (document.getElementById('contact') as HTMLInputElement).value,
            subject: (document.getElementById('subject') as HTMLInputElement).value,
            msg: (document.getElementById('message') as HTMLTextAreaElement).value
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
        } catch (error) {
            this.showStatus('Failed to submit form. Please try again.', true);
        } finally {
            this.submitBtn.disabled = false;
        }
    }
}

// initializing form...
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});