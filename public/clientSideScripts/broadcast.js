const broadcast = document.querySelector('.broadcast img')

broadcast.addEventListener('click', (e) => {
    e.target.parentElement.classList.add('unactive')
})
