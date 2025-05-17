import { formatPrettyDate, returningCampaigns, returningPledges } from "./utils.js";

let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
// console.log(currentUser)

let body = document.querySelectorAll('.row')[1];


(async function printingPledges() {
  let pledges = await returningPledges();
  let userPledges = pledges.filter(pledge => pledge.userId == currentUser.id)
  document.querySelector(".profile-header h1 span").textContent = currentUser.name;
  document.querySelector(".nav-name").textContent = currentUser.name;
  
  let campaigns = await returningCampaigns();
  let userpledgedCamps =[];
  for (const pledge of userPledges) {
    userpledgedCamps.push(...campaigns.filter(campaign => campaign.id == pledge.campaignId && campaign.isApproved)) ;
    // console.log(pledge);
  }
  console.log(userpledgedCamps);
  console.log(userPledges);

  body.innerHTML = '';
  console.log(body)
  for (const pledge in userpledgedCamps) {
    const reward = userpledgedCamps[pledge].rewards.filter(reward => reward.id == userPledges[pledge].rewardId)[0];
    // console.log(reward); 
    body.innerHTML +=
    `
    <div class="col-lg-12">
      <div class="pledge-card">
        <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
                <span class="badge bg-primary me-2">${userpledgedCamps[pledge].category}</span>
                <!-- <span class="pledge-status status-fulfilled">Reward Fulfilled</span> -->
            </div>
            <div class="text-muted small">Amount: ${userPledges[pledge].amount}</div>
        </div>
        <h4 class="mb-2">${userpledgedCamps[pledge].title}</h4>
        <p class="text-muted mb-3">${userpledgedCamps[pledge].description}</p>
        <h4 class="mb-2">Rewards:</h4>
        <p class="reward-f text-muted mb-3">(${reward.title}) ${reward.description}</p>
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <div class="small text-muted">Deadline</div>
                <div class="fw-bold">${formatPrettyDate(userpledgedCamps[pledge].deadline)}</div>
            </div>
        </div>
      </div>
    </div>
  `
  }
})();

document.getElementById("sign-out").addEventListener("click",function () {
  sessionStorage.removeItem("currentUser");
  window.open("../index.html","_self");
})