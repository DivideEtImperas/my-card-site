/**
 * Matrix Card - интерактивная визитка
 * @author Eduard Golyshev
 * @version 1.1
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', function () {
    // Элементы модального окна
    const aboutBtn = document.getElementById('aboutBtn');
    const modal = document.getElementById('aboutModal');
    const closeBtn = document.querySelector('.close');
    const enableSoundBtn = document.getElementById('enableSound');

    // Проверка элементов
    if (!aboutBtn || !modal || !closeBtn) {
        console.error('Не найдены необходимые элементы для модального окна');
        return;
    }

    // Определение типа устройства
    const isTouchDevice = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);

    // Функция для звука (Web Audio API)
    function playBeep() {
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
            try {
                new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3').play();
            } catch (fallbackError) {
                console.error('Fallback audio failed:', fallbackError);
            }
        }
    }

    // Управление модальным окном
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    aboutBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Обработчики для иконок 
    document.querySelectorAll('.icon-btn').forEach(btn => {
        let isTouchInteraction = false;
        let interactionTimer;
        let isAnimating = false;

        // Touch-события (для мобильных)
        btn.addEventListener('touchstart', function () {
            if (isAnimating) return;
            isAnimating = true;
            isTouchInteraction = true;
            startInteraction(this);
        }, { passive: true });

        btn.addEventListener('touchend', function (e) {
            if (isTouchInteraction && !isAnimating) {
                e.preventDefault();
                endInteraction(this);
                setTimeout(() => {
                    window.open(this.href, '_blank');
                    isAnimating = false;
                }, 100);
            }
        }, { passive: true });

        // Click-события (для десктопов)
        btn.addEventListener('click', function (e) {
            if (isTouchInteraction || isAnimating) return;
            isAnimating = true;
            e.preventDefault();

            startInteraction(this);
            setTimeout(() => {
                endInteraction(this);
                window.open(this.href, '_blank');
                isAnimating = false;
            }, isTouchDevice ? 150 : 300);
        });

        // Функции управления состоянием
        function startInteraction(element) {
            clearTimeout(interactionTimer);
            element.classList.add('interacting');
            playBeep();
        }

        function endInteraction(element) {
            element.classList.remove('interacting');
            isTouchInteraction = false;
        }
    });

    // Управление звуком
    if (enableSoundBtn) {
        function updateSoundButton() {
            const isEnabled = localStorage.getItem('soundAllowed') === 'true';
            enableSoundBtn.innerHTML = isEnabled ? '🔊 Звуки включены' : '🔇 Включить звуки';
            enableSoundBtn.classList.toggle('sound-enabled', isEnabled);
        }

        enableSoundBtn.addEventListener('click', function () {
            const newState = localStorage.getItem('soundAllowed') !== 'true';
            localStorage.setItem('soundAllowed', newState);
            updateSoundButton();
            if (newState) playBeep();
        });

        updateSoundButton();
    }

    // Сброс состояний при возврате на страницу
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            document.querySelectorAll('.icon-btn').forEach(btn => {
                btn.classList.remove('interacting', 'active');
                btn.style.transform = '';
            });
        }
    });

    console.log('Скрипт инициализирован (v1.1)');
});