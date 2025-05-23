import { returningUsers, switching } from "./utils.js";

let newUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
if (newUser) {
  switching(newUser.role);
}

let logInBtn = document.getElementById("log-in");
let logInEmail = document.getElementById("login-email");
let logInPass = document.getElementById("login-password");

document.querySelector("#login-form .name-error").style.display = 'none';
console.log(document.querySelector("#login-form .name-error"))

logInBtn.addEventListener("click", async function (event) {
  event.preventDefault();
    let users = await returningUsers();
    let user = users.filter((user) => user.email == logInEmail.value && logInPass.value == user.password)[0]
    console.log(user);
    if (user) {
      if (!user.isActive ) {
      document.querySelector("#login-form .name-error").style.color = 'red'; 
      document.querySelector("#login-form .name-error").style.display = 'block'; 
      document.querySelector("#login-form .name-error").textContent = 'this email is banned'; 
      return Error;
      }
      newUser = users.filter((user) => user.email == logInEmail.value )[0];
      sessionStorage.setItem("currentUser",JSON.stringify(newUser));
      switching(newUser.role)

    }else{
      document.querySelector("#login-form .name-error").style.color = 'red'; 
      document.querySelector("#login-form .name-error").style.display = 'block'; 
    }  
})