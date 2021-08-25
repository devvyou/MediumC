const inputBroadcast = document.querySelector('#broadcast'),
    products = document.querySelectorAll('.list-products li');


products.forEach(product => {
    product.addEventListener('click', async e => {
        if (e.target.classList.contains('delete')) {

            const li = e.target.parentElement.parentElement,
                id = li.dataset.id,
                deleteRotue = await fetch('/delete/' + id),
                response = await deleteRotue.json();

            if (response.msg === 'Ok') {
                li.remove();
            }
        }
    })
})