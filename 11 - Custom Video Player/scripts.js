function togglePlayback(e, video) {

    return video.paused ? video.play() : video.pause();
}

function updateButton(e, button) {
    button.textContent = e.type === 'play' ? '❚ ❚' : '►';
}

function updateProgress(e, video, bar) {
    const per = video.currentTime / video.duration * 100;

    bar.style['flex-basis'] = `${per}%`;
}

const player = document.querySelector(`.player`),
    video = player.querySelector(`video`),
    progress = player.querySelector(`.progress`),
    progressBar = player.querySelector(`.progress__filled`),
    playButton = player.querySelector(`.toggle`),
    sliders = player.querySelectorAll(`.player__slider`),
    skipButtons = player.querySelectorAll(`button[data-skip]`)
;

// stop/start
video.addEventListener('click', e => togglePlayback(e, video));
playButton.addEventListener('click', e => togglePlayback(e, video));

video.addEventListener('play', e => updateButton(e, playButton));
video.addEventListener('pause', e => updateButton(e, playButton));


// progress
video.addEventListener('timeupdate', e => updateProgress(e, video, progressBar));

// progress - scrubbing
let scrubbing = false;

progress.addEventListener('mousedown', e => scrubbing = true);
progress.addEventListener('mouseup', e => scrubbing = false);

function scrub(e, video) {
    video.currentTime = e.offsetX / e.currentTarget.offsetWidth * video.duration;
}

progress.addEventListener('click', e => scrub(e, video));
progress.addEventListener('mousemove', e => scrubbing && scrub(e, video));

// skip
function skipTime(e, video) {
    const skipTime = parseFloat(e.target.dataset.skip);

    return video.currentTime += skipTime;
}

skipButtons.forEach(b => b.addEventListener('click', e => skipTime(e, video)));

// sliders
function adjust(e, video) {
    const slider = e.currentTarget;
    video[slider.name] = slider.value;
}

sliders.forEach(s => s.addEventListener('change', e => adjust(e, video)));
