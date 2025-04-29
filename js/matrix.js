const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d')

//Размер холста = размеру окна
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Символы для "дождя"
const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

//Настройки дождя
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

//Инициализация капель
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100; //Случайная начальная позиция
}

function draw() {
    // Полупрозрачный чёрный фон для эффекта "шлейфа"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Цвет символов
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    //Рисуем символы для каждой капли
    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        //Случайный сброс капли в начало + скорость
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Запуск анимации (60 к/с)
setInterval(draw, 60);

// Реакция на изменение
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
