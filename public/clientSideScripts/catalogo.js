const goBackDiv = document.querySelector('.absolute'),
    goUpArrow = document.querySelector('.arrow-go-up'),
    selectValue = JSON.parse(localStorage.getItem('sortBy')),
    select = document.querySelector('#option');


// localStorage option
if (!selectValue) {
    localStorage.setItem('sortBy', JSON.stringify({ value: 'prezzoCrescente' }));
} else {
    if (selectValue.value === 'prezzoCrescente') {
        document.querySelector('#prezzoCrescente').setAttribute('selected', true)
    } else {
        document.querySelector('#prezzoDecrescente').setAttribute('selected', true)
    }
}


// sortBy
select.addEventListener('change', async e => {

    const value = { "value": e.target.value }

    const changeSort = await fetch('/filterOrder', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value)
    });

    const response = await changeSort.json();

    if (response.msg === 'Ok') {
        localStorage.setItem('sortBy', JSON.stringify(value))
    } else { console.error('NO: ', response); }

    window.location.reload();
})


goUpArrow.addEventListener('click', () => {
    window.location.href = '#catalogo'
})


goBackDiv.addEventListener('click', () => {
    window.location.href = '/';
})
