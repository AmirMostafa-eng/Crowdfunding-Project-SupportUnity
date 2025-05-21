  // Global variables
const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
if (!currentUser.name) {
  window.open("../pages/login.html" , '_self');
}
document.querySelector(".nav-name").textContent = currentUser.name ;

document.getElementById("sign-out").addEventListener("click",function () {
  sessionStorage.removeItem("currentUser");
  window.open("../index.html","_self");
})

let campaignData = [];
let currentPage = 1;
const campaignsPerPage = 3;
let filteredCampaigns = [];

// Function to fetch campaign data 
async function fetchCampaignData() {
    try {
        const response = await fetch('../db.json');
        if (!response.ok) {
            throw new Error('Failed to fetch campaign data');
        }
        campaignData = await response.json();
        filteredCampaigns = [...campaignData.campaigns];
        filterAndSortCampaigns();
    } catch (error) {
        console.error('Error loading campaign data:', error);
        document.getElementById('campaigns-container').innerHTML = `
            <div class="alert alert-danger">
                Failed to load campaigns. Please try again later.
            </div>
        `;
    }
}

// Function to calculate days left until deadline
function getDaysLeft(deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

// Function to calculate funding percentage
function getFundingPercentage(current, goal) {
    return Math.min(Math.round((current / goal) * 100), 100);
}

// Function to format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString();
}

// Function to generate random backers count

// Function to render campaigns for a specific page
function renderCampaigns(page) {
    const container = document.getElementById('campaigns-container');
    container.innerHTML = '';
    
    // Calculate start and end index for current page
    const startIndex = (page - 1) * campaignsPerPage;
    const endIndex = startIndex + campaignsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);
    
    // Update campaign count
    document.getElementById('campaign-count').textContent = `${filteredCampaigns.length} Active Campaigns`;
    
    if (paginatedCampaigns.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><h4>No campaigns found matching your criteria</h4></div>';
        return;
    }
    
    paginatedCampaigns.forEach(campaign => {
        const percentage = getFundingPercentage(campaign.currentAmount, campaign.goal);
        const daysLeft = getDaysLeft(campaign.deadline);
        const backers = campaign.numOfBackers || getRandomBackers();
        
        const campaignElement = document.createElement('div');
        campaignElement.className = 'fullwidth-campaign';
        campaignElement.innerHTML = `
            <div class="campaign-row">
                <div class="campaign-image-col position-relative">
                    <div class="campaign-badge">${campaign.category}</div>
                    <img src="${campaign.imageUrl || "../asstes/Campaign 1.webp"}" alt="${campaign.title}" class="campaign-img">
                </div>
                <div class="campaign-content-col">
                    <span style="display: none;">${campaign.id}</span>
                    <h2 class="campaign-title">${campaign.title}</h2>
                    <p class="campaign-desc">${campaign.description}</p>
                    
                    <div class="campaign-progress">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                    </div>
                    
                    <div class="campaign-stats">
                        <div>
                            <span class="stat-value">${formatCurrency(campaign.currentAmount)}</span>
                            <span class="stat-label">raised of ${formatCurrency(campaign.goal)}</span>
                        </div>
                        <div>
                            <span class="stat-value">${percentage}%</span>
                        </div>
                    </div>
                    
                    <div class="campaign-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${daysLeft} days left</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${backers} backers</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${campaign.location}</span>
                        </div>
                    </div>
                    
                    <div class="campaign-rewards">
                        <h4 class="rewards-title">Pledge Rewards</h4>
                        <ul class="rewards-list">
                            ${campaign.rewards.map(reward => 
                                `<li><strong>${formatCurrency(reward.amount)}+</strong>: ${reward.description}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <button class="btn btn-support">
                        <i class="fas fa-donate me-2"></i> Support Now
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(campaignElement);
    });
}

// Function to render pagination buttons
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1">Previous</a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderCampaigns(currentPage);
            renderPagination();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderCampaigns(currentPage);
            renderPagination();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(pageLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderCampaigns(currentPage);
            renderPagination();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(nextLi);
}


// Function to filter and sort campaigns
function filterAndSortCampaigns() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    // Reset to first page when filters change
    currentPage = 1;
    
    // Start with all approved campaigns
    filteredCampaigns = campaignData.campaigns.filter(campaign => campaign.isApproved !== false);
    
    // Filter by category if not 'all'
    if (categoryFilter !== 'all') {
        filteredCampaigns = filteredCampaigns.filter(campaign => campaign.category === categoryFilter);
    }
    
    // Sort campaigns
    switch (sortFilter) {
        case 'most-funded':
            filteredCampaigns.sort((a, b) => (b.currentAmount / b.goal) - (a.currentAmount / a.goal));
            break;
        case 'ending-soon':
            filteredCampaigns.sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline));
            break;
        case 'newest':
        default:
            filteredCampaigns.sort((a, b) => b.id - a.id);
            break;
    }
    
    renderCampaigns(currentPage);
    renderPagination();
}
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Fetch campaign data from JSON file
    fetchCampaignData();
    
    // Add event listeners for filters
    document.getElementById('category-filter').addEventListener('change', filterAndSortCampaigns);
    document.getElementById('sort-filter').addEventListener('change', filterAndSortCampaigns);
});

// document.getElementById().parentElement
document.body.addEventListener("click" , async function (event) {
    if (event.target.textContent.trim()== 'Support Now') {
        console.log(event.target.parentElement.children[1].textContent);
        campaignId = event.target.parentElement.children[0].textContent

        window.open('/pages/purchase.html' , "_self");

        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`)
        const selectedCamp = await response.json();

        sessionStorage.setItem("selectedCamp" , JSON.stringify(selectedCamp));
    }
})