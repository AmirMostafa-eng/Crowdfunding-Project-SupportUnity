import { addNewCampaign } from './utils.js';

const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
// console.log(currentUser.role)
const campaignerSection = document.querySelector("section.campaigner");
const backerSection = document.querySelector("section.backer");

(currentUser.role === 'backer') ?
campaignerSection.style.display = 'none':
backerSection.style.display ='none';


let anonymosUser = document.querySelector("#anon");
let loggedUser = document.querySelector(".logged");
const navName = document.querySelector(".nav-name");


if (currentUser.name) {
//   anonymosUser.classList.remove("d-flex");
//   anonymosUser.style.display ='none' ;

  navName.textContent = currentUser.name;
  console.log(currentUser)

}else {
  loggedUser.style.display ='none' ;
}


document.getElementById("sign-out").addEventListener("click",function () {
  sessionStorage.removeItem("currentUser");
  window.open("../index.html","_self");
})

// =============================================================
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
            if (validateStep(currentStep)|| true) {
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
    // ============================

    const title = document.getElementById("productName");
    const category = document.getElementById("category");
    const descriptipon = document.getElementById("description");

    const goal = document.getElementById("target");
    const deadline = document.getElementById("deadline");
    const location = document.getElementById("location");

    let pledgesTitles ;
    let pledgesAmounts ; 
    let pledgesDescrirtions ; 

    const addRewardBtn = document.getElementById("add-reward");

    
    addRewardBtn.addEventListener("click" , function (event) {
        this.insertAdjacentHTML("beforebegin",
            `
            <div class="reward-tier">
            <div class="row g-2 mb-3">
                    <div class="col-md-3">
                        <input type="number" class="form-control amount" required placeholder="Amount ($)" min="1">
                    </div>
                    <div class="col-md-9">
                        <input type="text" class="form-control pledge-title" required placeholder="Reward Title (e.g., Early bird special)">
                    </div>
                    <div class="col-md-12">
                        <input type="text" class="form-control pledge-description" required placeholder="Reward description">
                    </div>
                </div>
            </div>
            `)
        pledgesTitles = document.querySelectorAll(".col-12 .pledge-title");
        pledgesAmounts = document.querySelectorAll(".col-12 .amount");
        pledgesDescrirtions = document.querySelectorAll(".col-12 .pledge-description");
    })
    const rewards = [];

    nextButtons[1].addEventListener("click",function () {
        for (const index in pledgesAmounts) {
            if (!isNaN(index)) {
                rewards.push(
                {
                    id : index ,
                    title: pledgesTitles[index].value,
                    amount: pledgesAmounts[index].value,
                    description: pledgesDescrirtions[index].value
                }
            )
            }
        }
    })

    // ============
        const fileInput = document.getElementById('image-upload');
        fileInput.style.display ='none';
        const preview = document.getElementById('image-preview');
        // const feedback = document.getElementById('feedback-message');

        // Preview image when selected
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    // Form submission
    document.getElementById('campaignForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const file = fileInput.files[0];
        const base64String = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });


        alert('Your campaign has been submitted for review! Our team will contact you within 48 hours.');
        addNewCampaign(title.value , currentUser.id ,goal.value ,deadline.value , descriptipon.value 
        , category.value , base64String , location.value , rewards)
    });
// });
// =============================



