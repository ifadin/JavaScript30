'use strict';

function startPlayback(webcam) {
    return navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(stream => {
            webcam.srcObject = stream;
            webcam.play();
        }).catch(console.error);
}

function applyEffects(imgData) {
    //TODO: chroma key
    return imgData;
}

function paintToCanvas(video, ctx) {
    ctx.drawImage(video, 0, 0,ctx.canvas.width, ctx.canvas.height);
    //TODO: effects on off canvas, then redraw and scale to main canvas
    /*ctx.putImageData(
        applyEffects(offCtx.getImageData(0, 0, offCtx.canvas.width, offCtx.canvas.height)),
        0, 0
    );*/
    return window.requestAnimationFrame(() => paintToCanvas(...arguments));
}

const webcam = document.querySelector('.webcam_orig'),
    canvas = document.querySelector('.webcam_chroma'),
    offCanvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    offCtx = offCanvas.getContext('2d'),
    strip = document.querySelector('.strip'),
    snap = document.querySelector('.snap'),
    cWidth = 75;

startPlayback(webcam);

webcam.addEventListener('canplay', e => {
    const aspectRatio = webcam.videoWidth / webcam.videoHeight,
        cHeight = Math.floor(cWidth / aspectRatio);

    canvas.setAttribute('width', `${canvas.offsetWidth}px`);
    canvas.setAttribute('height', `${canvas.offsetHeight}px`);//TODO: aspect
    offCanvas.width = webcam.videoWidth;
    offCanvas.heigth = webcam.videoHeight;

    paintToCanvas(webcam, ctx, offCtx);
});
