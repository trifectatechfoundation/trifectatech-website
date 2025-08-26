document.addEventListener('DOMContentLoaded', ()=> {
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

  const buttons = document.querySelectorAll('.funder.card-link');
  const dialogs = document.querySelectorAll('.funder dialog');
  buttons.forEach(b => b.addEventListener('click', openModal));

  function openModal(event) {
    const dialog = event.target.querySelector('dialog');
    if (!dialog) return;
    dialog.showModal();

    // Add outside click handler
    function handleOutsideClick(e) {
      if (e.target === dialog) {
        dialog.close();
      }
    }
    dialog.addEventListener('click', handleOutsideClick);
    dialog.addEventListener('close', function cleanup() {
      dialog.removeEventListener('click', handleOutsideClick);
      dialog.removeEventListener('close', cleanup);
    });
  }
});

