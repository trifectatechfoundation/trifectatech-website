const menuTrigger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

menuTrigger.addEventListener('click', (event) => {
  menuTrigger.classList.toggle('active');
  menu.classList.toggle('open');
})