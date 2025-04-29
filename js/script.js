document.addEventListener('DOMContentLoaded', function () {
    const aboutBtn = document.getElementById('aboutBtn');
    const modal = document.getElementById('aboutModal');
    const closeBtn = document.querySelector('.close');

    if (aboutBtn && modal && closeBtn) {
        aboutBtn.addEventListener('click', function () {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    } else {
        console.error('Не найдены необходимые элементы!');
    }
});