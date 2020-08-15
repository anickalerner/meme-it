'use strict';

const PREVIEW_PADDING = 3;

function renderSavedMemes() {
    document.querySelector('.mymemes-container .gallery').innerHTML = '';
    var memes = getStoredMemes();
    if (!memes || memes.length === 0) return;

    memes.forEach(memeId => {
        var elCanvas = document.createElement('canvas');
        elCanvas.setAttribute('id', memeId);
        elCanvas.setAttribute('width', 200);
        elCanvas.setAttribute('height', 200);
        document.querySelector('.mymemes-container .gallery').append(elCanvas);
        var meme = loadFromStorage(getMemeSaveName(memeId));
        renderMemePreview(elCanvas, meme);
        elCanvas.addEventListener('click', function(){
            gMeme = meme;
            updateView('editor');
            renderMeme();        
        });
    });
    showNavBtn('.mymemes-btn');
}

function renderMemePreview(canvas, meme) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.onload = function () {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        meme.lines.forEach((line, ind) => {
            var x = line.x;
            var y = line.y;
            context.font = `${line.size / 2}px ${line.font}`;
            context.fillStyle = line.color;
            context.strokeStyle = line.outline;
            context.lineWidth = 2;
            context.fillText(line.txt, x, y);
            context.strokeText(line.txt, x, y);
        });

    }
    img.src = getImageUrl(meme.selectedImgId);
}
