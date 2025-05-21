const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
console.log(currentUser);

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

if (currentUser.role == 'admin' || currentUser.role == 'campaigner') {
  document.querySelector(".hero-cta").style.display= 'none';
}
