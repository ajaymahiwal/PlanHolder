let hamBurgerMenu = document.querySelector(".hamburger-menu");
let bottomHeader = document.querySelector(".bottom-header");

hamBurgerMenu.addEventListener('click',(e)=>{
    bottomHeader.classList.toggle("hide");
})