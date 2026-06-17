/**
 * Matrix Portfolio - интерактивная визитка
 * @author Eduard Golyshev
 * @version 2.1
 */

document.addEventListener('DOMContentLoaded', function () {
	// ===== Основные элементы =====
	const enableSoundBtn = document.getElementById('enableSound');

	// ===== Элементы музыкального плеера =====
	const soundtrack = document.getElementById('soundtrack');
	const musicBtn = document.getElementById('musicBtn');
	const prevTrackBtn = document.getElementById('prevTrackBtn');
	const nextTrackBtn = document.getElementById('nextTrackBtn');
	const musicStatus = document.getElementById('musicStatus');
	const trackTitle = document.getElementById('trackTitle');
	const volumeRange = document.getElementById('volumeRange');
	const volumeIcon = document.querySelector('.music-player__volume-icon');

	// ===== Настройки треков =====
	const tracks = [
		{
			title: 'Matrix Track 01',
			src: 'audio/marilyn-manson-rock-is-dead.mp3'
		},
		{
			title: 'Matrix Track 02',
			src: 'audio/propellerheads-spybreak-short-one.mp3'
		},
		{
			title: 'Matrix Track 03',
			src: 'audio/ministry-bad-blood.mp3'
		},
		{
			title: 'Matrix Track 04',
			src: 'audio/rob-d-clubbed-to-death-kurayamino-mix.mp3'
		},
		{
			title: 'Matrix Track 05',
			src: 'audio/meat-beat-manifesto-prime-audio-soup.mp3'
		},
		{
			title: 'Matrix Track 06',
			src: 'audio/lunatic-calm-leave-you-far-behind.mp3'
		},
		{
			title: 'Matrix Track 07',
			src: 'audio/the-prodigy-mindfields.mp3'
		},
		{
			title: 'Matrix Track 08',
			src: 'audio/rob-zombie-dragula-hot-rod-herman-remix.mp3'
		},
		{
			title: 'Matrix Track 09',
			src: 'audio/deftones-my-own-summer-shove-it.mp3'
		},
		{
			title: 'Matrix Track 010',
			src: 'audio/hive-ultrasonic-sound.mp3'
		},
		{
			title: 'Matrix Track 011',
			src: 'audio/monster-magnet-look-to-your-orb-for-the-warning.mp3'
		},
		{
			title: 'Matrix Track 012',
			src: 'audio/rammstein-du-hast.mp3'
		},
		{
			title: 'Matrix Track 013',
			src: 'audio/rage-against-the-machine-wake-up.mp3'
		}
	];

	let currentTrackIndex = 0;
	const DEFAULT_VOLUME = 0.6;

	// ===== Определение устройства =====
	const isTouchDevice = ('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0);

	// ===== Короткий звук клика по иконкам =====
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
		} catch (error) {
			console.error('Web Audio error:', error);
		}
	}

	// ===== Обновление интерфейса плеера =====
	function updatePlayerUI(isPlaying = false) {
		if (!soundtrack || !musicBtn || !musicStatus || !trackTitle) return;

		const currentTrack = tracks[currentTrackIndex];
		const icon = musicBtn.querySelector('i');

		trackTitle.textContent = currentTrack.title;
		musicStatus.textContent = isPlaying ? 'playing' : 'paused';

		musicBtn.classList.toggle('is-playing', isPlaying);

		if (icon) {
			icon.classList.toggle('fa-play', !isPlaying);
			icon.classList.toggle('fa-pause', isPlaying);
		}
	}

	// ===== Загрузка трека =====
	function loadTrack(index) {
		if (!soundtrack || tracks.length === 0) return;

		currentTrackIndex = index;

		if (currentTrackIndex < 0) {
			currentTrackIndex = tracks.length - 1;
		}

		if (currentTrackIndex >= tracks.length) {
			currentTrackIndex = 0;
		}

		soundtrack.src = tracks[currentTrackIndex].src;
		soundtrack.load();

		updatePlayerUI(false);
	}

	// ===== Воспроизведение =====
	async function playTrack() {
		if (!soundtrack) return;

		try {
			await soundtrack.play();
			updatePlayerUI(true);
		} catch (error) {
			console.error('Audio play error:', error);

			if (musicStatus) {
				musicStatus.textContent = 'blocked';
			}
		}
	}

	// ===== Пауза =====
	function pauseTrack() {
		if (!soundtrack) return;

		soundtrack.pause();
		updatePlayerUI(false);
	}

	// ===== Play / Pause =====
	async function togglePlay() {
		if (!soundtrack) return;

		if (soundtrack.paused) {
			await playTrack();
		} else {
			pauseTrack();
		}
	}

	// ===== Следующий трек =====
	async function nextTrack() {
		if (!soundtrack) return;

		const wasPlaying = !soundtrack.paused;

		loadTrack(currentTrackIndex + 1);

		if (wasPlaying) {
			await playTrack();
		}
	}

	// ===== Предыдущий трек =====
	async function prevTrack() {
		if (!soundtrack) return;

		const wasPlaying = !soundtrack.paused;

		loadTrack(currentTrackIndex - 1);

		if (wasPlaying) {
			await playTrack();
		}
	}

	// ===== Иконка громкости =====
	function updateVolumeIcon(volume) {
		if (!volumeIcon) return;

		volumeIcon.classList.remove(
			'fa-volume-high',
			'fa-volume-low',
			'fa-volume-xmark'
		);

		if (volume <= 0) {
			volumeIcon.classList.add('fa-volume-xmark');
		} else if (volume < 0.5) {
			volumeIcon.classList.add('fa-volume-low');
		} else {
			volumeIcon.classList.add('fa-volume-high');
		}
	}

	// ===== Изменение громкости =====
	function changeVolume() {
		if (!soundtrack || !volumeRange) return;

		const volume = Number(volumeRange.value);

		soundtrack.volume = volume;
		localStorage.setItem('musicVolume', String(volume));

		updateVolumeIcon(volume);
	}

	// ===== Инициализация музыкального плеера =====
	if (
		soundtrack &&
		musicBtn &&
		prevTrackBtn &&
		nextTrackBtn &&
		musicStatus &&
		trackTitle
	) {
		loadTrack(currentTrackIndex);

		const savedVolume = localStorage.getItem('musicVolume');
		const startVolume = savedVolume !== null ? Number(savedVolume) : DEFAULT_VOLUME;

		soundtrack.volume = startVolume;

		if (volumeRange) {
			volumeRange.value = startVolume;
			updateVolumeIcon(startVolume);
			volumeRange.addEventListener('input', changeVolume);
		}

		musicBtn.addEventListener('click', togglePlay);
		nextTrackBtn.addEventListener('click', nextTrack);
		prevTrackBtn.addEventListener('click', prevTrack);

		soundtrack.addEventListener('ended', nextTrack);
	}

	// ===== Обработчики для иконок соцсетей =====
	document.querySelectorAll('.icon-btn').forEach(btn => {
		let isTouchInteraction = false;
		let isAnimating = false;
		let interactionTimer;

		btn.addEventListener('touchstart', function () {
			if (isAnimating) return;

			isAnimating = true;
			isTouchInteraction = true;

			startInteraction(this);
		}, { passive: true });

		btn.addEventListener('touchend', function () {
			endInteraction(this);

			setTimeout(() => {
				window.open(this.href, '_blank');
				isAnimating = false;
			}, 120);
		}, { passive: true });

		btn.addEventListener('click', function (event) {
			if (isTouchInteraction || isAnimating) return;

			event.preventDefault();
			isAnimating = true;

			startInteraction(this);

			setTimeout(() => {
				endInteraction(this);
				window.open(this.href, '_blank');
				isAnimating = false;
			}, isTouchDevice ? 150 : 300);
		});

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

	// ===== Сброс анимаций при возврате на страницу =====
	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'visible') {
			document.querySelectorAll('.icon-btn').forEach(btn => {
				btn.classList.remove('interacting', 'active');
				btn.style.transform = '';
			});
		}
	});

	console.log('Matrix Portfolio initialized v2.1');
});