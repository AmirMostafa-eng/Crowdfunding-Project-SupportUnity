function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

const trueAction = function (target) {
  target.nextElementSibling.style.display = 'none';
  target.style.border = `2px solid green`;
  return true;
}

const falseAction = function (target ) {
  target.focus();
  target.style.border = `2px solid red`;
  target.nextElementSibling.style.display = 'block';
  target.nextElementSibling.style.color = 'red';
  return false;
}

const checkValid = function(target , pattern){
  if (target.value.trim().match(pattern) == null) {
    return falseAction(target);
  }
  else{
    return trueAction(target);
  }
}
// ==========================================================

// Async function to fetch and return JSON data
async function getJsonData() {
  try {
    const response = await fetch('../db.json'); // Path to your JSON file
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON
    return data; // Return the data
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null; // Handle error as needed
  }
}

async function returningUsers() {
  const jsonData = await getJsonData(); 
  if (jsonData) {
    return jsonData.users; 
  } else {
    console.log('Failed to load JSON data');
  }
}

async function returningCampaigns() {
  const jsonData = await getJsonData(); 
  if (jsonData) {
    return jsonData.campaigns; 
  } else {
    console.log('Failed to load JSON data');
  }
}


async function returningPledges() {
  const jsonData = await getJsonData(); 
  if (jsonData) {
    return jsonData.pledges; 
  } else {
    console.log('Failed to load JSON data');
  }
}
// =================================================

const switching = function (role) {
    switch (role) {
  case 'admin':
    window.open('../pages/admin.html' ,"_self");
    break;

  case 'campaigner':
    window.open('../pages/campaigns.html' ,"_self"); // profile..
    break;

  case 'backer':
    window.open('../pages/profile.html' ,"_self"); // profile..
    break;
    
    default:
    // window.open('../pages/profile.html' ,"_self");
    break;
  }
}


const formatPrettyDate = (dateString, monthFormat = 'short') => {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();

  const month = date.toLocaleString('en-US', { month: monthFormat });
  // const weekday = date.toLocaleString('en-US', { weekday: 'long' });

  return `${month} ${day}, ${year}`;
};




export {getJsonData , returningUsers , returningCampaigns , returningPledges ,checkValid , switching ,formatPrettyDate}