// Form Step Navigation
// document.addEventListener('DOMContentLoaded', function() {
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const progressConnector = document.querySelector('.progress-connector');
    
    // Initialize first step
    showStep(1);
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.form-step').dataset.step);
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                showStep(nextStep);
                updateProgress(nextStep);
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            showStep(prevStep);
            updateProgress(prevStep);
        });
    });
    
    // Show specific step
    function showStep(stepNumber) {
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNumber) {
                step.classList.add('active');
            }
        });
    }
    
    // Update progress bar
    function updateProgress(stepNumber) {
        const percentage = ((stepNumber - 1) / (progressSteps.length - 1)) * 100;
        progressConnector.style.width = `${percentage}%`;
        
        progressSteps.forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Basic step validation
    function validateStep(stepNumber) {
        let isValid = true;
        const currentStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        
        // Check required fields in current step
        const requiredFields = currentStep.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            currentStep.querySelector('.is-invalid').focus();
        }
        
        return isValid;
    }
    
    // Form submission
    document.getElementById('campaignForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your campaign has been submitted for review! Our team will contact you within 48 hours.');
        // In a real app, you would send data to your backend here
    });
// });
