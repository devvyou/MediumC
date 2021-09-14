const navbar = document.querySelector('nav'),
    hamburger_menu = document.querySelector('.hamburger'),
    closeMenu = document.querySelector('.closeMenu');

hamburger_menu.addEventListener('click', () => {
    navbar.classList.toggle('active')
    document.querySelector('.broadcast').style.display = 'none';
    document.body.style.overflowY = 'hidden'
})

closeMenu.addEventListener('click', () => {
    navbar.classList.remove('active')
    document.querySelector('.broadcast').style.display = 'flex';
    document.body.style.overflowY = 'auto'
})