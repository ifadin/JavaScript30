'use strict';

function hexToRgb(hex) {
    const bigint = parseInt(hex, 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;

    return [r, g, b];
}

function startPlayback(webcam) {
    return navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(stream => {
            webcam.srcObject = stream;
            webcam.play();
        }).catch(console.error);
}

function chromaKeyEffect(imgData, colorInput) {
    const [R, G, B] = hexToRgb(colorInput.value.replace(/#/, '')),
        delta = 150,
        data = imgData.data,
        isChromaColor = (r, g, b) =>
            Math.abs(R - r) < delta &&
            Math.abs(G - g) < delta &&
            Math.abs(B - b) < delta;

    for (let i = 0; i < data.length; i += 4) {
        if (isChromaColor(data[i], data[i + 1], data[i + 2])) {
            data[i + 3] = 0;
        }
    }

    return imgData;
}

function applyEffects(imgData, colorInput) {
    return chromaKeyEffect(imgData, colorInput);
}

function paintToCanvas(video, ctx, offCtx, colorInput) {
    offCtx.drawImage(video, 0, 0, offCtx.canvas.width, offCtx.canvas.height);

    offCtx.putImageData(
        applyEffects(offCtx.getImageData(0, 0, offCtx.canvas.width, offCtx.canvas.height), colorInput),
        0, 0
    );

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(offCtx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);

    return window.requestAnimationFrame(() => paintToCanvas(...arguments));
}

const webcam = document.querySelector('.webcam_orig'),
    canvas = document.querySelector('.webcam_chroma'),
    offCanvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    offCtx = offCanvas.getContext('2d'),
    colorInput = document.querySelector('.chroma_color'),
    player = document.querySelector('.player');

startPlayback(webcam);

player.addEventListener('click', e => player[player.paused ? 'play' : 'pause']());

webcam.addEventListener('canplay', e => {
    const aspectRatio = webcam.videoWidth / webcam.videoHeight,
        cHeight = canvas.offsetHeight, // fixed% by css
        cWidth = Math.floor(cHeight * aspectRatio);

    canvas.setAttribute('width', `${cWidth}px`);
    canvas.setAttribute('height', `${cHeight}px`);

    offCanvas.setAttribute('width', `${webcam.videoWidth}px`);
    offCanvas.setAttribute('height', `${webcam.videoHeight}px`);

    paintToCanvas(webcam, ctx, offCtx, colorInput);
});
