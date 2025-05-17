import { checkValid, returningUsers, switching } from "./utils.js";

export let newUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
if (newUser) {
  switching(newUser.role);
}

let namePattern = /^[A-Za-z]{3,}$/;
let emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ ;
let passPattern = /^[A-Za-z0-9]{6,20}$/ ;


let signUpBtn = document.getElementById("sign-up");
signUpBtn.nextElementSibling.style.display = 'none';
let signUpName = document.getElementById("signup-name");
let signUpEmail = document.getElementById("signup-email");
let signUpPass = document.getElementById("signup-password");
// signUpEmail.nextElementSibling.textContent = 'this email already exists';
document.querySelectorAll("#signup-form .name-error")[0].style.display = 'none'
document.querySelectorAll("#signup-form .name-error")[1].style.display = 'none'
document.querySelectorAll("#signup-form .name-error")[2].style.display = 'none'


signUpName.addEventListener("blur",function (event) {
  checkValid(signUpName , namePattern);
})
signUpEmail.addEventListener("blur",function (event) {
  checkValid(signUpEmail , emailPattern);
})
signUpPass.addEventListener("blur",function (event) {
  checkValid(signUpPass , passPattern);
})


// console.log(signUpBtn);
signUpBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  if (checkValid(signUpName , namePattern) && checkValid(signUpEmail , emailPattern) && checkValid(signUpPass , passPattern)){
    let users = await returningUsers();
    if (users.filter((user) => user.email == signUpEmail.value).length) {
      signUpBtn.nextElementSibling.style.color ='red';
      signUpBtn.nextElementSibling.style.display = 'block';
    }else{
      window.open('../pages/campaigns.html' ,"_self");
    }
  }
})


