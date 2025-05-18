// fetch('../pages/auth.html')
// .then(response =>response.text())
// .then(data =>{
//     document.getElementById()
// })
const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};

let anonymosUser = document.querySelector("#anon");
let loggedUser = document.querySelector(".logged");
const navName = document.querySelector(".nav-name");


if (currentUser) {
  anonymosUser.classList.remove("d-flex");
  anonymosUser.style.display ='none' ;

  navName.textContent = currentUser.name;

}else {
  loggedUser.style.display ='none' ;
}