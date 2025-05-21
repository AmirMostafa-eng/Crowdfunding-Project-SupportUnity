
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
const url = 'http://localhost:3000';
// Async function to fetch and return JSON data
// async function getJsonData() {
//   try {
//     const response = await fetch('../db.json'); // Path to your JSON file
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json(); // Parse JSON
//     return data; // Return the data
//   } catch (error) {
//     console.error('Error fetching JSON:', error);
//     return null; // Handle error as needed
//   }
// }

// async function returningUsers() {
//   const jsonData = await getJsonData(); 
//   if (jsonData) {
//     return jsonData.users; 
//   } else {
//     console.log('Failed to load JSON data');
//   }
// }
async function returningUsers() {
  const response = await fetch(`${url}/users`); 
  if (response) {
    return response.json(); 
  } else {
    console.log('Failed to load JSON data');
  }
}
console.log(returningUsers());

async function returningCampaigns() {
  const jsonData = await fetch(`${url}/campaigns`); 
  if (jsonData) {
    return jsonData.json(); 
  } else {
    console.log('Failed to load JSON data');
  }
}

async function returningPledges() {
  const jsonData = await fetch(`${url}/pledges`); 
  if (jsonData) {
    return jsonData.json(); 
  } else {
    console.log('Failed to load JSON data');
  }
}
// ===========
class User {
  constructor(id , name , email , password){
    this.id = id;
    this.name = name;
    this.role = "backer";
    this.isActive = true;
    this.email = email;
    this.password = password;
  }
}

const addNewUser = async function (name , email , password) {
  let users = await returningUsers();
  const usersIds = users.map(user => user.id)
  // console.log(usersIds.length);
  const newUser = new User(usersIds.length +1 , name , email ,password);

  const postResponse = await fetch(`http://localhost:3000/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  });

  if (!postResponse.ok) {
      throw new Error(`Failed to add user: ${postResponse.statusText}`);
    }

    // const result = await postResponse.json();
    // console.log('New user added:', result);
    return newUser;
}

// ==========================================

class Campaign{
    constructor(id , title , creatorId ,goal ,deadline ,description , category , imageUrl ,location){
        this.id = `${id}`;
        this.title = title;
        this.creatorId = creatorId;
        this.goal = Number(goal);
        this.deadline = deadline;
        this.isApproved = false ;
        this.numOfBackers = 0;
        this.description = description;
        this.currentAmount = 0 ;
        this.category = category;
        this.imageUrl = imageUrl;
        this.location = location;
    }
}

const addNewCampaign = async function (title , creatorId ,goal ,deadline ,description , category , imageUrl ,location , rewards) {
  
  const campaigns = await returningCampaigns();
  const campId = Number(campaigns[campaigns.length - 1].id) + 1  ;

  const newCampaign = new Campaign(campId ,title , creatorId ,goal ,deadline ,description ,category ,imageUrl ,location);
  newCampaign.rewards = rewards ;

  fetch("http://localhost:3000/campaigns",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newCampaign)
  })
}



// =================================================

const switching = function (role) {
    switch (role) {
  case 'admin':
    window.open('../pages/admin.html' ,"_self");
    break;

  case 'campaigner':
    window.open('../pages/form-camp.html' ,"_self"); // profile..
    break;

  case 'backer':
    window.open('../pages/campaigns.html' ,"_self"); 
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




export {returningUsers , returningCampaigns , returningPledges ,checkValid , switching ,formatPrettyDate ,addNewUser , addNewCampaign}