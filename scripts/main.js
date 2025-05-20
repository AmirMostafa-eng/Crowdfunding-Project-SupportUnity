// fetch('../pages/auth.html')
// .then(response =>response.text())
// .then(data =>{
//     document.getElementById()
// })
const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};

let anonymosUser = document.querySelector("#anon");
let loggedUser = document.querySelector(".logged");
const navName = document.querySelector(".nav-name");


if (currentUser.name) {
  anonymosUser.classList.remove("d-flex");
  anonymosUser.style.display ='none' ;

  navName.textContent = currentUser.name;
  console.log(currentUser)

}else {
  loggedUser.style.display ='none' ;
}


document.getElementById("sign-out").addEventListener("click",function () {
  sessionStorage.removeItem("currentUser");
  window.open("../index.html","_self");
})


