const menuTrigger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu-panel');

menuTrigger.addEventListener('click', (event) => {
  menuTrigger.classList.toggle('active');
  menu.classList.toggle('open');
})

const prefersColorSchemeTrigger = document.querySelector('.color-scheme');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');

prefersColorSchemeTrigger.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');

  if (localStorage.getItem('prefersColorScheme')) {
    localStorage.removeItem('prefersColorScheme');
    moon.style.display = 'block';
    sun.style.display = 'none';
  } else {
    localStorage.setItem('prefersColorScheme', 'dark'); 
    sun.style.display = 'block';
    moon.style.display = 'none';
  }
});

if (localStorage.getItem('prefersColorScheme')) {
  document.documentElement.classList.add('dark');
  sun.style.display = 'block';
  moon.style.display = 'none';
}