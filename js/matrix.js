'use strict';

// ===== Matrix background configuration =====
const CONFIG = {
	fontSize: 16,
	frameDelay: 33,
	resetChance: 0.975,
	textColor: '#0f0',
	fadeColor: 'rgba(0, 0, 0, 0.05)',
	fontFamily: 'monospace',
	characters: {
		katakana: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン',
		latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers: '0123456789'
	}
};

const canvas = document.getElementById('matrix');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !prefersReducedMotion) {
	const ctx = canvas.getContext('2d');

	if (ctx) {
		const state = {
			alphabet: '',
			columns: 0,
			drops: [],
			lastTime: 0
		};

		function setupAlphabet() {
			state.alphabet = Object.values(CONFIG.characters).join('');
		}

		function setupColumns() {
			state.columns = Math.floor(canvas.width / CONFIG.fontSize);
			state.drops = Array(state.columns).fill(1);
		}

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			setupColumns();
		}

		function drawBackground() {
			ctx.fillStyle = CONFIG.fadeColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		function setupTextStyle() {
			ctx.fillStyle = CONFIG.textColor;
			ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
		}

		function getRandomCharacter() {
			return state.alphabet.charAt(Math.floor(Math.random() * state.alphabet.length));
		}

		function shouldResetDrop(columnIndex) {
			return state.drops[columnIndex] * CONFIG.fontSize > canvas.height &&
				Math.random() > CONFIG.resetChance;
		}

		function drawCharacter(columnIndex) {
			const randomChar = getRandomCharacter();
			const x = columnIndex * CONFIG.fontSize;
			const y = state.drops[columnIndex] * CONFIG.fontSize;

			ctx.fillText(randomChar, x, y);
		}

		function updateDropPosition(columnIndex) {
			if (shouldResetDrop(columnIndex)) {
				state.drops[columnIndex] = 0;
			}

			state.drops[columnIndex]++;
		}

		function draw() {
			drawBackground();
			setupTextStyle();

			for (let i = 0; i < state.drops.length; i++) {
				drawCharacter(i);
				updateDropPosition(i);
			}
		}

		function animate(timestamp) {
			if (timestamp - state.lastTime > CONFIG.frameDelay) {
				draw();
				state.lastTime = timestamp;
			}

			requestAnimationFrame(animate);
		}

		function init() {
			setupAlphabet();
			resizeCanvas();

			window.addEventListener('resize', resizeCanvas);
			requestAnimationFrame(animate);
		}

		init();
	}
}