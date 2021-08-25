const eyeClosed = document.querySelector('.eyeClosed'),
    eyeOpened = document.querySelector('.eyeOpened'),
    eye_div = document.querySelector('.eye_div'),
    passwordInput = document.querySelector('.eye_div input');

eyeClosed.addEventListener('click', () => {
    eye_div.classList.add('eyeOpened')

    passwordInput.type = 'text'
})

eyeOpened.addEventListener('click', () => {
    eye_div.classList.remove('eyeOpened')

    passwordInput.type = 'password'
})