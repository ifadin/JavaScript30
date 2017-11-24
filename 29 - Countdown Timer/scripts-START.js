'use strict';

function toTimeString(millis) {
    const seconds = Math.round(millis / 1000),
        scaledMinutes = Math.floor(seconds / 60),
        scaledSeconds = seconds - scaledMinutes * 60;

    return `${scaledMinutes < 10 ? '0' : ''}${scaledMinutes}:${scaledSeconds < 10 ? '0' : ''}${scaledSeconds}`;
}

function updateTimer(timer, diffMillis) {
    timer.textContent = toTimeString(diffMillis);
}

function startTimer(timer, thenMillis, state) {
    clearInterval(state.activeTimer);

    const id = setInterval(() => {
        const diff = thenMillis - Date.now();

        console.log(diff);
        updateTimer(timer, diff);

        if (diff <= 0) {
            updateTimer(timer, 0);
            clearInterval(id);
        }
    }, 1000);

    state.activeTimer = id;

    return id;
}

function startAnimationTimer(timer, thenMillis, state) {
    if (state.activeAnimation) {
        window.cancelAnimationFrame(state.activeAnimation);
    }

    const id = window.requestAnimationFrame(t => {
        const diff = thenMillis - Date.now();

        updateTimer(timer, diff);

        if (diff <= 0) {
            updateTimer(timer, 0);
            window.cancelAnimationFrame(id);
        }

        startAnimationTimer(timer, thenMillis, state);
    });

    state.activeAnimation = id;

    return id;
}

function updateTimeBack(timeBackEl, time) {
    timeBackEl.textContent = `Back at ${time.toLocaleTimeString()}`;
}


const
    timer = document.querySelector(`.display__time-left`),
    animTimer = document.querySelector(`.animation_timer`),
    timeBack = document.querySelector(`.display__end-time`),
    buttons = document.querySelectorAll(`.timer__button`),
    form = document.customForm,
    state = {activeTimer: null, activeAnimation: null}
;

buttons.forEach(b => b.addEventListener('click', e => {
    const stepMilli = parseInt(b.dataset.time) * 1000,
        time = Date.now() + stepMilli;

    startTimer(timer, time, state);
    startAnimationTimer(animTimer, time, state);

    updateTimeBack(timeBack, new Date(time));
}));

form.addEventListener('submit', e => {
    e.preventDefault();

    const minutes = form.minutes.value,
        time = Date.now() + minutes * 60 * 1000;

    startTimer(timer, time, state);
    startAnimationTimer(animTimer, time, state);

    form.reset();
});
