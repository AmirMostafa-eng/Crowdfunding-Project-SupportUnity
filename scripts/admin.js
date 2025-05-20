import { returningCampaigns, returningPledges, returningUsers , formatPrettyDate} from "./utils.js";

        // function confirmAction(message) {
        //     return confirm(message);
        // }

        // var gk_isXlsx = false;
        // var gk_xlsxFileLookup = {};
        // var gk_fileData = {};
        // function filledCell(cell) {
        //   return cell !== '' && cell != null;
        // }
        // function loadFileData(filename) {
        // if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        //     try {
        //         var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
        //         var firstSheetName = workbook.SheetNames[0];
        //         var worksheet = workbook.Sheets[firstSheetName];

        //         // Convert sheet to JSON to filter blank rows
        //         var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
        //         // Filter out blank rows (rows where all cells are empty, null, or undefined)
        //         var filteredData = jsonData.filter(row => row.some(filledCell));

        //         // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
        //         var headerRowIndex = filteredData.findIndex((row, index) =>
        //           row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
        //         );
        //         // Fallback
        //         if (headerRowIndex === -1 || headerRowIndex > 25) {
        //           headerRowIndex = 0;
        //         }

        //         // Convert filtered JSON back to CSV
        //         var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
        //         csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
        //         return csv;
        //     } catch (e) {
        //         console.error(e);
        //         return "";
        //     }
        // }
        // return gk_fileData[filename] || "";
        // }
// Sidebar toggle for mobile

// console.log()

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('full-width');
});

// Section navigation
const navLinks = document.querySelectorAll('.sidebar-nav a');
const sections = document.querySelectorAll('.dashboard-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show/hide sections
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 991.98) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.add('full-width');
        }
    });
});


// ================================
// user mangement section

const usersTable = document.getElementById('usersTable');
const allUsersTable = document.getElementById('allUsersTable');
console.log(allUsersTable);

async function populateUsers() {
    const users = await returningUsers();
    // const users = allUsers.filter(user => user.role == 'Pending Campaigner');
    usersTable.innerHTML = '';
    allUsersTable.innerHTML = '';

    // <td>${user.status}</td>
    users.forEach(user => {
        const row =
        `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            
            ${user.role === 'Pending Campaigner' ? `
                <td>
                    <button class="btn btn-action btn-approve me-2" id="approve-btn">Approve</button>
                    <button class="btn btn-action btn-reject me-2" id="reject-btn">Reject</button>
                    <button class="btn btn-action btn-ban" id="ban-btn">Ban</button>
                </td>
            ` : `
                <td>
                    <button class="btn btn-action btn-ban" id="ban-btn">Ban</button>
                </td>
            `}
        </tr>
        `;
        usersTable.innerHTML += row;
        allUsersTable.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.isActive? "Approved" : "Banned"}</td>
            </tr>
        `;
    });
}

// console.log(event.target.parentElement.parentElement.children[1].textContent)
// usersTable.tagName
usersTable.addEventListener("click", async function (event) {
    if (event.target.tagName === 'BUTTON') {

        const email = event.target.parentElement.parentElement.children[1].textContent;
        
        const response = await fetch(`http://localhost:3000/users?email=${email}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const users = await response.json();
        if (users.length === 0) {
            alert('User not found!');
            return;
        }
        const user = users[0];
        console.log(user.id);

        switch (event.target.id) {
            case 'approve-btn':
                //edit role to "campaigner"
                if (confirm(`Approve Campaigner role for ${user.name}?`)) {
                    await fetch(`http://localhost:3000/users/${user.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'campaigner' })
                    });
                    alert('User role updated to Campaigner!');
                }
                break;
    
            case 'reject-btn':
                //edit role to "backer"
                if (confirm(`Reject Campaigner role for ${user.name}?`)) {
                    await fetch(`http://localhost:3000/users/${user.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'backer' })
                    });
                    alert('User role updated to Backer!');
                }
                break;
    
            case 'ban-btn':
                //remove the user from database
                if (confirm(`Ban ${user.name}?`)) {
                    await fetch(`http://localhost:3000/users/${user.id}`, {
                        method: 'DELETE'
                    });
                    alert('User banned!');
                }
                break;
        
            default:
                break;
        }
        populateUsers();
    }
})


// =====================================

async function populateCampaigns() {
    const campaigns = await returningCampaigns();
    const users = await returningUsers();
    const campaignsTable = document.getElementById('campaignsTable');
    const allCampaignsTable = document.getElementById('allCampaignsTable');
    campaignsTable.innerHTML = '';
    allCampaignsTable.innerHTML = '';

    campaigns.forEach(campaign => {
        const user = users.filter(user => user.id == campaign.creatorId)[0];
        console.log(campaign.goal)
        // console.log(user)
        const row = `
            <tr>
                <td>${campaign.title}</td>
                <td>${campaign.creator}</td>
                <td>$${campaign.goal}</td>
                <td>${campaign.status}</td>
                ${campaign.status === 'Pending' ? `
                    <td>
                        <button class="btn btn-action btn-approve me-2" onclick="confirmAction('Approve ${campaign.title}?')">Approve</button>
                        <button class="btn btn-action btn-reject me-2" onclick="confirmAction('Reject ${campaign.title}?')">Reject</button>
                        <button class="btn btn-action btn-delete" onclick="confirmAction('Delete ${campaign.title}?')">Delete</button>
                    </td>
                ` : `
                    <td>
                        <button class="btn btn-action btn-delete" onclick="confirmAction('Delete ${campaign.title}?')">Delete</button>
                    </td>
                `}
            </tr>
        `;
        campaignsTable.innerHTML += row;
        allCampaignsTable.innerHTML += `
            <tr>
                <td>${campaign.title}</td>
                <td>${user.name}</td>
                <td>$${campaign.goal}</td>
                <td>$${campaign.currentAmount}</td>
                <td>${formatPrettyDate(campaign.deadline)}</td>
            </tr>
        `;
    });
}


// =========================

async function populatePledges() {
    const pledges = await returningPledges();
    const users = await returningUsers();
    const campaigns = await returningCampaigns();
    const pledgesTable = document.getElementById('pledgesTable');
    pledgesTable.innerHTML = '';

    pledges.forEach(pledge => {
        const user = users.filter(user => user.id == pledge.userId)[0]
        const campaign = campaigns.filter(camp => camp.id == pledge.campaignId )[0]
        pledgesTable.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${campaign.title}</td>
                <td>$${pledge.amount}</td>
                <td>${formatPrettyDate(pledge.date)}</td>
            </tr>
        `;
    });
}


// ===============
// Confirmation function (placeholder)
function confirmAction(message) {
    if (confirm(message)) {
        alert('Action confirmed!');
        // Implement actual action logic here
    }
}

// Initialize data
async function init() {
    await Promise.all([
        populateUsers(),
        populateCampaigns(),
        populatePledges()
    ]);
}

init();





// ======================================================

const toastLiveExample = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

function showToast(message, isSuccess = true) {
    const toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    toastLiveExample.classList.remove('bg-success', 'bg-danger');
    toastLiveExample.classList.add(isSuccess ? 'bg-success' : 'bg-danger');
    toastBootstrap.show();
}

function renderCampaigns(campaigns) {
    const tableBody = document.getElementById('campaigns-table-body');
    
    if (!campaigns || campaigns.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No campaigns found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = campaigns.map(campaign => `
        <tr id="campaign-${campaign.id}">
            <td>${campaign.title || 'Untitled Campaign'}</td>
            <td>${formatPrettyDate(campaign.deadline)}</td>
            <td>$${(campaign.goal || 0).toLocaleString()}</td>
            <td>
            <span class="badge ${campaign.isApproved ? 'bg-success' : 'bg-warning text-dark'}">
            ${campaign.isApproved ? 'Approved' : 'Pending'}
            </span>
            </td>
            <td>
    ${campaign.isApproved ? `
        <!-- Show DELETE button only if approved -->
        <button class="btn btn-danger btn-sm btn-delete" data-id="${campaign.id}">
            <i class="fas fa-trash"></i> Delete
        </button>
    ` : `
        <!-- Show REJECT & APPROVE buttons if pending -->
        <button class="btn btn-warning btn-sm btn-reject" data-id="${campaign.id}">
            <i class="fas fa-times"></i> Reject
        </button>
        <button class="btn btn-success btn-sm btn-approve ms-2" data-id="${campaign.id}">
            <i class="fas fa-check"></i> Approve
        </button>
    `}
</td>
        </tr>
    `).join('');

    // Add event listeners to buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
    document.querySelectorAll('.btn-reject').forEach(button => {
        button.addEventListener('click', handleReject);
    });

    document.querySelectorAll('.btn-approve').forEach(button => {
        button.addEventListener('click', handleApprove);
    });
}

async function handleApprove(e) {
    const button = e.target.closest('button');
    const campaignId = button.dataset.id;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
    
    try {
        // Make API call to update the campaign in db.json
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isApproved: true 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update campaign');
        }

        // Find the row and update status
        const row = document.getElementById(`campaign-${campaignId}`);
        if (row) {
            // Update status badge
            const statusBadge = row.querySelector('.badge');
            statusBadge.classList.remove('bg-warning', 'text-dark');
            statusBadge.classList.add('bg-success');
            statusBadge.textContent = 'Approved';
            
            // Remove approve button
            button.remove();
            showToast('Campaign approved successfully');
        }
    } catch (error) {
        console.error('Error approving campaign:', error);
        showToast('Error approving campaign', false);
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> Approve';
    }
}

async function loadAndRenderCampaigns() {
    const campaigns = await returningCampaigns();
    renderCampaigns(campaigns);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadAndRenderCampaigns);

async function deleteCampaignFromDB(campaignId) {
    await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete campaign');
    }
    
    return await response.json();
}

async function handleDelete(e) {
    const button = e.target.closest('button');
    const campaignId = button.dataset.id;
    
    if (confirm('Are you sure you want to delete this campaign?')) {
        // Disable button during operation
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        
        try {
            // Call the API to delete the campaign from db.json
            const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Find and remove the row from the UI
            const row = document.getElementById(`campaign-${campaignId}`);
            if (row) {
                row.classList.add('table-danger'); // Visual feedback
                setTimeout(() => {
                    row.remove();
                    showToast('Campaign deleted successfully');
                    
                    // If no rows left, show empty message
                    if (document.querySelectorAll('#campaigns-table-body tr').length === 0) {
                        renderCampaigns([]);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            showToast('Error deleting campaign', false);
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-trash"></i> Delete';
        }
    }
}

async function handleReject(e) {
    const button = e.target.closest('button');
    const campaignId = button.dataset.id;
    
    if (confirm('Are you sure you want to delete this campaign?')) {
        // Disable button during operation
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rejecting...';
        
        try {
            // Call the API to delete the campaign from db.json
            const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Find and remove the row from the UI
            const row = document.getElementById(`campaign-${campaignId}`);
            if (row) {
                row.classList.add('table-danger'); // Visual feedback
                setTimeout(() => {
                    row.remove();
                    showToast('Campaign reject successfully');
                    
                    // If no rows left, show empty message
                    if (document.querySelectorAll('#campaigns-table-body tr').length === 0) {
                        renderCampaigns([]);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error Rejecting campaign:', error);
            showToast('Error Rejecting campaign', false);
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-times"></i> Reject';
        }
    }
}
