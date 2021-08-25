const navbar = document.querySelector('nav'),
    hamburger_menu = document.querySelector('.hamburger'),
    closeMenu = document.querySelector('.closeMenu');

hamburger_menu.addEventListener('click', () => {
    navbar.classList.toggle('active')
})

closeMenu.addEventListener('click', () => {
    navbar.classList.remove('active')
})