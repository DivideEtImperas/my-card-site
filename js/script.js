'use strict';

/**
 * Matrix Portfolio - интерактивная визитка
 * @author Eduard Golyshev
 * @version 2.2
 */

document.addEventListener('DOMContentLoaded', function () {
	// ===== Elements =====
	const soundtrack = document.getElementById('soundtrack');
	const musicBtn = document.getElementById('musicBtn');
	const prevTrackBtn = document.getElementById('prevTrackBtn');
	const nextTrackBtn = document.getElementById('nextTrackBtn');
	const musicStatus = document.getElementById('musicStatus');
	const trackTitle = document.getElementById('trackTitle');
	const volumeRange = document.getElementById('volumeRange');
	const volumeIcon = document.querySelector('.music-player__volume-icon');

	// ===== Tracks =====
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
			title: 'Matrix Track 10',
			src: 'audio/hive-ultrasonic-sound.mp3'
		},
		{
			title: 'Matrix Track 11',
			src: 'audio/monster-magnet-look-to-your-orb-for-the-warning.mp3'
		},
		{
			title: 'Matrix Track 12',
			src: 'audio/rammstein-du-hast.mp3'
		},
		{
			title: 'Matrix Track 13',
			src: 'audio/rage-against-the-machine-wake-up.mp3'
		}
	];

	let currentTrackIndex = 0;
	const DEFAULT_VOLUME = 0.6;

	function playBeep() {
		if (localStorage.getItem('soundAllowed') !== 'true') return;

		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.type = 'sine';
			oscillator.frequency.value = 800;

			gainNode.gain.value = 0.04;

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.08);
		} catch (error) {
			console.error('Web Audio error:', error);
		}
	}

	function updatePlayerUI(isPlaying = false) {
		if (!soundtrack || !musicBtn || !musicStatus || !trackTitle) return;

		const currentTrack = tracks[currentTrackIndex];
		const icon = musicBtn.querySelector('i');

		trackTitle.textContent = currentTrack.title;
		musicStatus.textContent = isPlaying ? 'Играет' : 'Пауза';

		musicBtn.classList.toggle('is-playing', isPlaying);
		musicBtn.setAttribute('aria-label', isPlaying ? 'Поставить музыку на паузу' : 'Включить музыку');

		if (icon) {
			icon.classList.toggle('fa-play', !isPlaying);
			icon.classList.toggle('fa-pause', isPlaying);
		}
	}

	function normalizeTrackIndex(index) {
		if (index < 0) {
			return tracks.length - 1;
		}

		if (index >= tracks.length) {
			return 0;
		}

		return index;
	}

	function loadTrack(index) {
		if (!soundtrack || tracks.length === 0) return;

		currentTrackIndex = normalizeTrackIndex(index);

		soundtrack.src = tracks[currentTrackIndex].src;
		soundtrack.load();

		updatePlayerUI(false);
	}

	async function playTrack() {
		if (!soundtrack) return;

		try {
			await soundtrack.play();

			localStorage.setItem('soundAllowed', 'true');
			updatePlayerUI(true);
		} catch (error) {
			console.error('Audio play error:', error);

			if (musicStatus) {
				musicStatus.textContent = 'Заблокировано';
			}
		}
	}

	function pauseTrack() {
		if (!soundtrack) return;

		soundtrack.pause();
		updatePlayerUI(false);
	}

	async function togglePlay() {
		if (!soundtrack) return;

		if (soundtrack.paused) {
			await playTrack();
		} else {
			pauseTrack();
		}
	}

	async function nextTrack() {
		if (!soundtrack) return;

		const wasPlaying = !soundtrack.paused;

		loadTrack(currentTrackIndex + 1);

		if (wasPlaying) {
			await playTrack();
		}
	}

	async function prevTrack() {
		if (!soundtrack) return;

		const wasPlaying = !soundtrack.paused;

		loadTrack(currentTrackIndex - 1);

		if (wasPlaying) {
			await playTrack();
		}
	}

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

	function changeVolume() {
		if (!soundtrack || !volumeRange) return;

		const volume = Number(volumeRange.value);

		soundtrack.volume = volume;
		localStorage.setItem('musicVolume', String(volume));

		updateVolumeIcon(volume);
	}

	function initMusicPlayer() {
		if (
			!soundtrack ||
			!musicBtn ||
			!prevTrackBtn ||
			!nextTrackBtn ||
			!musicStatus ||
			!trackTitle
		) {
			return;
		}

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

	function initSocialLinks() {
		document.querySelectorAll('.icon-btn').forEach(link => {
			link.addEventListener('click', playBeep);
		});
	}

	function resetAnimationsOnReturn() {
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState === 'visible') {
				document.querySelectorAll('.icon-btn').forEach(link => {
					link.classList.remove('interacting', 'active');
					link.style.transform = '';
				});
			}
		});
	}

	initMusicPlayer();
	initSocialLinks();
	resetAnimationsOnReturn();

	console.log('Matrix Portfolio initialized v2.2');
});