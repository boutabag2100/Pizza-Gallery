document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employmentForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    let currentStep = 1;

    // Next button handler
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateForm();
            }
        });
    });

    // Previous button handler
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateForm();
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Only validate the current step
        if (validateStep(currentStep)) {
            try {
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                const templateParams = {
                    to_name: "Pizza Gallery",
                    from_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    age16: document.getElementById('age16').checked ? "Yes" : "No",
                    age18: document.getElementById('age18').checked ? "Yes" : "No",
                    contactPermission: document.getElementById('contactPermission').checked ? "Yes" : "No",
                    position: document.getElementById('position').value,
                    experience: document.getElementById('experience').value || "None provided",
                    startDate: document.getElementById('startDate').value,
                    message: `New application for ${document.getElementById('position').value} position`
                };

                console.log('Sending email with parameters:', templateParams);

                const response = await emailjs.send(
                    'service_hks3x8a',
                    'template_rjnk7pq',
                    templateParams
                );

                console.log('SUCCESS!', response.status, response.text);
                showMessage('Application submitted successfully! We will contact you soon.', 'success');
                form.reset();
                currentStep = 1;
                updateForm();

            } catch (error) {
                console.error('FAILED...', error);
                showMessage('There was an error submitting your application. Please try again.', 'error');
            } finally {
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
            }
        }
    });

    function validateStep(step) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let valid = true;

        clearMessages();

        // Special validation for step 1 (age verification)
        if (step === 1) {
            const age16Checkbox = document.getElementById('age16');
            const age18Checkbox = document.getElementById('age18');

            if (!age16Checkbox.checked && !age18Checkbox.checked) {
                showMessage('You must be at least 16 years old to apply.', 'error');
                age16Checkbox.closest('.checkbox-field').classList.add('error');
                age18Checkbox.closest('.checkbox-field').classList.add('error');
                valid = false;
            }
        }

        // Only validate visible required fields in current step
        requiredFields.forEach(field => {
            if (!field.value && field.closest('.form-step').classList.contains('active')) {
                valid = false;
                field.classList.add('error');
                showMessage(`Please fill in ${field.previousElementSibling.textContent}`, 'error');
            } else {
                field.classList.remove('error');
            }
        });

        return valid;
    }

    function updateForm() {
        steps.forEach(step => {
            step.classList.remove('active');
            if (step.dataset.step == currentStep) {
                step.classList.add('active');
            }
        });

        progressSteps.forEach(step => {
            step.classList.remove('active');
            if (step.dataset.step <= currentStep) {
                step.classList.add('active');
            }
        });
    }

    function showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.employment-container');
        container.insertBefore(messageDiv, document.querySelector('.form-header').nextSibling);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    function clearMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => message.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
});
