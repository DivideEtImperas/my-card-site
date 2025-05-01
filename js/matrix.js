// Конфигурация
const CONFIG = {
    fontSize: 16,
    frameDelay: 33, // ~30 FPS
    resetChance: 0.975, // 2.5% шанс сбросить столбец
    textColor: '#0f0',
    fadeColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: 'monospace',
    characters: {
        katakana: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン',
        latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789'
    }
};

// Инициализация Canvas
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Состояние анимации
const state = {
    alphabet: '',
    columns: 0,
    drops: []
};

// Инициализация
function init() {
    resizeCanvas();
    setupAlphabet();
    setupColumns();
    window.addEventListener('resize', resizeCanvas);
}

// Настройка алфавита
function setupAlphabet() {
    state.alphabet = Object.values(CONFIG.characters).join('');
}

// Настройка колонок
function setupColumns() {
    state.columns = Math.floor(canvas.width / CONFIG.fontSize);
    state.drops = Array(state.columns).fill(1);
}

// Обработка изменения размера окна
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setupColumns();
}

// Основная функция отрисовки
function draw() {
    drawBackground();
    setupTextStyle();

    for (let i = 0; i < state.drops.length; i++) {
        drawCharacter(i);
        updateDropPosition(i);
    }
}

// Отрисовка фона с эффектом исчезновения
function drawBackground() {
    ctx.fillStyle = CONFIG.fadeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Настройка стиля текста
function setupTextStyle() {
    ctx.fillStyle = CONFIG.textColor;
    ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
}

// Отрисовка символа
function drawCharacter(columnIndex) {
    const randomChar = getRandomCharacter();
    const x = columnIndex * CONFIG.fontSize;
    const y = state.drops[columnIndex] * CONFIG.fontSize;
    ctx.fillText(randomChar, x, y);
}

// Обновление позиции капли
function updateDropPosition(columnIndex) {
    if (shouldResetDrop(columnIndex)) {
        state.drops[columnIndex] = 0;
    }
    state.drops[columnIndex]++;
}

// Проверка на сброс капли
function shouldResetDrop(columnIndex) {
    return state.drops[columnIndex] * CONFIG.fontSize > canvas.height &&
        Math.random() > CONFIG.resetChance;
}

// Получение случайного символа
function getRandomCharacter() {
    return state.alphabet.charAt(Math.floor(Math.random() * state.alphabet.length));
}

// Запуск анимации
init();
setInterval(draw, CONFIG.frameDelay);
