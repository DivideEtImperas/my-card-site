/**
 * Matrix Card - интерактивная визитка
 * @author Eduard Golyshev
 * @version 1.0
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', function () {
    // Элементы модального окна
    const aboutBtn = document.getElementById('aboutBtn');
    const modal = document.getElementById('aboutModal');
    const closeBtn = document.querySelector('.close');

    // Проверка элементов модального окна
    if (!aboutBtn || !modal || !closeBtn) {
        console.error('Не найдены необходимые элементы для модального окна');
        return;
    }

    // Функция для звука (Web Audio API)
    function playBeep() {
        // Проверяем разрешение на звук
        if (localStorage.getItem('soundAllowed') !== 'true') return;

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 800;
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error('Web Audio error:', e);
            // Fallback на HTML5 Audio
            try {
                new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3').play();
            } catch (fallbackError) {
                console.error('Fallback audio failed:', fallbackError);
            }
        }
    }

    // Управление модальным окном
    aboutBtn.addEventListener('click', function () {
        console.log('Opening modal...');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Обработчики для иконок
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Анимация
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 200);

            // Звук
            playBeep();

            // Открытие ссылки
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 300);
        });
    });

    // Управление звуком
    const enableSoundBtn = document.getElementById('enableSound');
    if (enableSoundBtn) {
        // Инициализация состояния
        function updateSoundButton() {
            const isSoundAllowed = localStorage.getItem('soundAllowed') === 'true';
            enableSoundBtn.innerHTML = isSoundAllowed ? '🔊 Звуки включены' : '🔇 Включить звуки';
            enableSoundBtn.classList.toggle('sound-enabled', isSoundAllowed);

            // Больше не скрываем кнопку полностью
            enableSoundBtn.style.display = 'block';
        }

        // Обработчик клика
        enableSoundBtn.addEventListener('click', function () {
            const newState = localStorage.getItem('soundAllowed') !== 'true';
            localStorage.setItem('soundAllowed', String(newState));

            // Проиграть тестовый звук
            if (newState) playBeep();

            // Обновить кнопку
            updateSoundButton();
        });

        // Первоначальная настройка
        updateSoundButton();
    }

    console.log('Скрипт инициализирован');
});