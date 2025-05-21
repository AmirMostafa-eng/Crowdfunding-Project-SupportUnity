const selectedCamp = JSON.parse(sessionStorage.getItem("selectedCamp"));
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
console.log(selectedCamp);

const loggedInUserEmail = currentUser.email;
const campaignId = selectedCamp.id; // Hardcoded for demo; use URLSearchParams for ?campaign=1

document.querySelector("span.nav-name").textContent = currentUser.name;


// Fetch campaign details
async function loadCampaign() {
    try {
        const response = await fetch(`http://localhost:3000/campaigns/${campaignId}`);
        if (!response.ok) throw new Error(`Failed to fetch campaign: ${response.status}`);
        const campaign = await response.json();
        document.getElementById('campaignTitle').textContent = campaign.title;
        return campaign;
    } catch (error) {
        console.error('Error fetching campaign:', error);
        alert('Failed to load campaign. Please try again.');
        return null;
    }
}

// Handle form submission
document.getElementById('pledgeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('pledgeAmount').value);

    // Basic validation
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid pledge amount.');
        return;
    }


    // Fetch campaign details
    const campaign = await loadCampaign();
    if (!campaign) return;

    // Show confirmation modal
    document.getElementById('confirmAmount').textContent = amount.toFixed(2);
    document.getElementById('confirmCampaign').textContent = campaign.title;
    // document.getElementById('confirmCard').textContent = cardNumber.slice(-4);
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();

    // Handle proceed button
    document.getElementById('proceedPayment').onclick = () => {
        confirmModal.hide();
        try {
            // Show success modal
            document.getElementById('successAmount').textContent = amount.toFixed(2);
            document.getElementById('successCampaign').textContent = campaign.title;
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            // Reset form
            document.getElementById('pledgeForm').reset();
            // Create new pledge
            const pledge = {
              id: '',
              campaignId: campaignId,
              userId: loggedInUserEmail,
              amount: amount,
              rewardId: selectedCamp.rewards[0].id ,
              date: new Date().toISOString().split('T')[0]
            };
            document.getElementById("back-to-camps").addEventListener("click" , async function (event) {
              
              const pledgeResponse = await fetch('http://localhost:3000/pledges', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(pledge)
              });
              if (!pledgeResponse.ok) throw new Error(`Failed to create pledge: ${pledgeResponse.status}`);
  
              // Update campaign raised amount
              const newRaised = campaign.raised + amount;
              const updateResponse = await fetch(`http://localhost:3000/campaigns/${campaignId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ raised: newRaised })
              });
              if (!updateResponse.ok) throw new Error(`Failed to update campaign: ${updateResponse.status}`);
            })

        } catch (error) {
            console.error('Error processing pledge:', error);
            alert(`An error occurred: ${error.message}`);
        }
    };
});

// Initialize page
loadCampaign();